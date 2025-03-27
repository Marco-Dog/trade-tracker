// 交易資料（示範）
const transactions = [
    { stock: "BJTM", lot: 1, price: 680, total: 68000, status: "Open" },
    { stock: "UNVR", lot: 2, price: 4640, total: 928000, status: "Match" },
    { stock: "SIDO", lot: 10, price: 740, total: 740000, status: "Match" },
    { stock: "NICL", lot: 2, price: 50, total: 10000, status: "Withdrawal" },
];

document.addEventListener("DOMContentLoaded", () => {
    renderTransactions();
});

// **渲染交易記錄**
function renderTransactions() {
    const list = document.getElementById("transaction-list");
    list.innerHTML = ""; 

    transactions.forEach((tx) => {
        const item = document.createElement("div");
        item.classList.add("transaction-item");
        item.innerHTML = `
            <div>
                <p>${tx.stock}</p>
                <p>${tx.lot} Lot</p>
                <p>Rp ${tx.total.toLocaleString()}</p>
            </div>
            <span class="status ${tx.status.toLowerCase()}">${tx.status}</span>
        `;
        list.appendChild(item);
    });
}

// **切換頁籤**
function switchTab(tab) {
    document.getElementById("stocks-tab").classList.toggle("hidden", tab !== "stocks");
    document.getElementById("options-tab").classList.toggle("hidden", tab !== "options");

    document.querySelectorAll(".tab-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.textContent.includes(tab === "stocks" ? "正股" : "選擇權"));
    });
}

// **儲存資料到 Google Sheets**
function saveToGoogleSheets() {
    fetch("https://script.google.com/macros/s/AKfycbwQpLcNvPhltGtV-Ks_o1KnF355p3RppEd4I37k2lV8dfKrrtDzA8hxYHNXxEk7OfndqA/exec", {
        method: "POST",
        body: JSON.stringify({ transactions }),
        headers: { "Content-Type": "application/json" },
    })
    .then(response => response.json())
    .then(data => alert("資料已成功儲存！"))
    .catch(error => console.error("Error:", error));
}
