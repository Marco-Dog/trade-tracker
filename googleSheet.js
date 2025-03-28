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
