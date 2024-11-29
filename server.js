const SynchronizationListener = require("metaapi.cloud-sdk").SynchronizationListener;
const MetaApi = require("metaapi.cloud-sdk").default;
const dayjs = require("dayjs");

const token = process.env.TOKEN;
const accountId = process.env.ACCOUNT_ID;
const symbol = process.env.SYMBOL;
const domain = process.env.DOMAIN;

const api = new MetaApi(token, { domain });

let prevTime = dayjs().add(1, "minute").format("mm");

class QuoteListener extends SynchronizationListener {
  async onCandlesUpdated(_instanceIndex, candles) {
    for (const candle of candles) {
      if (candle.symbol === symbol) {
        const newBar = dayjs(candle.time).format("mm") > prevTime;
        if (newBar) {
          console.log("new bar", candle)
          prevTime = dayjs().format("mm");
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
    await connection.subscribeToMarketData(symbol, [{ type: "candles", timeframe: "1m", intervalInMilliseconds: 60000 }]);
  }catch(error) {
    console.log(error);
  }
}
main();