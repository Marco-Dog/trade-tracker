document.addEventListener('DOMContentLoaded', function () {
  const transactionTable = document.getElementById('transactionTable');
  const transactionForm = document.getElementById('transactionForm');
  const stockTradeData = JSON.parse(localStorage.getItem('stockTradeData')) || [];

  const strategyTable = document.getElementById('strategyTable');
  const strategyForm = document.getElementById('strategyForm');
  const optionStrategyData = JSON.parse(localStorage.getItem('optionStrategyData')) || [];

  const legsContainer = document.getElementById('legsContainer');

  const tabs = document.querySelectorAll('nav ul li a');
  const sections = document.querySelectorAll('section.page-section');

  function showSection(targetId) {
    sections.forEach(section => {
      section.style.display = (section.id === targetId) ? 'block' : 'none';
    });
    tabs.forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('data-target') === targetId);
    });
  }

  showSection('stocktrade');

  tabs.forEach(tab => {
    tab.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('data-target');
      showSection(targetId);
    });
  });

  // 股票交易表單提交
  transactionForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const date = document.getElementById('date').value;
    const stockid = document.getElementById('stockid').value;
    const type = document.getElementById('type').value;
    const price = parseFloat(document.getElementById('price').value);
    const quantity = parseInt(document.getElementById('quantity').value);
    const note = document.getElementById('note').value;

    const record = { date, stockid, type, price, quantity, note };
    stockTradeData.push(record);
    localStorage.setItem('stockTradeData', JSON.stringify(stockTradeData));
    renderTransactionTable();
    transactionForm.reset();
  });

  function renderTransactionTable() {
    transactionTable.innerHTML = '';
    stockTradeData.forEach((record, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${record.date}</td>
        <td>${record.stockid}</td>
        <td>${record.type}</td>
        <td>${record.price}</td>
        <td>${record.quantity}</td>
        <td>${record.note}</td>
        <td><button class="remove-btn" data-index="${index}">刪除</button></td>
      `;
      transactionTable.appendChild(row);
    });

    document.querySelectorAll('.remove-btn').forEach(button => {
      button.addEventListener('click', function () {
        const index = button.getAttribute('data-index');
        stockTradeData.splice(index, 1);
        localStorage.setItem('stockTradeData', JSON.stringify(stockTradeData));
        renderTransactionTable();
      });
    });
  }

  // 策略表單提交
  strategyForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const strategyName = document.getElementById('strategyName').value;
    const tradeDate = document.getElementById('tradeDate').value;
    const expiry = document.getElementById('expiry').value;
    const optionid = document.getElementById('optionid').value;
    const margin = parseFloat(document.getElementById('margin').value);
    const totalPremium = parseFloat(document.getElementById('premium').value);

    const legs = [];
    document.querySelectorAll('.leg-row').forEach((row) => {
      const tradetype = row.querySelector('.tradetype').value;
      const side = row.querySelector('.side').value;
      const strike = parseFloat(row.querySelector('.strike').value);
      const qty = parseInt(row.querySelector('.qty').value);
      const note = row.querySelector('.note').value;
      legs.push({ tradetype, side, strike, qty, note, fee: 0.66 });
    });

    const strategyRecord = {
      strategyName,
      tradeDate,
      expiry,
      optionid,
      margin,
      totalPremium,
      legs,
      closed: false,
      closeDate: '',
      closePrice: '',
      closeNote: ''
    };

    optionStrategyData.push(strategyRecord);
    localStorage.setItem('optionStrategyData', JSON.stringify(optionStrategyData));
    renderStrategyTable();
    strategyForm.reset();
    resetLegs();
  });

  function renderStrategyTable() {
    strategyTable.innerHTML = '';
    const today = new Date().toISOString().split('T')[0];

    optionStrategyData.forEach((strategy, index) => {
      const row = document.createElement('tr');
      const legsDetails = strategy.legs.map(leg => {
        const qtyPrefix = leg.tradetype === 'buy' ? '+' : '-';
        return `
          ${leg.tradetype} ${leg.side} ${leg.strike} (${qtyPrefix}${leg.qty})
          <br><small>Fee: $${leg.fee?.toFixed(2) || '0.00'}</small>
        `;
      }).join('<hr>');


      const closeDetails = strategy.closed
        ? `<hr><small>平倉日：${strategy.closeDate}<br>平倉價：${strategy.closePrice}<br>備註：${strategy.closeNote}</small>`
        : '';

      let status = '';
      if (strategy.closed) {
        status = '🟠 已平倉';
        row.style.backgroundColor = '#7B7B7B';
      } else if (strategy.expiry < today) {
        status = '🔴 已過期';
      } else {
        status = '🟢 未平倉';
      }

      row.innerHTML = `
        <td>
          ${strategy.optionid}
          <br>
          ${strategy.strategyName || '-'}
        </td>
        <td>${strategy.expiry}</td>
        <td>
          ${legsDetails}
          <br>
          <small>保證金：$${strategy.margin?.toLocaleString() || 'N/A'}</small>
        </td>
        <td>$${strategy.totalPremium?.toLocaleString() || 'N/A'}</td>
        <td>${status}</td>
        <td>${closeDetails}</td>
        <td class="td-btn">
          <div class="btn-column">
            ${!strategy.closed ? `<button class="close-btn" data-index="${index}">平倉</button>` : ''}
            <button class="remove-btn" data-index="${index}">刪除</button>
          </div>
        </td>
      `;

      strategyTable.appendChild(row);
    });

    document.querySelectorAll('.remove-btn').forEach(button => {
      button.addEventListener('click', function () {
        const index = this.getAttribute('data-index');
        optionStrategyData.splice(index, 1);
        localStorage.setItem('optionStrategyData', JSON.stringify(optionStrategyData));
        renderStrategyTable();
      });
    });

    document.querySelectorAll('.close-btn').forEach(button => {
      button.addEventListener('click', function () {
        closeIndex = parseInt(this.getAttribute('data-index'));
        modal.style.display = 'block';
      });
    });
  }

  // 新增 Leg
  document.getElementById('addLeg').addEventListener('click', function () {
    const newLegRow = document.createElement('div');
    newLegRow.classList.add('leg-row');
    newLegRow.innerHTML = `
      <select class="tradetype" required>
        <option value="sell">Sell</option>
        <option value="buy">Buy</option>
      </select>
      <select class="side" required>
        <option value="put">Put</option>
        <option value="call">Call</option>
      </select>
      <input type="number" class="strike" placeholder="履約價" step="0.001" required />
      <input type="number" class="qty" placeholder="數量" required />
      <input type="text" class="note" placeholder="備註" />
      <button type="button" class="remove-leg">❌</button>
    `;
    legsContainer.appendChild(newLegRow);

    newLegRow.querySelector('.remove-leg').addEventListener('click', function () {
      legsContainer.removeChild(newLegRow);
    });
  });

  // 重置 Legs 並綁定移除事件
  function resetLegs() {
    legsContainer.innerHTML = `
      <h4>腳部位</h4>
      <div class="leg-row">
        <select class="tradetype" required>
          <option value="sell">Sell</option>
          <option value="buy">Buy</option>
        </select>
        <select class="side" required>
          <option value="put">Put</option>
          <option value="call">Call</option>
        </select>
        <input type="number" class="strike" placeholder="履約價" step="0.001" required />
        <input type="number" class="qty" placeholder="數量" required />
        <input type="text" class="note" placeholder="備註" />
        <button type="button" class="remove-leg">❌</button>
      </div>
    `;

    const removeBtn = legsContainer.querySelector('.remove-leg');
    removeBtn.addEventListener('click', function () {
      const row = this.closest('.leg-row');
      if (row) legsContainer.removeChild(row);
    });
  }

  // Modal 控制
  let closeIndex = null;
  const modal = document.getElementById('closeModal');
  const closeModalClose = document.getElementById('closeModalClose');
  const inputCloseDate = document.getElementById('inputCloseDate');
  const inputClosePrice = document.getElementById('inputClosePrice');
  const inputCloseNote = document.getElementById('inputCloseNote');
  const confirmClose = document.getElementById('confirmClose');
  const cancelClose = document.getElementById('cancelClose');

  closeModalClose.onclick = cancelClose.onclick = function () {
    modal.style.display = 'none';
    resetModal();
  };

  window.addEventListener('click', function (e) {
    if (e.target === modal) {
      modal.style.display = 'none';
      resetModal();
    }
  });

  confirmClose.addEventListener('click', () => {
    const closeDate = inputCloseDate.value;
    const closePrice = parseFloat(inputClosePrice.value);
    const closeNote = inputCloseNote.value;

    if (!closeDate || isNaN(closePrice)) {
      alert('請輸入完整的平倉日期與價格');
      return;
    }

    const strategy = optionStrategyData[closeIndex];
    strategy.closed = true;
    strategy.closeDate = closeDate;
    strategy.closePrice = closePrice;
    strategy.closeNote = closeNote;

    localStorage.setItem('optionStrategyData', JSON.stringify(optionStrategyData));
    renderStrategyTable();
    modal.style.display = 'none';
    resetModal();
  });

  function resetModal() {
    inputCloseDate.value = '';
    inputClosePrice.value = '';
    inputCloseNote.value = '';
  }

  renderTransactionTable();
  renderStrategyTable();
  resetLegs(); // 初始化預設 Leg
});
