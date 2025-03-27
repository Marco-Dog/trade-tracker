const scriptURL = "https://script.google.com/macros/s/AKfycbwQpLcNvPhltGtV-Ks_o1KnF355p3RppEd4I37k2lV8dfKrrtDzA8hxYHNXxEk7OfndqA/exec";

// 顯示特定頁籤
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    document.getElementById(tabId).style.display = 'block';
}

// 新增股票交易記錄
document.getElementById('stockForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const stock = {
        action: "add",
        type: "stock",
        stockCode: document.getElementById('stockCode').value,
        tradeType: document.getElementById('stockTradeType').value,
        tradeDate: document.getElementById('stockTradeDate').value,
        tradePrice: document.getElementById('stockTradePrice').value,
        tradeQty: document.getElementById('stockTradeQty').value
    };

    fetch(scriptURL, { method: 'POST', body: JSON.stringify(stock) })
        .then(response => response.json())
        .then(data => {
            alert('股票交易記錄已提交，ID: ' + data.id);
            document.getElementById('stockForm').reset();
        })
        .catch(error => alert('提交失敗: ' + error.message));
});

// 新增選擇權交易記錄
document.getElementById('optionsForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const option = {
        action: "add",
        type: "option",
        optionCode: document.getElementById('optionCode').value,
        tradeType: document.getElementById('optionTradeType').value,
        tradeDate: document.getElementById('optionTradeDate').value,
        tradePrice: document.getElementById('optionTradePrice').value,
        tradeQty: document.getElementById('optionTradeQty').value,
        contract: document.getElementById('optionContract').value
    };

    fetch(scriptURL, { method: 'POST', body: JSON.stringify(option) })
        .then(response => response.json())
        .then(data => {
            alert('選擇權交易記錄已提交，ID: ' + data.id);
            document.getElementById('optionsForm').reset();
        })
        .catch(error => alert('提交失敗: ' + error.message));
});

// 修改交易記錄
function editRecord(id) {
    const row = document.getElementById(id);
    const data = {
        action: "edit",
        id: id,
        tradeType: row.cells[4].innerText,
        tradeDate: row.cells[5].innerText,
        tradePrice: row.cells[6].innerText,
        tradeQty: row.cells[7].innerText
    };

    fetch(scriptURL, { method: 'POST', body: JSON.stringify(data) })
        .then(response => response.text())
        .then(responseText => {
            alert('交易記錄已更新');
        })
        .catch(error => alert('更新失敗: ' + error.message));
}

// 刪除交易記錄
function deleteRecord(id) {
    const data = {
        action: "delete",
        id: id
    };

    fetch(scriptURL, { method: 'POST', body: JSON.stringify(data) })
        .then(response => response.text())
        .then(responseText => {
            document.getElementById(id).remove();
            alert('交易記錄已刪除');
        })
        .catch(error => alert('刪除失敗: ' + error.message));
}

// 顯示所有交易紀錄
function loadTransactions() {
    // 此處應該是從 Google Sheets 抓取所有資料並顯示在表格中
    // 可用於一開始載入頁面時填充資料
    // 目前此範例無法實現，需搭配 Google Sheets API 或進一步的實作
}

document.addEventListener('DOMContentLoaded', function() {
    loadTransactions();  // 載入交易紀錄
});
