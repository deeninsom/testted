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
    this.risk = 0.166; // Risk in USD
    this.lot_size = 0.1;
  }

  async orderBuy() {
    if (this.price?.bid && this.price?.ask) {
      const tp = this.price.bid + (this.risk);
      const sl = this.price.bid - this.risk;
      await this.connection.createMarketBuyOrder(symbol, this.lot_size, sl, tp, {
        comment: "BUY",
        // clientId: "TE_GOLD_7hy",
      });
      console.log("BUY ORDER", "tp=", tp, "sl=", sl);
    }
  }

  async orderSell() {
    if (this.price?.bid && this.price?.ask) {
      const tp = this.price.bid - (this.risk );
      const sl = this.price.bid + this.risk;
      await this.connection.createMarketSellOrder(symbol, this.lot_size, sl, tp, {
        comment: "SELL",
        // clientId: "TE_GOLD_7hy",
      });
      console.log("SELL ORDER", "tp=", tp, "sl=", sl);
    }
  }

  async posOpen() {
    const state = this.connection.terminalState;
    return state.positions.length;
  }

  async historyOrder() {
    const historyStorage = this.connection.historyStorage;
    return historyStorage.historyOrders.length;
  }

  async lastOrder() {
    const historyStorage = this.connection.historyStorage;
    const lastDeal = historyStorage.deals
      .filter((f) => f.symbol === symbol)
      .sort((a, b) => a.time - b.time)
      .pop();
    return lastDeal;
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
          await this.strategy();
          this.time = timenow;
        }
      }
    }
  }

  async strategy() {
    const historyStorage = this.connection.historyStorage;
    const state = this.connection.terminalState;
    const lastOrder = historyStorage.deals
      .filter((f) => f.symbol === symbol)
      .sort((a, b) => a.time - b.time)
      .pop();

    if (state.positions.length == 0) {
      if (historyStorage.historyOrders.length > 0) {
        // Last order is BUY and loss
        if (lastOrder.type === "DEAL_TYPE_SELL" && lastOrder.profit < 0) {
          this.lot_size = lastOrder.volume <= 0.4 ? lastOrder.volume * 2 : this.lot_size;
          await this.orderSell();
        }

        // Last order is BUY and profit
        if (lastOrder.type === "DEAL_TYPE_SELL" && lastOrder.profit > 0) {
          this.lot_size = 0.01;
          await this.orderBuy();
        }

        // Last order is SELL and loss
        if (lastOrder.type === "DEAL_TYPE_BUY" && lastOrder.profit < 0) {
          this.lot_size = lastOrder.volume <= 0.4 ? lastOrder.volume * 2 : this.lot_size;
          await this.orderBuy();
        }

        // Last order is SELL and profit
        if (lastOrder.type === "DEAL_TYPE_BUY" && lastOrder.profit > 0) {
          this.lot_size = 0.01;
          await this.orderSell();
        }
      } else {
        this.orderBuy();
      }
    }
  }
}

async function main() {
  try {
    const Meta = new QuoteListener();

    Meta.account = await api.metatraderAccountApi.getAccount(accountId);
    Meta.connection = Meta.account.getStreamingConnection();
    Meta.connection.addSynchronizationListener(Meta);

    await Meta.connection.connect();
    await Meta.connection.waitSynchronized();

    await Meta.connection.subscribeToMarketData(symbol, [
      { type: "candles", timeframe, intervalInMilliseconds: 10000 },
      { type: "quotes", intervalInMilliseconds: 5000 },
      { type: "ticks" },
    ]);
  } catch (error) {
    console.log(error);
  }
}

main();
