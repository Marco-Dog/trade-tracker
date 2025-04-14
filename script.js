document.addEventListener("DOMContentLoaded", () => {
  /* ------------------------ 📌 頁籤切換 ------------------------ */
  const navLinks = document.querySelectorAll("nav a");
  const sections = document.querySelectorAll(".page-section");

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.dataset.target;

      // 顯示對應 section，隱藏其他
      sections.forEach(sec => sec.classList.remove("active"));
      document.getElementById(targetId).classList.add("active");

      // 更新導覽列 active 樣式（可選）
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // 預設顯示第一個區塊
  document.querySelector(".page-section").classList.add("active");

  /* ------------------------ ⚙️ 選擇權策略操作 ------------------------ */
  const addLegBtn = document.getElementById("addLeg");
  const legsContainer = document.getElementById("legsContainer");

  addLegBtn.addEventListener("click", () => {
    const leg = document.createElement("div");
    leg.className = "leg-row";
    leg.innerHTML = `
      <select class="tradetype">
        <option value="buy">Buy</option>
        <option value="sell">Sell</option>
      </select>
      <select class="side">
        <option value="call">Call</option>
        <option value="put">Put</option>
      </select>
      <input type="number" class="strike" placeholder="履約價" step="0.001" required />
      <input type="number" class="price" placeholder="價格" step="0.001" required />
      <input type="number" class="qty" placeholder="數量" required />
      <input type="text" class="note" placeholder="備註" />
      <button type="button" class="remove-leg">❌</button>
    `;
    legsContainer.appendChild(leg);
  });

  legsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-leg")) {
      e.target.parentElement.remove();
    }
  });

  /* ------------------------ 📋 選擇權策略紀錄 ------------------------ */
  const strategyForm = document.getElementById("strategyForm");
  const strategyTable = document.getElementById("strategyTable");

  // 從 localStorage 加載選擇權策略紀錄
  const loadStrategies = () => {
    const strategies = JSON.parse(localStorage.getItem("strategies")) || [];
    strategies.forEach(strategy => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${strategy.strategyName}</td>
        <td>${strategy.expiry}</td>
        <td>${strategy.optionid.toUpperCase()}</td>
        <td>${strategy.legs}</td>
        <td><span class="status-tag status-open">Open</span></td>
        <td>
          <button class="close-row">平倉</button>
          <button class="delete-row">刪除</button>
        </td>
      `;
      strategyTable.appendChild(row);
    });
  };

  loadStrategies();

  strategyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const strategyName = document.getElementById("strategyName").value || "未命名";
    const expiry = document.getElementById("expiry").value;
    const optionid = document.getElementById("optionid").value;

    const legs = [...document.querySelectorAll("#legsContainer .leg-row")].map((row) => {
      const type = row.querySelector(".tradetype").value;
      const side = row.querySelector(".side").value;
      const strike = row.querySelector(".strike").value;
      const price = row.querySelector(".price").value;
      const qty = row.querySelector(".qty").value;
      return `${type}/${side} ${qty} @ ${strike}($${price})`;
    }).join("<br>");

    const strategy = { strategyName, expiry, optionid, legs };

    // 新增策略到 localStorage
    const strategies = JSON.parse(localStorage.getItem("strategies")) || [];
    strategies.push(strategy);
    localStorage.setItem("strategies", JSON.stringify(strategies));

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${strategyName}</td>
      <td>${expiry}</td>
      <td>${optionid.toUpperCase()}</td>
      <td>${legs}</td>
      <td><span class="status-tag status-open">Open</span></td>
      <td>
        <button class="close-row">平倉</button>
        <button class="delete-row">刪除</button>
      </td>
    `;
    strategyTable.appendChild(row);
    strategyForm.reset();
    document.querySelector("#legsContainer").innerHTML = "";
  });

  strategyTable.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-row")) {
      const row = e.target.closest("tr");
      row.remove();

      // 從 localStorage 刪除該筆策略紀錄
      const strategyName = row.querySelector("td:nth-child(1)").textContent;
      const strategies = JSON.parse(localStorage.getItem("strategies")) || [];
      const updatedStrategies = strategies.filter(strategy => strategy.strategyName !== strategyName);
      localStorage.setItem("strategies", JSON.stringify(updatedStrategies));
    }
    if (e.target.classList.contains("close-row")) {
      const row = e.target.closest("tr");
      const modal = document.getElementById("closeModal");
      const closePriceInput = document.getElementById("closePrice");
      const closeForm = document.getElementById("closeForm");

      // 顯示 Modal 視窗
      modal.style.display = "block";

      // 處理表單提交
      closeForm.onsubmit = function (e) {
        e.preventDefault();

        const closePrice = parseFloat(closePriceInput.value);
        if (isNaN(closePrice)) return alert("請輸入有效的數字！");

        // 解析 legs，這裡假設單腳，若為多腳策略，可依需求進一步調整
        const legHTML = row.querySelectorAll("td")[3].innerHTML;
        const match = legHTML.match(/(Buy|Sell)\/\w+ (\d+) @ [\d.]+\(.*?([\d.]+)\)/i);
        if (!match) return alert("解析失敗");

        const type = match[1].toLowerCase(); // buy or sell
        const qty = parseFloat(match[2]);
        const entryPrice = parseFloat(match[3]);

        const cost = entryPrice * qty;
        const exit = closePrice * qty;
        const pnl = type === "buy" ? (exit - cost) : (cost - exit);
        const roi = ((pnl / cost) * 100).toFixed(2);
        const pnlDisplay = pnl >= 0 ? `<span style="color:#4caf50;">+${pnl.toFixed(2)}</span>` : `<span style="color:#f44336;">${pnl.toFixed(2)}</span>`;

        // 更新狀態為已平倉
        row.dataset.closed = "true";
        row.querySelector(".status-tag").textContent = "Closed";
        row.querySelector(".status-tag").classList.remove("status-open");
        row.querySelector(".status-tag").classList.add("status-closed");

        // 新增平倉明細顯示
        const closeDate = new Date().toISOString().split("T")[0];
        const detailRow = document.createElement("tr");
        detailRow.classList.add("strategy-detail-row");
        detailRow.innerHTML = `
          <td colspan="6" style="text-align: left;">
            <strong>📅 平倉日期：</strong> ${closeDate}　
            <strong>💰 損益：</strong> ${pnlDisplay}　
            <strong>📈 投報率：</strong> ${roi}%
          </td>
        `;
        row.after(detailRow);

        // 隱藏 Modal
        modal.style.display = "none";

        // 更新 LocalStorage
        const strategies = JSON.parse(localStorage.getItem("strategies")) || [];
        const updatedStrategies = strategies.map(strategy => {
          if (strategy.strategyName === row.querySelector("td:nth-child(1)").textContent) {
            strategy.status = "Closed";
            strategy.closeDate = closeDate;
            strategy.pnl = pnlDisplay;
            strategy.roi = roi;
          }
          return strategy;
        });
        localStorage.setItem("strategies", JSON.stringify(updatedStrategies));
      };
    }
  });

  // 關閉 Modal
  const modal = document.getElementById("closeModal");
  const closeBtn = document.querySelector(".close");
  closeBtn.onclick = () => {
    modal.style.display = "none";
  };
});
