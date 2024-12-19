const dayjs = require("dayjs");

const MetaApi = require("metaapi.cloud-sdk").default;
const SynchronizationListener =
  require("metaapi.cloud-sdk").SynchronizationListener;

let token = process.env.TOKEN;
let accountId = process.env.ACCOUNT_ID;
let symbol = process.env.SYMBOL;
let domain = process.env.DOMAIN;

const api = new MetaApi(token, { domain });

class QuoteListener extends SynchronizationListener {
  async onCandlesUpdated(_instanceIndex, candles) {
    for (const candle of candles) {
      console.log(candle.symbol);
      if (candle.symbol === symbol) {
        console.log(candle);
      }
    }
  }
}

async function streamQuotes() {
  try {
    const account = await api.metatraderAccountApi.getAccount(accountId);
    const candles = await account.getHistoricalCandles(symbol, "5m", dayjs().toISOString(), 10);
    
    // const connection = account.getStreamingConnection();

    // const quoteListener = new QuoteListener();
    // connection.addSynchronizationListener(quoteListener);
    // await connection.connect();
    // await connection.waitSynchronized();

    // await connection.subscribeToMarketData(symbol, [
    //   { type: "candles", timeframe: "5m", intervalInMilliseconds: 10000 },
    // ]);

  } catch (error) {
    console.log(error);
  }
}

streamQuotes();
