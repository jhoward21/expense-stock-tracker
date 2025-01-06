"use client";
import { error } from "console";
import React, { useEffect, useState } from "react";

function StockTracker() {
  const [stocks, setStocks] = useState<any>({AAPL: null, NVDA: null, TSLA: null, AMZN: null, APP: null, PLTR: null}); // Setting the inital state of our values.
  const [lastUpdated, setLastUpdated] = useState<any>({AAPL: null, NVDA: null, TSLA: null, AMZN: null, APP: null, PLTR: null}); // Seting the state for current updates

  useEffect(() => {
    // Using useEffect to connect to the API
    // Fetch Apple Stock Data
    fetch(
      "https://api.twelvedata.com/time_series?apikey=36c6d04c0f9e484183f9bf0f1376d474&interval=1min&symbol=AAPL"
    )
      .then((res) => res.json()) // Converting the response to JSON
      .then((stocks) => {
        console.log("Apple Data:", stocks); // Returning the stocks data to the console.
        setStocks((prev: any) => ({...prev, AAPL: stocks})); // Updating the state of the stocks value.
        setLastUpdated((prev: any) => ({...prev, AAPL: stocks?.meta?.timepstamp}));
      })
      .catch((error) => console.error("Unable to grab Apple stock data", error)); // Giving an error to the console if unable to grab API data.

      // Fetch Nvidia Stock Data
      fetch(
        "https://api.twelvedata.com/time_series?apikey=36c6d04c0f9e484183f9bf0f1376d474&interval=1min&symbol=NVDA"
      )
        .then((res) => res.json())
        .then((stocks) => {
          console.log("Nvidia Data:", stocks);
          setStocks((prev: any) => ({...prev, NVDA: stocks}));
          setLastUpdated((prev: any) => ({...prev, NVDA: stocks?.meta?.timepstamp}));
        })
        .catch((error) => console.error("Can't grab Nvidia data.", error));

        // Fetch Tesla Stock Data
        fetch(
          "https://api.twelvedata.com/time_series?apikey=36c6d04c0f9e484183f9bf0f1376d474&interval=1min&symbol=TSLA"
        )
          .then((res) => res.json())
          .then((stocks) => {
            console.log("Tesla Data:", stocks);
            setStocks((prev: any) => ({...prev, TSLA: stocks}));
            setLastUpdated((prev: any) => ({...prev, TSLA: stocks?.meta?.timepstamp}));
          })
          .catch((error) => console.error("Can't grab Tesla data", error));

          // Fetch Amazon Stock Data
          fetch("https://api.twelvedata.com/time_series?apikey=36c6d04c0f9e484183f9bf0f1376d474&interval=1min&symbol=AMZN")
          .then((res) => res.json()) // Converting the response to JSON.
          .then((stocks) => {
            console.log("Amazon Data:", stocks); // Printing out the data to console to ensure where grabbing it successfully.
            setStocks((prev: any) => ({...prev, AMZN: stocks})); // Updating the state of the stocks data.
            setLastUpdated((prev: any) => ({...prev, AMZN: stocks?.meta?.timepstamp}));
          })
          .catch((error) => console.error("Can't grab Amazon data", error)) // Basic error handling if API fails.

          // Fetch AppLovin Stock Data
          fetch("https://api.twelvedata.com/time_series?apikey=36c6d04c0f9e484183f9bf0f1376d474&interval=1min&symbol=APP")
          .then((res) => res.json())
          .then((stocks) => {
            console.log("AppLovin Data: ", stocks)
            setStocks((prev: any) => ({...prev, APP: stocks}))
            setLastUpdated((prev: any) => ({...prev, APP: stocks?.meta?.timepstamp}))
          })
          .catch((error) => console.error("Unable to grab AppLovin data", error))

          // Fetch Palantir Stock Data
          fetch("https://api.twelvedata.com/time_series?apikey=36c6d04c0f9e484183f9bf0f1376d474&interval=1min&symbol=PLTR")
          .then((res) => res.json()) // Converting the response to JSON.
          .then((stocks) => {
            console.log("Palantir Data:", stocks) // Printing the API data to the console to ensure we're grabbing the data.
            setStocks((prev: any) => ({...prev, PLTR: stocks})) // Updating the state of the stocks data.
            setLastUpdated((prev: any) => ({...prev, PLTR: stocks?.meta?.timepstamp}))
          })
          .catch((error) => console.error("Can't grab Palantir Data", error))

          // Fetch Google Stock Data
          fetch("https://api.twelvedata.com/time_series?apikey=36c6d04c0f9e484183f9bf0f1376d474&interval=1min&symbol=GOOGL")
          .then((res) => res.json())
          .then((stocks) =>{
            console.log("Google Data:", stocks)
            setStocks((prev: any) => ({...prev, GOOGL: stocks?.meta?.timepstamp}))
          })
          .catch((error) => console.error("Can't grab Google data", error))
  }, []); // Empty Array so it only runs once.

  function refreshStock (symbol: string) {
    fetch(`https://api.twelvedata.com/time_series?apikey=36c6d04c0f9e484183f9bf0f1376d474&interval=1min&symbol=${symbol}`)
    .then((res) => res.json())
    .then((stocks) => {
      console.log(`${symbol} Data Updated:`, stocks)
      if (stocks?.meta?.timepstamp === lastUpdated[symbol]) { // Checking to see if the market is closed before grabbing new updates from the stock API.
        alert(`No new updates for ${symbol}. The market might be closed.`); // Letting the user know that the market is closed.
      } else { // If the market isn't closed update the state of the values and grab new market info.
        setStocks((prev: any) => ({...prev, [symbol]: stocks}))
        setLastUpdated((prev: any) => ({...prev, [symbol]: stocks?.meta?.timepstamp}));
      }
    })
    .catch((error) => console.error(`Unable to refresh ${symbol} data`, error))
  }

  return (
    // Rendering the UI components here
    <>
      {stocks.AAPL && stocks.NVDA && stocks.TSLA ? ( // Ensures stocks data is loaded before rendering components
        <div className="stocks-container">
          <div className="stock-card">
            {/*  Apple Card */}
            <h2>Symbol: {stocks.AAPL?.meta?.symbol}</h2>
            {stocks.AAPL?.values?.map((stocks: any, index: number) => (
              <ul key={index}> {/* Wrap each item in a parent container */}
                <li>Date and Time: {stocks.datetime}</li>
                <li>Open: {stocks.open}</li>
                <li>High: {stocks.high}</li>
                <li>Low: {stocks.low}</li>
                <li>Close: {stocks.close}</li>
              </ul>
            ))}
          </div>
          <button className="btn btn-primary" onClick={() => refreshStock("AAPL")}>
            Press to Refresh
          </button>
          <div className="stock-card">
            {/*  Nvidia Card */}
            <h2>Symbol: {stocks.NVDA?.meta?.symbol}</h2>
            {stocks.NVDA?.values?.map((stocks: any, index: number) => (
              <ul key={index}>
                  <li>Date and Time: {stocks.datetime}</li>
                  <li>Open: {stocks.open}</li>
                  <li>High: {stocks.high}</li>
                  <li>Low: {stocks.low}</li>
                  <li>Close: {stocks.close}</li>
                </ul>
            ))}
          </div>
          <button className="btn btn-primary" onClick={() => refreshStock("NVDA")}>
            Press to Refresh
          </button>
          <div className="stock-card">
            {/*  Tesla Card */}
            <h2>Symbol: {stocks.TSLA?.meta?.symbol}</h2>
            {stocks.TSLA?.values?.map((stocks: any, index: number) => (
              <ul key={index}> {/* Using key={index} to render elements using the .map function */}
                <li>Date and Time: {stocks.datetime}</li>
                <li>Open: {stocks.open}</li>
                <li>High: {stocks.high}</li>
                <li>Low: {stocks.low}</li>
                <li>Close: {stocks.close}</li>
              </ul>
            ))}
          </div>
          <button className="btn btn-primary" onClick={() => refreshStock("TSLA")}>
            Press to Refresh
          </button>
          <div className="stock-card">
            {/*  Amazon Card */}
            <h2>Symbol: {stocks.AMZN?.meta?.symbol}</h2>
            {stocks.AMZN?.values?.map((stocks: any, index: number) => (
              <ul key={index}>
                <li>Date and Time: {stocks.datetime}</li>
                <li>Open: {stocks.open}</li>
                <li>High: {stocks.high}</li>
                <li>Low: {stocks.low}</li>
                <li>Close: {stocks.close}</li>
              </ul>
            ))}
          </div>
          <button className="btn btn-primary" onClick={() => refreshStock("AMZN")}>
            Press to Refresh
          </button>
          <div className="stock-card">
            {/*  AppLovin Card */}
            <h2>Symbol: {stocks.APP?.meta?.symbol}</h2>
            {stocks.APP?.values?.map((stocks: any, index: number) => (
              <ul key={index}>
                <li>Date and Time: {stocks.datetime}</li>
                <li>Open: {stocks.open}</li>
                <li>High: {stocks.high}</li>
                <li>Low: {stocks.low}</li>
                <li>Close: {stocks.close}</li>
              </ul>
            ))}
          </div>
          <button className="btn btn-primary" onClick={() => refreshStock("APP")}>
            Press to Refresh
          </button>
          <div className="stock-card">
            {/*  Google Card */}
            <h2>Symbol: {stocks.GOOGL?.meta?.symbol}</h2>
            {stocks.GOOGL?.values?.map((stocks: any, index: number) => (
              <ul key={index}>
                <li>Date and Time: {stocks.datetime}</li>
                <li>Open: {stocks.open}</li>
                <li>High: {stocks.high}</li>
                <li>Low: {stocks.low}</li>
                <li>Close: {stocks.close}</li>
              </ul>
            ))}
          </div>
          <button className="btn btn-primary" onClick={() => refreshStock("GOOGL")}>
            Press to Refresh
          </button>
          <div className="stock-card">
            {/*  Palantir Card */}
            <h2>Symbol: {stocks.PLTR?.meta?.symbol}</h2>
            {stocks.PLTR?.values?.map((stocks: any, index: number) => (
              <ul key={index}>
                <li>Date and Time: {stocks.datetime}</li>
                <li>Open: {stocks.open}</li>
                <li>High: {stocks.high}</li>
                <li>Low: {stocks.low}</li>
                <li>Close: {stocks.close}</li>
              </ul>
            ))}
          </div>
          <button className="btn btn-primary" onClick={() => refreshStock("PLTR")}>
            Press to Refresh
          </button>
        </div>
      ) : (
        <p>Loading stock data...</p> // Displays a message while the API data is being fetched. This improves user experince.
      )}
    </>
  );
}

export default StockTracker;
