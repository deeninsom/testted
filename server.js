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
  }
  async onCandlesUpdated(_instanceIndex, candles) {
    for (const candle of candles) {
      console.log(candle.symbol, candle.timeframe);
      if (candle.symbol === symbol && candle.timeframe === timeframe) {
        const timenow = dayjs(candle.time)
          .set("second", 0)
          .set("millisecond", 0)
          .toISOString();
        if (timenow > this.time) {
          console.log("new candle=", timenow, "Close=", candle.close);
          this.time = timenow;
        }
      }
    }
  }
}

async function main() {
  try {
    const account = await api.metatraderAccountApi.getAccount(accountId);
    const connection = account.getStreamingConnection();
    const quoteListener = new QuoteListener();
    connection.addSynchronizationListener(quoteListener);
    await connection.connect();
    await connection.waitSynchronized();
    await connection.subscribeToMarketData(symbol, [
      { type: "candles", timeframe, intervalInMilliseconds: 10000 },
    ]);
  } catch (error) {
    console.log(error);
  }
}
main();
