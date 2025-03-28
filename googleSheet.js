// Google Sheets API URL
const GOOGLE_SHEET_API_URL = "https://script.google.com/macros/s/AKfycbwaAWEFQbS127UQbM96ZCioC7pRDbx9swiqdDzCz_irCaq5paa5z-EuR5YZ1gkx882L/exec";

// 儲存交易紀錄到 Google Sheets
async function saveTransactionToSheet(transaction) {
  try {
    const response = await fetch(GOOGLE_SHEET_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    });

    const result = await response.json();
    if (result.success) {
      alert("交易紀錄已成功儲存！");
    } else {
      alert("儲存交易紀錄失敗，請稍後再試！");
    }
  } catch (error) {
    console.error("儲存交易紀錄時發生錯誤:", error);
    alert("發生錯誤，請稍後再試！");
  }
}

// 處理交易紀錄表單提交
function handleFormSubmit(event) {
  event.preventDefault();

  const transaction = {
    date: document.getElementById("transaction-date").value,
    currency: document.getElementById("transaction-currency").value,
    type: document.getElementById("transaction-type").value,
    price: parseFloat(document.getElementById("transaction-price").value),
    quantity: parseFloat(document.getElementById("transaction-quantity").value),
    fee: parseFloat(document.getElementById("transaction-fee").value),
    note: document.getElementById("transaction-note").value,
  };

  // 儲存交易紀錄
  saveTransactionToSheet(transaction);
}

// 設定表單提交事件
document.getElementById("transaction-form").addEventListener("submit", handleFormSubmit);
