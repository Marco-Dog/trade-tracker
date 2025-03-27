const GOOGLE_SHEETS_API_URL = "https://script.google.com/macros/s/AKfycbwQpLcNvPhltGtV-Ks_o1KnF355p3RppEd4I37k2lV8dfKrrtDzA8hxYHNXxEk7OfndqA/exec";

document.getElementById("tradeForm").addEventListener("submit", function(event) {
    event.preventDefault(); // 防止表單提交刷新頁面

    let stockCode = document.getElementById("stockCode").value;
    let buyPrice = document.getElementById("buyPrice").value;
    let quantity = document.getElementById("quantity").value;

    // 檢查輸入是否完整
    if (!stockCode || !buyPrice || !quantity) {
        document.getElementById("statusMessage").textContent = "請輸入完整資訊";
        return;
    }

    let tradeData = {
        stockCode: stockCode,
        buyPrice: parseFloat(buyPrice),
        quantity: parseInt(quantity),
    };

    fetch(GOOGLE_SHEETS_API_URL, {
        method: "POST",
        body: JSON.stringify(tradeData),
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.text())
    .then(data => {
        console.log("Google Sheets 回應:", data);
        document.getElementById("statusMessage").textContent = "交易紀錄已成功提交！";
    })
    .catch(error => {
        console.error("錯誤:", error);
        document.getElementById("statusMessage").textContent = "提交失敗，請稍後再試！";
    });

    // 清空輸入欄位
    document.getElementById("tradeForm").reset();
});
