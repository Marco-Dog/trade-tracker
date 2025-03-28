// 即時報價區域更新
async function updateQuotes() {
  const apiUrl = 'https://script.google.com/macros/s/AKfycbwaAWEFQbS127UQbM96ZCioC7pRDbx9swiqdDzCz_irCaq5paa5z-EuR5YZ1gkx882L/exec';
  const currencies = ['BTC', 'ETH', 'ADA', 'DOGE', 'SHIB']; // 定義五個幣別
  const response = await fetch(apiUrl);
  const data = await response.json();

  // 確保 API 回傳的數據有正確的結構
  if (data && data.rates) {
    const rates = data.rates;
    
    // 更新每個幣別的即時報價
    currencies.forEach(currency => {
      const currencyRate = rates[currency];
      const quoteContainer = document.getElementById('quotes-container');

      const quoteElement = document.createElement('div');
      quoteElement.classList.add('quote');
      quoteElement.innerHTML = `
        <p class="currency-name">${currency}</p>
        <p class="quote-value" id="${currency.toLowerCase()}-price">${currencyRate ? `$${currencyRate}` : '--'}</p>
        <p class="position-info">持倉量: <span id="${currency.toLowerCase()}-position">0</span> | 獲利: <span id="${currency.toLowerCase()}-profit">0</span> | 報酬率: <span id="${currency.toLowerCase()}-return">0%</span></p>
      `;
      
      // 顯示結果
      quoteContainer.appendChild(quoteElement);
    });
  } else {
    console.error('API 回傳的數據格式錯誤或無法取得數據');
  }
}

// 交易紀錄添加
document.getElementById('transaction-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const date = document.getElementById('date').value;
  const currency = document.getElementById('currency').value;
  const action = document.getElementById('action').value;
  const price = document.getElementById('price').value;
  const quantity = document.getElementById('quantity').value;
  const fee = document.getElementById('fee').value;
  const note = document.getElementById('note').value;

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

// 頁面載入時即更新即時報價
updateQuotes();
