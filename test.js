// async function quotes() {
//   try {
//     const account = await api.metatraderAccountApi.getAccount(accountId);
//     const candles = (
//       await account.getHistoricalCandles(
//         symbol,
//         "5m",
//         dayjs().toISOString(),
//         20
//       )
//     ).sort((a, b) => b.time - a.time);

//     for (let i = 0; i < candles.length-1; i++) {
//       const c0 = candles[i];
//       const c1 = candles[i+1];

//       if (c0.high < c1.high && c0.low > c1.low) {
//         const l_area = Math.min(c0.low, c1.low);
//         const h_area = Math.max(c0.high, c1.high);
//         break;
//       }
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }
// quotes();
