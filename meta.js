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
    this.risk = 0.1;
    this.loss = 0.05;
    this.lot_size = 0.1;
    this.max_lot_size = 0.4;
    this.cooldownTime = null; // Menyimpan waktu cooldown (jeda)
  }

  async getLossCountFromHistory() {
    const historyStorage = this.connection.historyStorage;

    // Ambil 3 transaksi terakhir berdasarkan waktu
    const lastDeals = historyStorage.deals
      .filter((deal) => deal.symbol === symbol)
      .sort((a, b) => b.time - a.time)
      .slice(0, 3);

    // Hitung jumlah transaksi yang mengalami kerugian
    const lossCount = lastDeals.filter((deal) => deal.profit < 0).length;
    return lossCount;
  }

  async orderBuy() {
    if (this.lot_size > this.max_lot_size) this.lot_size = this.max_lot_size;
    if (this.price?.bid && this.price?.ask) {
      const tp = this.price.bid + this.risk;
      const sl = this.price.bid - this.loss;
      await this.connection.createMarketBuyOrder(symbol, this.lot_size, sl, tp, {
        comment: "BUY",
      });
      console.log("BUY ORDER", "tp=", tp, "sl=", sl, "lot=", this.lot_size);
    }
  }

  async orderSell() {
    if (this.lot_size > this.max_lot_size) this.lot_size = this.max_lot_size;
    if (this.price?.bid && this.price?.ask) {
      const tp = this.price.bid - this.risk;
      const sl = this.price.bid + this.loss;
      await this.connection.createMarketSellOrder(symbol, this.lot_size, sl, tp, {
        comment: "SELL",
      });
      console.log("SELL ORDER", "tp=", tp, "sl=", sl, "lot=", this.lot_size);
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
    const currentTime = dayjs();

    // Cek apakah dalam kondisi cooldown (jeda waktu)
    if (this.cooldownTime && currentTime.isBefore(this.cooldownTime)) {
      console.log("Cooldown aktif, menunggu 1 jam...");
      return;
    }

    const historyStorage = this.connection.historyStorage;
    const state = this.connection.terminalState;
    const lastOrder = historyStorage.deals
      .filter((deal) => deal.symbol === symbol)
      .sort((a, b) => a.time - b.time)
      .pop();

    // Hitung jumlah loss berturut-turut
   // const lossCount = await this.getLossCountFromHistory();
  //  console.log("Loss Count (Last 3 Deals):", lossCount);

    // Jika 3 kali berturut-turut loss, aktifkan cooldown
  //  if (lossCount >= 3) {
 //     this.cooldownTime = currentTime.add(1, "hour");
 //     console.log("Tiga kali loss berturut-turut, cooldown 1 jam dimulai...");
//      return;
//    }

    if (state.positions.length === 0) {
      if (historyStorage.historyOrders.length > 0) {
        if (lastOrder.type === "DEAL_TYPE_SELL" && lastOrder.profit < 0) {
          this.lot_size = Math.min(lastOrder.volume * 2, this.max_lot_size);
          await this.orderSell();
        } else if (lastOrder.type === "DEAL_TYPE_SELL" && lastOrder.profit > 0) {
          this.lot_size = 0.01;
          await this.orderBuy();
        } else if (lastOrder.type === "DEAL_TYPE_BUY" && lastOrder.profit < 0) {
          this.lot_size = Math.min(lastOrder.volume * 2, this.max_lot_size);
          await this.orderBuy();
        } else if (lastOrder.type === "DEAL_TYPE_BUY" && lastOrder.profit > 0) {
          this.lot_size = 0.01;
          await this.orderSell();
        }
      } else {
        await this.orderBuy(); // Posisi awal
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
