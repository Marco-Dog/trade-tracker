const scriptURL = "https://script.google.com/macros/s/AKfycbwQpLcNvPhltGtV-Ks_o1KnF355p3RppEd4I37k2lV8dfKrrtDzA8hxYHNXxEk7OfndqA/exec";

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    document.getElementById(tabId).style.display = 'block';
}

document.getElementById('stockForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const stock = {
        type: "stock",
        stockCode: document.getElementById('stockCode').value,
        tradeType: document.getElementById('stockTradeType').value,
        tradeDate: document.getElementById('stockTradeDate').value,
        tradePrice: document.getElementById('stockTradePrice').value,
        quantity: document.getElementById('stockTradeQty').value
    };
    fetch(scriptURL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(stock) })
        .then(response => {
            alert('股票記錄已提交');
            loadStockData();  // 重新加載股票資料
        })
        .catch(error => alert('提交失敗: ' + error.message));
});

function loadStockData() {
    fetch(scriptURL)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#stockTable tbody');
            let totalProfit = 0;
            let totalAmountInvested = 0;
            let totalAmountReceived = 0;
            tableBody.innerHTML = '';
            data.forEach((item, index) => {
                const row = document.createElement('tr');
                const profitOrLoss = (item.tradeType === "賣出" ? (item.tradePrice - item.buyPrice) * item.quantity : 0);
                totalProfit += profitOrLoss;
                totalAmountInvested += (item.tradeType === "買入" ? item.tradePrice * item.quantity : 0);
                totalAmountReceived += (item.tradeType === "賣出" ? item.tradePrice * item.quantity : 0);

                row.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.tradeType}</td>
                    <td>${item.stockCode}</td>
                    <td>${item.tradeDate}</td>
                    <td>${item.tradePrice}</td>
                    <td>${item.quantity}</td>
                    <td>
                        <button class="edit" onclick="editStock(${index})">修改</button>
                        <button class="delete" onclick="deleteStock(${index})">刪除</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            // Update summary (Total Profit, Annual Return)
            const annualReturn = totalProfit / totalAmountInvested * 100; // Example calculation
            document.getElementById('totalProfit').innerText = totalProfit.toFixed(2);
            document.getElementById('annualReturn').innerText = annualReturn.toFixed(2);
        });
}

function editStock(index) {
    alert("編輯功能待實作"); // 您可以在這裡實作編輯功能
}

function deleteStock(index) {
    alert("刪除功能待實作"); // 您可以在這裡實作刪除功能
}

document.addEventListener('DOMContentLoaded', function() {
    loadStockData();  // 頁面加載時加載股票資料
});
