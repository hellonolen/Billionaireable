#!/usr/bin/env python3
import yfinance as yf
import json
import sys
from datetime import datetime

def fetch_quotes(symbols):
    """Fetch quotes for multiple symbols using yfinance"""
    quotes = []
    
    for symbol in symbols:
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            
            # Get current price
            price = info.get('currentPrice') or info.get('regularMarketPrice') or info.get('previousClose', 0)
            
            # Get change
            change = info.get('regularMarketChange', 0)
            change_pct = info.get('regularMarketChangePercent', 0)
            
            # Determine asset class
            quote_type = info.get('quoteType', '').lower()
            asset_class = 'stock'
            if 'index' in quote_type:
                asset_class = 'index'
            elif 'future' in quote_type or 'commodity' in quote_type:
                asset_class = 'futures'
            elif 'currency' in quote_type or 'forex' in quote_type:
                asset_class = 'forex'
            elif 'crypto' in quote_type:
                asset_class = 'crypto'
            
            quotes.append({
                'symbol': symbol,
                'name': info.get('shortName', symbol),
                'assetClass': asset_class,
                'price': float(price) if price else 0,
                'change': float(change) if change else 0,
                'changePct': float(change_pct) if change_pct else 0,
                'time': int(datetime.now().timestamp() * 1000)
            })
        except Exception as e:
            # Skip symbols that fail
            continue
    
    return quotes

if __name__ == '__main__':
    # Read symbols from command line args
    symbols = sys.argv[1:] if len(sys.argv) > 1 else []
    
    if not symbols:
        print(json.dumps({'quotes': []}))
        sys.exit(0)
    
    quotes = fetch_quotes(symbols)
    print(json.dumps({'quotes': quotes}))
