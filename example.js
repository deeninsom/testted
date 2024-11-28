let MetaApi = require('metaapi.cloud-sdk').default;

let token = process.env.TOKEN || 'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI4M2MwNzgzOTdkMDZkMmRkNTMwZjM0ZjA2MDk0MzUyZiIsInBlcm1pc3Npb25zIjpbXSwiYWNjZXNzUnVsZXMiOlt7ImlkIjoidHJhZGluZy1hY2NvdW50LW1hbmFnZW1lbnQtYXBpIiwibWV0aG9kcyI6WyJ0cmFkaW5nLWFjY291bnQtbWFuYWdlbWVudC1hcGk6cmVzdDpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciIsIndyaXRlciJdLCJyZXNvdXJjZXMiOlsiYWNjb3VudDokVVNFUl9JRCQ6YjJjMGFiZTctZWY3YS00YjRiLWFkNWItZTg5NDBmMzExOTBiIl19LHsiaWQiOiJtZXRhYXBpLXJlc3QtYXBpIiwibWV0aG9kcyI6WyJtZXRhYXBpLWFwaTpyZXN0OnB1YmxpYzoqOioiXSwicm9sZXMiOlsicmVhZGVyIiwid3JpdGVyIl0sInJlc291cmNlcyI6WyJhY2NvdW50OiRVU0VSX0lEJDpiMmMwYWJlNy1lZjdhLTRiNGItYWQ1Yi1lODk0MGYzMTE5MGIiXX0seyJpZCI6Im1ldGFhcGktcnBjLWFwaSIsIm1ldGhvZHMiOlsibWV0YWFwaS1hcGk6d3M6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbImFjY291bnQ6JFVTRVJfSUQkOmIyYzBhYmU3LWVmN2EtNGI0Yi1hZDViLWU4OTQwZjMxMTkwYiJdfSx7ImlkIjoibWV0YWFwaS1yZWFsLXRpbWUtc3RyZWFtaW5nLWFwaSIsIm1ldGhvZHMiOlsibWV0YWFwaS1hcGk6d3M6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbImFjY291bnQ6JFVTRVJfSUQkOmIyYzBhYmU3LWVmN2EtNGI0Yi1hZDViLWU4OTQwZjMxMTkwYiJdfSx7ImlkIjoibWV0YXN0YXRzLWFwaSIsIm1ldGhvZHMiOlsibWV0YXN0YXRzLWFwaTpyZXN0OnB1YmxpYzoqOioiXSwicm9sZXMiOlsicmVhZGVyIl0sInJlc291cmNlcyI6WyJhY2NvdW50OiRVU0VSX0lEJDpiMmMwYWJlNy1lZjdhLTRiNGItYWQ1Yi1lODk0MGYzMTE5MGIiXX0seyJpZCI6InJpc2stbWFuYWdlbWVudC1hcGkiLCJtZXRob2RzIjpbInJpc2stbWFuYWdlbWVudC1hcGk6cmVzdDpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciIsIndyaXRlciJdLCJyZXNvdXJjZXMiOlsiYWNjb3VudDokVVNFUl9JRCQ6YjJjMGFiZTctZWY3YS00YjRiLWFkNWItZTg5NDBmMzExOTBiIl19LHsiaWQiOiJtZXRhYXBpLXJlYWwtdGltZS1zdHJlYW1pbmctYXBpIiwibWV0aG9kcyI6WyJtZXRhYXBpLWFwaTp3czpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciIsIndyaXRlciJdLCJyZXNvdXJjZXMiOlsiYWNjb3VudDokVVNFUl9JRCQ6YjJjMGFiZTctZWY3YS00YjRiLWFkNWItZTg5NDBmMzExOTBiIl19LHsiaWQiOiJjb3B5ZmFjdG9yeS1hcGkiLCJtZXRob2RzIjpbImNvcHlmYWN0b3J5LWFwaTpyZXN0OnB1YmxpYzoqOioiXSwicm9sZXMiOlsicmVhZGVyIiwid3JpdGVyIl0sInJlc291cmNlcyI6WyJhY2NvdW50OiRVU0VSX0lEJDpiMmMwYWJlNy1lZjdhLTRiNGItYWQ1Yi1lODk0MGYzMTE5MGIiXX1dLCJ0b2tlbklkIjoiMjAyMTAyMTMiLCJpbXBlcnNvbmF0ZWQiOmZhbHNlLCJyZWFsVXNlcklkIjoiODNjMDc4Mzk3ZDA2ZDJkZDUzMGYzNGYwNjA5NDM1MmYiLCJpYXQiOjE3MzI3ODk1NzQsImV4cCI6MTczNTM4MTU3NH0.oS5WUVZ6NWUGeQQguA6NyCQgNfmurGaS6ZMx-5doFXzSMrHeaMTNCS6btUN1hCdDPOWyZeRC-oncCIGBMRGH6cSL9DUEUiVrO3KKeZGpdAY0MdPm-ZBoWwMZdCWsZ8EYcg0WUQxw5iK-CPs2qmm2P65zV4m1Rk-z7bcFkw_GsdSYIWdkcHQn6HVEuOGSlldowTyTOvjoc5Lh_LPTu8jNpm-KkpAey-S_5gw9-ySIMFyCa6zfOkgq1AEW4GykYX7T6txcIcVI-wEP8THIq9uIR2RHkdyyQhPNyejg9sNQkOj18vN9iDzdbD-Jsd7b78n7pz81oLi4ST1kbFVNAKGMSCeqwMCtLPGaVceFnHTBedZeygaYwgBvhVhFFUkwXZtR-PpKtFvOdBUUVLuIsq_YjBccbluMOwmO2OvGvcPzEuxZIWE4bYiPwHAv7kbRAF9UWg3zgYlLRGHVphgoXitYTieQNPsNMQSmS3hGgMHOPxL5tSa3GWoTeBynD2D9aEvR83tRIMF7fm5oF14CJYxUxdBfSU3XOpeVpBqBiJ8WCOYHDWEWtk88nfACY0ZP12ff5BQ0dfVEZQzG9fBQZ4jPQ_hUJwGjSTKOp6z-5k5kqQckpRLMuhqDDnnxEsVXdISu3_moTXNhY1AmV6bTnXpF1G7L3X3F5GZMTNcAXWW3Hag';
let accountId = process.env.ACCOUNT_ID || 'b2c0abe7-ef7a-4b4b-ad5b-e8940f31190b';
const api = new MetaApi(token);

