const scriptURL = "https://script.google.com/macros/s/AKfycbwaAWEFQbS127UQbM96ZCioC7pRDbx9swiqdDzCz_irCaq5paa5z-EuR5YZ1gkx882L/exec";

// 顯示指定的頁籤
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    document.getElementById(tabId).style.display = 'block';
}

// 提交股票交易表單
document.getElementById('stockForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const stock = {
        type: "stock",
        stockCode: document.getElementById('stockCode').value,
        tradeType: document.getElementById('tradeType').value,
        tradeDate: document.getElementById('tradeDate').value,
        tradePrice: document.getElementById('tradePrice').value,
        tradeQty: document.getElementById('tradeQty').value
    };

    fetch(scriptURL, { 
        method: 'POST', 
        body: JSON.stringify(stock) 
    })
    .then(response => {
        alert('股票交易記錄已提交');
        updateStockTable();  // 重新更新表格
    })
    .catch(error => {
        alert('提交失敗: ' + error.message);
    });
});

// 更新股票表格
function updateStockTable() {
    const tableBody = document.querySelector("#stockTable tbody");
    tableBody.innerHTML = ''; // 清空表格內容

    fetch(scriptURL, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.stockCode}</td>
                <td>${item.tradeType}</td>
                <td>${item.tradeDate}</td>
                <td>${item.tradePrice}</td>
                <td>${item.tradeQty}</td>
                <td>
                    <button class="edit" onclick="editRow(${item.id})">修改</button>
                    <button class="delete" onclick="deleteRow(${item.id})">刪除</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error:', error));
}

// 修改表格行
function editRow(id) {
    // 實作修改功能
    console.log('Editing row with id:', id);
    // 您可以根據需要打開表單並填充相應的資料
}

// 刪除表格行
function deleteRow(id) {
    fetch(`${scriptURL}?id=${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        alert('交易記錄已刪除');
        updateStockTable();  // 重新更新表格
    })
    .catch(error => {
        alert('刪除失敗: ' + error.message);
    });
}

// 初始化表格
document.addEventListener('DOMContentLoaded', function() {
    updateStockTable();
});
