# Stdlib Showcase: Live Stock Analysis

In this showcase, I demonstrate the capabilities of [stdlib](https://github.com/stdlib-js/stdlib)'s [`@stdlib/stats/incr/mmean`](https://github.com/stdlib-js/stdlib/tree/develop/lib/node_modules/%40stdlib/stats/incr/mmean) and [`@stdlib/plot`](https://github.com/stdlib-js/stdlib/tree/develop/lib/node_modules/%40stdlib/plot) modules.

I take historical finance data from the [yahoo finance JS API](https://github.com/gadicc/node-yahoo-finance2/) (but this could easily be performed with current data), employ a simple moving average strategy, and plot the results.

I use `mmean` to incrementally calculate two moving averages (MAs) of the stock price:
- a slow MA with a window size of 50, and
- a fast MA with a window size of 10.

One can think of the slow MA as the 'equilibrium price'. If the fast MA moves above the slow MA, we expect the stock price to increase and therefore buy the stock.

Now we know when to buy the stock, we can work out a crude profit by taking the difference between the current price and yesterday's price.

Finally, we use `plot` to [compare our moving averages to the stock price](https://github.com/notacountry/stdlib-live-stock-analysis/blob/main/stock-ma-plot.html), and also [view the total profit we make from the MA strategy compared to a simple buy strategy](https://github.com/notacountry/stdlib-live-stock-analysis/blob/main/earnings-plot.html).

In this case, we see that the simple buy strategy performed better. This may be due to window size and that our chosen stock was increasing a lot over our chosen time period. The main advantage of the MA strategy is that we can stop buying if losses get too great, as can be seen near the start of the comparison plot.
