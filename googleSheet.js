// CoinGecko API URL
const COINGECKO_API_URL = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano,dogecoin,shiba-inu&vs_currencies=twd";

// 即時報價區域更新
async function updateQuotes() {
  try {
    const response = await fetch(COINGECKO_API_URL);
    const data = await response.json();

    // 模擬的持倉量和獲利資料，您可以根據實際情況進行動態更新
    const portfolio = {
      BTC: { position: 0.5, profit: 5000, buyPrice: 48000 },
      ETH: { position: 1, profit: -100, buyPrice: 3200 },
      ADA: { position: 100, profit: 250, buyPrice: 2.3 },
      DOGE: { position: 10000, profit: -50, buyPrice: 0.08 },
      SHIB: { position: 1000000, profit: 100, buyPrice: 0.000008 },
    };

    // 更新每個幣別的報價
    updateCurrencyData("BTC", data.bitcoin.twd, portfolio.BTC);
    updateCurrencyData("ETH", data.ethereum.twd, portfolio.ETH);
    updateCurrencyData("ADA", data.cardano.twd, portfolio.ADA);
    updateCurrencyData("DOGE", data.dogecoin.twd, portfolio.DOGE);
    updateCurrencyData("SHIB", data["shiba-inu"].twd, portfolio.SHIB);
    
  } catch (error) {
    console.error("無法取得即時報價:", error);
  }
}

// 更新每個幣別的顯示
function updateCurrencyData(currency, price, portfolio) {
  const priceElement = document.getElementById(`${currency.toLowerCase()}-price`);
  const positionElement = document.getElementById(`${currency.toLowerCase()}-position`);
  const profitElement = document.getElementById(`${currency.toLowerCase()}-profit`);
  const returnElement = document.getElementById(`${currency.toLowerCase()}-return`);

  priceElement.innerText = `${price} TWD`;
  positionElement.innerText = portfolio.position;
  profitElement.innerText = `${portfolio.profit} TWD`;
  returnElement.innerText = `${calculateReturn(portfolio.buyPrice, price)}%`;

  // 計算報酬率
  const returnRate = calculateReturn(portfolio.buyPrice, price);

  // 根據獲利顯示顏色和箭頭
  if (portfolio.profit < 0) {
    profitElement.classList.add('red');
    profitElement.innerHTML += ' <span>&#8595;</span>'; // 向下箭頭
  } else {
    profitElement.classList.add('green');
    profitElement.innerHTML += ' <span>&#8593;</span>'; // 向上箭頭
  }
}

// 計算報酬率
function calculateReturn(buyPrice, currentPrice) {
  const diff = currentPrice - buyPrice;
  const returnRate = (diff / buyPrice) * 100;
  return returnRate.toFixed(2); // 保留兩位小數
}

// 頁面載入時即更新即時報價
updateQuotes();

// 設置每 10 秒自動更新即時報價
setInterval(updateQuotes, 10000);
