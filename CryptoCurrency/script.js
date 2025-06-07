
class CryptoApp {
  constructor() {
    this.apiUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";
    this.socket = io("https://streamer.cryptocompare.com/");
    this.tableBody = document.getElementById("crypto-table-body");
    this.searchInput = document.getElementById("search-input");
    this.sortSelect = document.getElementById("sort-select");
    this.themeToggle = document.getElementById("theme-toggle");
    this.storedTheme = localStorage.getItem("theme");
    this.cryptoData = [];

    this.init();
  }

  async init() {
    try {
      await this.updateTable();
      this.setupEventListeners();
      this.checkStoredTheme();
      this.initGridstack();
      this.startTutorial();
    } catch (error) {
      console.error("Error initializing app:", error);
    }
  }

  async fetchData() {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async updateTable() {
    try {
      const data = await this.fetchData();
      this.cryptoData = data;
      this.renderTable(data);
    } catch (error) {
      console.error("Error updating table:", error);
    }
  }

  renderTable(data) {
    this.tableBody.innerHTML = "";
    data.forEach((crypto) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${crypto.market_cap_rank}</td>
        <td>${crypto.name}</td>
        <td>${crypto.symbol.toUpperCase()}</td>
        <td>$${crypto.current_price.toLocaleString()}</td>
        <td>$${crypto.market_cap.toLocaleString()}</td>
      `;
      this.tableBody.appendChild(row);
    });
  }

  setupEventListeners() {
    this.searchInput.addEventListener("input", () => {
      const searchValue = this.searchInput.value.toLowerCase();
      const filteredData = this.cryptoData.filter((crypto) => {
        return crypto.name.toLowerCase().includes(searchValue) || crypto.symbol.toLowerCase().includes(searchValue);
      });
      this.renderTable(filteredData);
    });

    this.sortSelect.addEventListener("change", () => {
      const sortValue = this.sortSelect.value;
      const sortedData = this.cryptoData.sort((a, b) => {
        if (sortValue === "market_cap_desc") {
          return b.market_cap - a.market_cap;
        } else if (sortValue === "market_cap_asc") {
          return a.market_cap - b.market_cap;
        } else if (sortValue === "price_desc") {
          return b.current_price - a.current_price;
        } else if (sortValue === "price_asc") {
          return a.current_price - b.current_price;
        }
      });
      this.renderTable(sortedData);
    });

    this.socket.on("connect", () => {
      console.log("Connected to WebSocket");
      this.socket.emit("SubAdd", { subs: "5~CCCAGG~BTC~USD" });
    });

    this.socket.on("5~CCCAGG~BTC~USD", (data) => {
      console.log("Received real-time data:", data);
      const priceCell = this.tableBody.querySelector(`tr:nth-child(1) td:nth-child(4)`);
      if (priceCell) {
        priceCell.innerText = `$${data.PRICE.toLocaleString()}`;
      }
    });

    this.themeToggle.addEventListener("click", () => {
      this.toggleTheme();
    });
  }

  toggleTheme() {
    if (this.storedTheme === "dark") {
      document.body.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
      this.storedTheme = "light";
    } else {
      document.body.classList.add("dark-theme");
      localStorage.setItem("theme", "dark");
      this.storedTheme = "dark";
    }
  }

  checkStoredTheme() {
    if (this.storedTheme === "dark") {
      document.body.classList.add("dark-theme");
    }
  }

  initGridstack() {
    try {
      const grid = GridStack.init({
        // options
      });
    } catch (error) {
      console.error("Error initializing gridstack:", error);
    }
  }

  startTutorial() {
    try {
      introJs().start();
    } catch (error) {
      console.error("Error starting tutorial:", error);
    }
  }

  awardBadge(userId, badgeId) {
    try {
      // Award badge logic
    } catch (error) {
      console.error("Error awarding badge:", error);
    }
  }

  importPaperWallet(privateKey) {
    try {
      const wallet = new BitcoinWallet(privateKey);
      return wallet.getAddress();
    } catch (error) {
      console.error("Error importing paper wallet:", error);
    }
  }

  setTransactionFee(feeLevel) {
    try {
      const gasPrice = getGasPrice(feeLevel);
      // Update transaction fee
    } catch (error) {
      console.error("Error setting transaction fee:", error);
    }
  }

  fetchAirdrops() {
    try {
      const response = fetch("https://airdrophunter.com/api/airdrops");
      const airdrops = response.json();
      return airdrops;
    } catch (error) {
      console.error("Error fetching airdrops:", error);
    }
  }

  buyCryptocurrency(coin, amount) {
    try {
      const response = fetch(`https://api.coinbase.com/v2/accounts/${coin}/buys`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          currency: "USD",
          payment_method: "your_payment_method_id",
        }),
      });
      const buyData = response.json();
      return buyData;
    } catch (error) {
      console.error("Error buying cryptocurrency:", error);
    }
  }

  encryptData(data) {
    try {
      const encryptedData = CryptoJS.AES.encrypt(data, "secret key").toString();
      return encryptedData;
    } catch (error) {
      console.error("Error encrypting data:", error);
    }
  }

  generateOTP(secret) {
    try {
      const token = speakeasy.totp({
        secret: secret,
        encoding: "base32",
      });
      return token;
    } catch (error) {
      console.error("Error generating OTP:", error);
    }
  }
}

const app = new CryptoApp();