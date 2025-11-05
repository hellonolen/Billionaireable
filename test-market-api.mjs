import { callDataApi } from "./server/_core/dataApi.js";

async function testMarketData() {
  try {
    console.log("Testing Yahoo Finance API...");
    const result = await callDataApi("YahooFinance/get_stock_chart", {
      query: {
        symbol: "AAPL",
        region: "US",
        interval: "1d",
        range: "1d",
        includeAdjustedClose: true,
      },
    });
    
    console.log("Result:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

testMarketData();
