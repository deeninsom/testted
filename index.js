const MetaApi = require('metaapi.cloud-sdk').default;
const SynchronizationListener = require('metaapi.cloud-sdk').SynchronizationListener;

let token = process.env.TOKEN;
let accountId = process.env.ACCOUNT_ID;
let symbol = 'EURUSD';
let domain = 'agiliumtrade.agiliumtrade.ai';

const api = new MetaApi(token, {domain});

class QuoteListener extends SynchronizationListener {
  // async onTicksUpdated(_instanceIndex, ticks) {
  //   for (const tick of ticks) {
  //     if (tick.symbol === symbol) {
  //       console.log(tick)
  //     }
  //   }
  // }

  async onCandlesUpdated(instanceIndex, candles) {
    if (candles[0].close > candles[1].close) console.log("BEARISH");
    console.log("BULISH");
  }
}

async function streamQuotes() {
  try {
    const account = await api.metatraderAccountApi.getAccount(accountId);
    const connection = account.getStreamingConnection();

    const quoteListener = new QuoteListener();
    connection.addSynchronizationListener(quoteListener);
    await connection.connect();
    await connection.waitSynchronized();

  } catch(error) {
    console.log(error);
  }
}

streamQuotes();