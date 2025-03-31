import yfinance from 'yahoo-finance2';
import incrmmean from '@stdlib/stats/incr/mmean/lib/index.js';
import plot from '@stdlib/plot';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

async function fetchHistory( ticker, start, end ) {
    try {
        const history = await yfinance.chart( ticker, { period1: start, period2: end } );
        return history.quotes
    }
    catch( e ) {
        console.error( `Error fetching yfinance data for ${ticker}`, e );
    }
}

function getSlowFastAvg( quotes ) {
    var slow = incrmmean( 50 );
    var fast = incrmmean( 10 );
    const slows = [];
    const fasts = [];
    const prices = [];
    const dates = [];

    quotes.forEach(quote => {
        const currslow = slow( quote.close );
        const currfast = fast( quote.close );

        prices.push( quote.close )
        slows.push( currslow );
        fasts.push( currfast );
        dates.push(new Date(quote.date).getTime());
    });

    return { dates, prices, slows, fasts };
}

async function main() {
    const dir = path.dirname( fileURLToPath( import.meta.url ) )

    const { dates, prices, slows, fasts } = getSlowFastAvg(
        await fetchHistory( 'AAPL', '2020-01-01T00:00:00.000Z', '2021-01-01T00:00:00.000Z' )
    );

    const plt = plot(
        [dates, dates, dates],
        [prices, slows, fasts],
        {
            'width': 800,
            'height': 600,
            'xScale': 'time',
            'xTickFormat': '%Y-%m-%d',
            'yLabel': 'Price',
            'title': 'AAPL Stock Price with Slow and Fast Moving Averages',
            'lines': [
                { 'label': 'Price', 'color': 'blue' },
                { 'label': 'Slow AVG (50)', 'color': 'red' },
                { 'label': 'Fast AVG (10)', 'color': 'green' }
            ],
            'legend': true,
            'renderFormat': 'html'
        }
    );

    var maprofit = 0;
    var simplebuyprofit = 0;
    const maarr = [maprofit]
    const simplebuyarr = [simplebuyprofit]
    for (let i = 1; i < prices.length; ++i) {
        const diff = prices[i] - prices[i - 1];

        simplebuyprofit += diff
        maprofit += slows[i] < fasts[i] ? diff : 0;
        simplebuyarr.push( simplebuyprofit );
        maarr.push( maprofit );
    }

    const plt2 = plot(
        [dates, dates],
        [maarr, simplebuyarr],
        {
            'width': 800,
            'height': 600,
            'xScale': 'time',
            'xTickFormat': '%Y-%m-%d',
            'yLabel': 'Earnings',
            'title': 'Moving Average Strategy Earnings',
            'lines': [
                { 'label': 'MA', 'color': 'blue' },
                { 'label': 'Simple Buy', 'color': 'red' },
            ],
            'legend': true,
            'renderFormat': 'html'
        }
    );

    fs.writeFileSync( path.join( dir, 'stock-ma-plot.html' ), plt.render() );
    fs.writeFileSync( path.join( dir, 'earnings-plot.html' ), plt2.render() );
}

main();
