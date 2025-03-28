// 將資料儲存至 Google Sheets
function saveTransactionToSheet(transaction) {
  // 假設 Google Sheets API 設置完成
  const sheetId = 'your_google_sheet_id'; // 請替換為實際的 Google Sheets ID
  const range = 'A1'; // 起始位置
  const values = [
    [transaction.date, transaction.currency, transaction.action, transaction.price, transaction.quantity, transaction.fee, transaction.note]
  ];

  const requestBody = {
    values: values
  };

  const request = gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: range,
    valueInputOption: 'RAW',
    resource: requestBody
  });

  request.then(response => {
    console.log('儲存成功:', response);
  }, error => {
    console.error('儲存失敗:', error);
  });
}