async function testMetaApiSynchronization() {
  try {
    const account = await api.metatraderAccountApi.getAccount(accountId);
    const initialState = account.state;
    const deployedStates = ['DEPLOYING', 'DEPLOYED'];

    if(!deployedStates.includes(initialState)) {
      // wait until account is deployed and connected to broker
      console.log('Deploying account');
      await account.deploy();
    }
    console.log('Waiting for API server to connect to broker (may take couple of minutes)');
    await account.waitConnected();

    // connect to MetaApi API
    let connection = account.getStreamingConnection();
    await connection.connect();

    // wait until terminal state synchronized to the local state
    console.log('Waiting for SDK to synchronize to terminal state (may take some time depending on your history size)');
    await connection.waitSynchronized();

    // access local copy of terminal state
    console.log('Testing terminal state access');
    let terminalState = connection.terminalState;
    console.log('connected:', terminalState.connected);
    console.log('connected to broker:', terminalState.connectedToBroker);
    console.log('account information:', terminalState.accountInformation);
    console.log('positions:', terminalState.positions);
    console.log('orders:', terminalState.orders);
    console.log('specifications:', terminalState.specifications);
    console.log('EURUSD specification:', terminalState.specification('EURUSD'));
    await connection.subscribeToMarketData('EURUSD');
    console.log('EURUSD price:', terminalState.price('EURUSD'));

    // access history storage
    const historyStorage = connection.historyStorage;
    console.log('deals:', historyStorage.deals.slice(-5));
    console.log('deals with id=1:', historyStorage.getDealsByTicket(1));
    console.log('deals with positionId=1:', historyStorage.getDealsByPosition(1));
    console.log('deals for the last day:', historyStorage.getDealsByTimeRange(new Date(Date.now() - 24 * 60 * 60 * 1000),
      new Date()));
    console.log('history orders:', historyStorage.historyOrders.slice(-5));
    console.log('history orders with id=1:', historyStorage.getHistoryOrdersByTicket(1));
    console.log('history orders with positionId=1:', historyStorage.getHistoryOrdersByPosition(1));
    console.log('history orders for the last day:', historyStorage.getHistoryOrdersByTimeRange(
      new Date(Date.now() - 24 * 60 * 60 * 1000), new Date()));

    // calculate margin required for trade
    console.log('margin required for trade', await connection.calculateMargin({
      symbol: 'GBPUSD',
      type: 'ORDER_TYPE_BUY',
      volume: 0.1,
      openPrice: 1.1
    }));

    // trade
    console.log('Submitting pending order');
    try {
      let result = await
      connection.createLimitBuyOrder('GBPUSD', 0.07, 1.0, 0.9, 2.0, {
        comment: 'comm',
        clientId: 'TE_GBPUSD_7hyINWqAlE'
      });
      console.log('Trade successful, result code is ' + result.stringCode);
    } catch (err) {
      console.log('Trade failed with result code ' + err.stringCode);
    }

    if(!deployedStates.includes(initialState)) {
      // undeploy account if it was undeployed
      console.log('Undeploying account');
      await connection.close();
      await account.undeploy();
    }

  } catch (err) {
    console.error(err);
  }
  process.exit();
}

testMetaApiSynchronization();
