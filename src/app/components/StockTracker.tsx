"use client";
import { error } from "console";
import React, { useEffect, useState, useRef } from "react";

function StockTracker() {
  const [stocks, setStocks] = useState<any>({
    AAPL: null,
    NVDA: null,
    TSLA: null,
    AMZN: null,
    APP: null,
    PLTR: null,
    GOOGL: null,
    VOO: null,
    SPY: null,
    WMT: null,
  }); // Setting the initial state of our values.
  const [lastUpdated, setLastUpdated] = useState<any>({
    AAPL: null,
    NVDA: null,
    TSLA: null,
    AMZN: null,
    APP: null,
    PLTR: null,
    GOOGL: null,
    VOO: null,
    SPY: null,
    WMT: null,
  }); // Setting the state for current updates

  useEffect(() => {
    // Using useEffect to connect to external source or an external API
    const stockSymbols = [
      "AAPL",
      "NVDA",
      "TSLA",
      "AMZN",
      "APP",
      "PLTR",
      "GOOGL",
      "VOO",
      "SPY",
      "WMT",
    ]; // Array of Stocks to grab data from

    stockSymbols.forEach((symbol) => {
      fetch(
        `https://api.twelvedata.com/time_series?apikey=36c6d04c0f9e484183f9bf0f1376d474&interval=1min&symbol=${symbol}`
      )
        .then((res) => res.json()) // Converting the response to JSON
        .then((stocks) => {
          console.log(`${symbol} Data:`, stocks); // Returning the stocks data to the console.
          setStocks((prev: any) => ({ ...prev, [symbol]: stocks })); // Updating the state of the stocks value.
          setLastUpdated((prev: any) => ({
            ...prev,
            [symbol]: stocks?.meta?.timestamp,
          }));
        })
        .catch((error) =>
          console.error(`Unable to grab ${symbol} stock data`, error)
        ); // Error handling if unable to grab API data.
    });
  }, []);

  useEffect(() => {
    Object.keys(stocks).forEach((symbol) => {
      if (stocks[symbol]) {
        const script = document.createElement("script");
        script.src =
          "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
        script.async = true;
        script.innerHTML = `{
          "symbol": "${symbol}",
          "width": "100%",
          "height": "200",
          "locale": "en",
          "dateRange": "1D",
          "colorTheme": "dark",
          "isTransparent": false,
          "autosize": true,
          "largeChartUrl": ""
        }`;
        const container = document.getElementById(`tradingview_${symbol}`);
        if (container) {
          container.innerHTML = ""; // Clear existing widgets
          container.appendChild(script);
        }
      }
    });
  }, [stocks]);

  function refreshStock(symbol: string) {
    fetch(
      `https://api.twelvedata.com/time_series?apikey=36c6d04c0f9e484183f9bf0f1376d474&interval=1min&symbol=${symbol}`
    )
      .then((res) => res.json())
      .then((stocks) => {
        console.log(`${symbol} Data Updated:`, stocks);
        if (stocks?.meta?.timestamp === lastUpdated[symbol]) {
          alert(`No new updates for ${symbol}. The market might be closed.`);
        } else {
          setStocks((prev: any) => ({ ...prev, [symbol]: stocks }));
          setLastUpdated((prev: any) => ({
            ...prev,
            [symbol]: stocks?.meta?.timestamp,
          }));
        }
      })
      .catch((error) =>
        console.error(`Unable to refresh ${symbol} data`, error)
      );
  }

  return (
    <>
      <div className="stocks-container">
        {Object.keys(stocks).map(
          (symbol) =>
            stocks[symbol] && (
              <div>
                <div key={symbol} className="stock-card">
                  <div className="tradingview-widget-container">
                    <div id={`tradingview_${symbol}`}></div>
                  </div>
                  <h2>{stocks[symbol]?.meta?.symbol}</h2>
                  {stocks[symbol]?.values?.map((entry: any, index: number) => (
                    <ul key={index}>
                      <li>Date and Time: {entry.datetime}</li>
                      <li>Open: {entry.open}</li>
                      <li>High: {entry.high}</li>
                      <li>Low: {entry.low}</li>
                      <li>Close: {entry.close}</li>
                    </ul>
                  ))}
                </div>
                <button
                  className="btn btn-primary button"
                  onClick={() => refreshStock(symbol)}
                >
                  Refresh {symbol} Data
                </button>
              </div>
            )
        )}
      </div>
    </>
  );
}

export default StockTracker;
