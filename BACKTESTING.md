# Historical Backtesting Engine

Alpha Quant FX includes a deterministic historical backtesting engine designed with strict adherence to the following quantitative principles:

## 1. Zero Look-Ahead Bias
- Indicators and market structure (BOS/CHoCH) are computed using only candle bars available at the exact simulated timestamp.
- No future price data influences the entry or stop-loss placement.

## 2. Realistic Execution Model
- **Spread Model**: Enforces realistic bid/ask spread costs on every trade entry and exit.
- **Dynamic ATR Stop-Loss & Take-Profits**: Calculates tiered targets (TP1 at 1.2R, TP2 at 2.0R, TP3 at 3.2R).
- **Trailing Stop / Breakeven**: Once TP1 is achieved, the stop loss is automatically trailed to the entry price.

## 3. Metrics Calculated
- Total Trades
- Winning & Losing Trades
- Win Rate %
- Profit Factor (Gross Win / Gross Loss)
- Maximum Drawdown (in Pips and %)
- Net Profit ($ and %)
- Average Trade Pips
- Largest Win and Largest Loss
