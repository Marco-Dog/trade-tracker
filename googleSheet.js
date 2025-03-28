// 儲存交易紀錄至 Google Sheets
async function saveTransactionToSheet(transaction) {
  const apiUrl = 'https://script.google.com/macros/s/AKfycbwaAWEFQbS127UQbM96ZCioC7pRDbx9swiqdDzCz_irCaq5paa5z-EuR5YZ1gkx882L/exec';
  
  // 設定要傳送的交易紀錄資料
  const payload = {
    date: transaction.date,
    currency: transaction.currency,
    action: transaction.action,
    price: transaction.price,
    quantity: transaction.quantity,
    fee: transaction.fee,
    note: transaction.note
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (data.result === 'success') {
      console.log('交易紀錄成功儲存至 Google Sheets');
    } else {
      console.error('儲存至 Google Sheets 失敗:', data.error);
    }
  } catch (error) {
    console.error('儲存交易紀錄時發生錯誤:', error);
  }
}

// 當表單提交時儲存交易紀錄
document.getElementById('transaction-form').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const date = document.getElementById('date').value;
  const currency = document.getElementById('currency').value;
  const action = document.getElementById('action').value;
  const price = document.getElementById('price').value;
  const quantity = document.getElementById('quantity').value;
  const fee = document.getElementById('fee').value;
  const note = document.getElementById('note').value;

  // 創建交易紀錄物件
  const transaction = {
    date,
    currency,
    action,
    price,
    quantity,
    fee,
    note
  };

  // 儲存交易紀錄至 Google Sheets
  saveTransactionToSheet(transaction);

  // 顯示在頁面上的表格
  const table = document.getElementById('transaction-table').getElementsByTagName('tbody')[0];
  const row = table.insertRow();

  row.innerHTML = `
    <td>${date}</td>
    <td>${currency}</td>
    <td>${action}</td>
    <td>${price}</td>
    <td>${quantity}</td>
    <td>${fee}</td>
    <td>${note}</td>
    <td><button class="delete">刪除</button></td>
  `;

  row.querySelector('.delete').addEventListener('click', function() {
    row.remove();
  });
});
