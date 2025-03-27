const scriptURL = "https://script.google.com/macros/s/AKfycbwaAWEFQbS127UQbM96ZCioC7pRDbx9swiqdDzCz_irCaq5paa5z-EuR5YZ1gkx882L/exec";

// 提交股票交易表單
document.getElementById('stockForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const stock = {
        stockCode: document.getElementById('stockCode').value,
        tradeType: document.getElementById('tradeType').value,
        tradeDate: document.getElementById('tradeDate').value,
        tradePrice: document.getElementById('tradePrice').value,
        tradeQty: document.getElementById('tradeQty').value
    };

    // 使用 fetch 發送資料到 Google Apps Script
    fetch(scriptURL, { 
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
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

// 更新表格顯示
function updateStockTable() {
    fetch(scriptURL)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('stockTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = ""; // 清空表格
            
            data.forEach(row => {
                let tr = document.createElement('tr');
                row.forEach(cell => {
                    let td = document.createElement('td');
                    td.appendChild(document.createTextNode(cell));
                    tr.appendChild(td);
                });

                // 操作列
                let tdAction = document.createElement('td');
                let editBtn = document.createElement('button');
                editBtn.textContent = '修改';
                editBtn.onclick = function() { editRow(row); };
                let deleteBtn = document.createElement('button');
                deleteBtn.textContent = '刪除';
                deleteBtn.onclick = function() { deleteRow(row); };
                tdAction.appendChild(editBtn);
                tdAction.appendChild(deleteBtn);
                tr.appendChild(tdAction);
                
                tableBody.appendChild(tr);
            });
        })
        .catch(error => console.error('Error loading data: ', error));
}

// 修改表格資料
function editRow(row) {
    console.log('Editing row: ', row);
    // 您可以添加彈出視窗或內嵌表單，將該行資料載入以進行修改。
}

// 刪除表格資料
function deleteRow(row) {
    console.log('Deleting row: ', row);
    // 請實現刪除資料的功能。
}
