const SynchronizationListener =
  require("metaapi.cloud-sdk").SynchronizationListener;
const MetaApi = require("metaapi.cloud-sdk").default;
const dayjs = require("dayjs");

const token = process.env.TOKEN;
const accountId = process.env.ACCOUNT_ID;
const symbol = process.env.SYMBOL;
const domain = process.env.DOMAIN;
const timeframe = "1m";

const api = new MetaApi(token, { domain });

class QuoteListener extends SynchronizationListener {
  constructor() {
    super();
    this.time = dayjs()
      .add(1, "minute")
      .set("second", 0)
      .set("millisecond", 0)
      .toISOString();
    this.risk = 10; // Risk in USD
    this.lot_size = 0.01;
  }

  async onSymbolPriceUpdated(_i, price) {
    if (price.symbol == symbol) {
      this.price = price;
    }
  }

  async onCandlesUpdated(_instanceIndex, candles) {
    for (const candle of candles) {
      console.log(candle.symbol, candle.timeframe, candle.time);
      if (candle.symbol === symbol && candle.timeframe === timeframe) {
        const timenow = dayjs(candle.time)
          .set("second", 0)
          .set("millisecond", 0)
          .toISOString();

        if (timenow > this.time) {
          await this.orderBuy();
          this.time = timenow;
        }
      }
    }
  }

  async orderBuy() {
    if (this.price?.bid && this.price?.ask) {
      const tp = this.price.bid + this.risk;
      const sl = this.price.bid - this.risk;

      console.log("Order BUY", "tp=", tp, "sl=", sl);

      // await this.connection.createMarketBuyOrder(symbol, 0.01, sl, tp, {
      //   comment: "BUY",
      //   clientId: "TE_GOLD_7hyINWqAl",
      // });

      const terminal = this.connection.terminalState;

      const orders = terminal.positions.map(f => {
        console.log(f)
      })
    }
  }

  async orderSell() {
    console.log("Order SELL");
  }

  async orderBuyLimit() {}

  async orderSellLimit() {}
}

async function main() {
  try {
    const meta = new QuoteListener();
    meta.account = await api.metatraderAccountApi.getAccount(accountId);
    meta.connection = meta.account.getStreamingConnection();
    meta.connection.addSynchronizationListener(meta);
    await meta.connection.connect();
    await meta.connection.waitSynchronized();
    await meta.connection.subscribeToMarketData(symbol, [
      { type: "candles", timeframe, intervalInMilliseconds: 10000 },
      { type: "quotes", intervalInMilliseconds: 5000 },
      { type: "ticks" },
    ]);
  } catch (error) {
    console.log(error);
  }
}
main();
