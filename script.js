function saveToGoogleSheets(stockCode, buyPrice, quantity) {
    fetch("你的 Google Apps Script 網址", {
        method: "POST",
        body: JSON.stringify({ stockCode, buyPrice, quantity }),
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.text())
    .then(data => console.log("Google Sheets 回應:", data))
    .catch(error => console.error("錯誤:", error));
}

document.addEventListener("DOMContentLoaded", function() {
    saveToGoogleSheets("2330", 600, 10);
});
