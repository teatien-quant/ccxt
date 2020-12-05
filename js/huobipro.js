'use strict';

//  ---------------------------------------------------------------------------

const Exchange = require ('./base/Exchange');
const { AuthenticationError, ExchangeError, PermissionDenied, ExchangeNotAvailable, OnMaintenance, InvalidOrder, OrderNotFound, InsufficientFunds, ArgumentsRequired, BadSymbol, BadRequest, RequestTimeout } = require ('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class huobipro extends Exchange {
    describe () {
        return this.deepExtend (super.describe (), {
            'id': 'huobipro',
            'name': 'Huobi Pro',
            'countries': [ 'CN' ],
            'rateLimit': 2000,
            'userAgent': this.userAgents['chrome39'],
            'version': 'v1',
            'accounts': undefined,
            'accountsById': undefined,
            'hostname': 'api.huobi.pro', // api.testnet.huobi.pro
            'pro': true,
            'has': {
                'CORS': false,
                'fetchTickers': true,
                'fetchDepositAddress': true,
                'fetchOHLCV': true,
                'fetchOrder': true,
                'fetchOrders': true,
                'fetchOpenOrders': true,
                'fetchClosedOrders': true,
                'fetchTradingLimits': true,
                'fetchMyTrades': true,
                'withdraw': true,
                'fetchCurrencies': true,
                'fetchDeposits': true,
                'fetchWithdrawals': true,
            },
            'timeframes': {
                '1m': '1min',
                '5m': '5min',
                '15m': '15min',
                '30m': '30min',
                '1h': '60min',
                '4h': '4hour',
                '1d': '1day',
                '1w': '1week',
                '1M': '1mon',
                '1y': '1year',
            },
            'urls': {
                'test': {
                    'market': 'https://api.testnet.huobi.pro',
                    'public': 'https://api.testnet.huobi.pro',
                    'private': 'https://api.testnet.huobi.pro',
                },
                'logo': 'https://user-images.githubusercontent.com/1294454/76137448-22748a80-604e-11ea-8069-6e389271911d.jpg',
                'api': {
                    'market': 'https://api.huobi.pro',
                    'public': 'https://api.huobi.pro',
                    'private': 'https://api.huobi.pro',
                    'v2Public': 'https://api.huobi.pro',
                    'v2Private': 'https://api.huobi.pro',
                    'futuresPublic': 'https://api.hbdm.com',
                    'futuresPrivate': 'https://api.hbdm.com',
                    'usdtSwapPublic': 'https://api.hbdm.com',
                    'usdtSwapPrivate': 'https://api.hbdm.com',
                    'swapPublic': 'https://api.hbdm.com',
                    'swapPrivate': 'https://api.hbdm.com',
                    'futuresMarket': 'https://api.hbdm.com',
                    'swapMarket': 'https://api.hbdm.com',
                    'usdtSwapMarket': 'https://api.hbdm.com',
                },
                'www': 'https://www.huobi.pro',
                'referral': 'https://www.huobi.co/en-us/topic/invited/?invite_code=rwrd3',
                'doc': 'https://huobiapi.github.io/docs/spot/v1/cn/',
                'fees': 'https://www.huobi.pro/about/fee/',
            },
            'api': {
                'v2Public': {
                    'get': [
                        'reference/currencies',
                    ],
                },
                'v2Private': {
                    'get': [
                        'account/ledger',
                        'account/withdraw/quota',
                        'account/deposit/address',
                        'reference/transact-fee-rate',
                    ],
                    'post': [
                        'sub-user/management',
                    ],
                },
                'market': {
                    'get': [
                        'history/kline', // 获取K线数据
                        'detail/merged', // 获取聚合行情(Ticker)
                        'depth', // 获取 Market Depth 数据
                        'trade', // 获取 Trade Detail 数据
                        'history/trade', // 批量获取最近的交易记录
                        'detail', // 获取 Market Detail 24小时成交量数据
                        'tickers',
                    ],
                },
                'public': {
                    'get': [
                        'common/symbols', // 查询系统支持的所有交易对
                        'common/currencys', // 查询系统支持的所有币种
                        'common/timestamp', // 查询系统当前时间
                        'common/exchange', // order limits
                        'settings/currencys', // ?language=en-US
                    ],
                },
                'private': {
                    'get': [
                        'account/accounts', // 查询当前用户的所有账户(即account-id)
                        'account/accounts/{id}/balance', // 查询指定账户的余额
                        'account/accounts/{sub-uid}',
                        'account/history',
                        'cross-margin/loan-info',
                        'fee/fee-rate/get',
                        'order/openOrders',
                        'order/orders',
                        'order/orders/{id}', // 查询某个订单详情
                        'order/orders/{id}/matchresults', // 查询某个订单的成交明细
                        'order/orders/getClientOrder',
                        'order/history', // 查询当前委托、历史委托
                        'order/matchresults', // 查询当前成交、历史成交
                        'dw/withdraw-virtual/addresses', // 查询虚拟币提现地址
                        'query/deposit-withdraw',
                        'margin/loan-orders', // 借贷订单
                        'margin/accounts/balance', // 借贷账户详情
                        'points/actions',
                        'points/orders',
                        'subuser/aggregate-balance',
                        'stable-coin/exchange_rate',
                        'stable-coin/quote',
                    ],
                    'post': [
                        'futures/transfer',
                        'order/batch-orders',
                        'order/orders/place', // 创建并执行一个新订单 (一步下单， 推荐使用)
                        'order/orders/submitCancelClientOrder',
                        'order/orders/batchCancelOpenOrders',
                        'order/orders', // 创建一个新的订单请求 （仅创建订单，不执行下单）
                        'order/orders/{id}/place', // 执行一个订单 （仅执行已创建的订单）
                        'order/orders/{id}/submitcancel', // 申请撤销一个订单请求
                        'order/orders/batchcancel', // 批量撤销订单
                        'dw/balance/transfer', // 资产划转
                        'dw/withdraw/api/create', // 申请提现虚拟币
                        'dw/withdraw-virtual/create', // 申请提现虚拟币
                        'dw/withdraw-virtual/{id}/place', // 确认申请虚拟币提现
                        'dw/withdraw-virtual/{id}/cancel', // 申请取消提现虚拟币
                        'dw/transfer-in/margin', // 现货账户划入至借贷账户
                        'dw/transfer-out/margin', // 借贷账户划出至现货账户
                        'margin/orders', // 申请借贷
                        'margin/orders/{id}/repay', // 归还借贷
                        'stable-coin/exchange',
                        'subuser/transfer',
                    ],
                },
                'futuresPublic': {
                    'get': [
                        'v1/contract_contract_info', // 获取 Market ContractContractInfo
                    ],
                },
                'futuresMarket': {
                    'get': [
                        'market/history/kline',
                    ],
                },
                'futuresPrivate': {
                    'post': [
                        'v1/contract_order',  // 下单
                        'v1/contract_cancel',  // 取消订单
                        'v1/contract_hisorders',  // 未成交订单
                        'v1/contract_order_info',  // 订单信息
                        'v1/contract_order_detail',  // 订单明细,包含交易明细
                        'v1/contract_position_info', // 持仓信息
                        'v1/contract_account_info',  // 账户余额
                    ],
                },
                'usdtSwapPublic': {
                    'get': [
                        'v1/swap_contract_info',
                    ],
                },
                'usdtSwapMarket': {
                    'get': [
                        'market/history/kline',
                    ],
                },
                'usdtSwapPrivate': {
                    'post': [
                        'v1/swap_order',
                        'v1/swap_cancel',  // 取消订单
                        'v1/swap_hisorders',  // 历史委托
                        'v1/swap_order_info',  // 订单信息
                        'v1/swap_order_detail',  // 订单明细,包含交易明细
                        'v1/swap_position_info', // 持仓信息
                        'v1/swap_account_info',  // 账户余额
                    ],
                },
                'swapPublic': {
                    'get': [
                        'v1/swap_contract_info',
                    ],
                },
                'swapPrivate': {
                    'post': [
                        'v1/swap_order',
                        'v1/swap_cancel',  // 取消订单
                        'v1/swap_hisorders',  // 历史委托
                        'v1/swap_order_info',  // 订单信息
                        'v1/swap_order_detail',  // 订单明细,包含交易明细
                        'v1/swap_position_info', // 持仓信息
                        'v1/swap_account_info',  // 账户余额
                    ],
                },
                'swapMarket': {
                    'get': [
                        'market/history/kline',
                    ],
                },
            },
            'fees': {
                'trading': {
                    'tierBased': false,
                    'percentage': true,
                    'maker': 0.002,
                    'taker': 0.002,
                },
            },
            'exceptions': {
                'exact': {
                    // err-code
                    'bad-request': BadRequest,
                    'api-not-support-temp-addr': PermissionDenied, // {"status":"error","err-code":"api-not-support-temp-addr","err-msg":"API withdrawal does not support temporary addresses","data":null}
                    'timeout': RequestTimeout, // {"ts":1571653730865,"status":"error","err-code":"timeout","err-msg":"Request Timeout"}
                    'gateway-internal-error': ExchangeNotAvailable, // {"status":"error","err-code":"gateway-internal-error","err-msg":"Failed to load data. Try again later.","data":null}
                    'account-frozen-balance-insufficient-error': InsufficientFunds, // {"status":"error","err-code":"account-frozen-balance-insufficient-error","err-msg":"trade account balance is not enough, left: `0.0027`","data":null}
                    'invalid-amount': InvalidOrder, // eg "Paramemter `amount` is invalid."
                    'order-limitorder-amount-min-error': InvalidOrder, // limit order amount error, min: `0.001`
                    'order-limitorder-amount-max-error': InvalidOrder, // market order amount error, max: `1000000`
                    'order-marketorder-amount-min-error': InvalidOrder, // market order amount error, min: `0.01`
                    'order-limitorder-price-min-error': InvalidOrder, // limit order price error
                    'order-limitorder-price-max-error': InvalidOrder, // limit order price error
                    'order-orderstate-error': OrderNotFound, // canceling an already canceled order
                    'order-queryorder-invalid': OrderNotFound, // querying a non-existent order
                    'order-update-error': ExchangeNotAvailable, // undocumented error
                    'api-signature-check-failed': AuthenticationError,
                    'api-signature-not-valid': AuthenticationError, // {"status":"error","err-code":"api-signature-not-valid","err-msg":"Signature not valid: Incorrect Access key [Access key错误]","data":null}
                    'base-record-invalid': OrderNotFound, // https://github.com/ccxt/ccxt/issues/5750
                    // err-msg
                    'invalid symbol': BadSymbol, // {"ts":1568813334794,"status":"error","err-code":"invalid-parameter","err-msg":"invalid symbol"}
                    'invalid-parameter': BadRequest, // {"ts":1576210479343,"status":"error","err-code":"invalid-parameter","err-msg":"symbol trade not open now"}
                    'base-symbol-trade-disabled': BadSymbol, // {"status":"error","err-code":"base-symbol-trade-disabled","err-msg":"Trading is disabled for this symbol","data":null}
                    'system-maintenance': OnMaintenance, // {"status": "error", "err-code": "system-maintenance", "err-msg": "System is in maintenance!", "data": null}
                },
            },
            'options': {
                // https://github.com/ccxt/ccxt/issues/5376
                'fetchOrdersByStatesMethod': 'private_get_order_orders', // 'private_get_order_history' // https://github.com/ccxt/ccxt/pull/5392
                'fetchOpenOrdersMethod': 'fetch_open_orders_v1', // 'fetch_open_orders_v2' // https://github.com/ccxt/ccxt/issues/5388
                'createMarketBuyOrderRequiresPrice': true,
                'fetchMarketsMethod': 'publicGetCommonSymbols',
                'fetchBalanceMethod': 'privateGetAccountAccountsIdBalance',
                'createOrderMethod': 'privatePostOrderOrdersPlace',
                'language': 'en-US',
                'fetchMarkets': ['spot', 'futures', 'usdtSwap', 'swap'],
            },
            'commonCurrencies': {
                // https://github.com/ccxt/ccxt/issues/6081
                // https://github.com/ccxt/ccxt/issues/3365
                // https://github.com/ccxt/ccxt/issues/2873
                'GET': 'Themis', // conflict with GET (Guaranteed Entrance Token, GET Protocol)
                'HOT': 'Hydro Protocol', // conflict with HOT (Holo) https://github.com/ccxt/ccxt/issues/4929
            },
        });
    }

    async fetchTradingLimits (symbols = undefined, params = {}) {
        // this method should not be called directly, use loadTradingLimits () instead
        //  by default it will try load withdrawal fees of all currencies (with separate requests)
        //  however if you define symbols = [ 'ETH/BTC', 'LTC/BTC' ] in args it will only load those
        await this.loadMarkets ();
        if (symbols === undefined) {
            symbols = this.symbols;
        }
        const result = {};
        for (let i = 0; i < symbols.length; i++) {
            const symbol = symbols[i];
            result[symbol] = await this.fetchTradingLimitsById (this.marketId (symbol), params);
        }
        return result;
    }

    async fetchTradingLimitsById (id, params = {}) {
        const request = {
            'symbol': id,
        };
        const response = await this.publicGetCommonExchange (this.extend (request, params));
        //
        //     { status:   "ok",
        //         data: {                                  symbol: "aidocbtc",
        //                              'buy-limit-must-less-than':  1.1,
        //                          'sell-limit-must-greater-than':  0.9,
        //                         'limit-order-must-greater-than':  1,
        //                            'limit-order-must-less-than':  5000000,
        //                    'market-buy-order-must-greater-than':  0.0001,
        //                       'market-buy-order-must-less-than':  100,
        //                   'market-sell-order-must-greater-than':  1,
        //                      'market-sell-order-must-less-than':  500000,
        //                       'circuit-break-when-greater-than':  10000,
        //                          'circuit-break-when-less-than':  10,
        //                 'market-sell-order-rate-must-less-than':  0.1,
        //                  'market-buy-order-rate-must-less-than':  0.1        } }
        //
        return this.parseTradingLimits (this.safeValue (response, 'data', {}));
    }

    parseTradingLimits (limits, symbol = undefined, params = {}) {
        //
        //   {                                  symbol: "aidocbtc",
        //                  'buy-limit-must-less-than':  1.1,
        //              'sell-limit-must-greater-than':  0.9,
        //             'limit-order-must-greater-than':  1,
        //                'limit-order-must-less-than':  5000000,
        //        'market-buy-order-must-greater-than':  0.0001,
        //           'market-buy-order-must-less-than':  100,
        //       'market-sell-order-must-greater-than':  1,
        //          'market-sell-order-must-less-than':  500000,
        //           'circuit-break-when-greater-than':  10000,
        //              'circuit-break-when-less-than':  10,
        //     'market-sell-order-rate-must-less-than':  0.1,
        //      'market-buy-order-rate-must-less-than':  0.1        }
        //
        return {
            'info': limits,
            'limits': {
                'amount': {
                    'min': this.safeFloat (limits, 'limit-order-must-greater-than'),
                    'max': this.safeFloat (limits, 'limit-order-must-less-than'),
                },
            },
        };
    }

    async fetchMarkets (params = {}) {
        const types = this.safeValue (this.options, 'fetchMarkets');
        let result = [];
        for (let i = 0; i < types.length; i++) {
            const markets = await this.fetchMarketsByType (types[i], params);
            result = this.arrayConcat (result, markets);
        }
        return result;
    }

    parseMarkets (markets) {
        const result = [];
        for (let i = 0; i < markets.length; i++) {
            result.push (this.parseMarket (markets[i]));
        }
        return result;
    }

    parseMarket (market) {
        //
        // spot markets
        // {
        //     "quote-currency": "usdt",
        //     "price-precision": 2,
        //     "amount-precision": 6,
        //     "symbol-partition": "main",
        //     "symbol": "btcusdt",
        //     "state": "online",
        //     "value-precision": 8,
        //     "min-order-amt": 0.0001,
        //     "max-order-amt": 1000,
        //     "min-order-value": 5,
        //     "limit-order-min-order-amt": 0.0001,
        //     "limit-order-max-order-amt": 1000,
        //     "sell-market-min-order-amt": 0.0001,
        //     "sell-market-max-order-amt": 100,
        //     "buy-market-max-order-value": 1000000,
        //     "leverage-ratio": 5,
        //     "super-margin-leverage-ratio": 3,
        //     "funding-leverage-ratio": 3,
        //     "api-trading": "enabled"
        // }
        //
        // futures markets
        // {
        //     "symbol": "BTC",
        //     "contract_code": "BTC201225",
        //     "contract_type": "quarter",
        //     "contract_size": 100,
        //     "price_tick": 0.01,
        //     "delivery_date": "20201225",
        //     "create_date": "20200605",
        //     "contract_status": 1
        // }
        const contractCode = this.safeString (market, 'contract_code');
        const contractType = this.safeString (market, 'contract_type');
        let type = 'spot';
        if (contractCode !== undefined) {
            if (contractType !== undefined) {
                type = 'futures';
            } else {
                type = 'swap';
            }
        }
        let baseId = '';
        let id = '';
        let quoteId = '';
        let base = '';
        let quote = '';
        let symbol = '';
        let spot = '';
        let futures = '';
        let swap = '';
        let precision = {};
        let active = false;
        if (type === 'spot') {
            baseId = this.safeString (market, 'base-currency');
            quoteId = this.safeString (market, 'quote-currency');
            id = baseId + quoteId;
            base = this.safeCurrencyCode (baseId);
            quote = this.safeCurrencyCode (quoteId);
            symbol = base + '/' + quote;
            futures = false;
            spot = true;
            swap = false;
            precision = {
                'amount': market['amount-precision'],
                'price': market['price-precision'],
            };
            active = this.safeString (market, 'state') === 'online';
        } else {
            id = this.safeString (market, 'contract_code');
            if (type === 'swap') {
                const parts = id.split ('-');
                baseId = this.safeString (parts, 0);
                quoteId = this.safeString (parts, 1);
                futures = false;
                swap = true;
            } else {
                baseId = this.safeString (market, 'symbol');
                quoteId = 'USD';
                futures = true;
                swap = false;
            }
            base = this.safeCurrencyCode (baseId);
            quote = this.safeCurrencyCode (quoteId);
            symbol = id;
            spot = false;
            precision = {
                'amount': 1,
                'price': this.safeFloat (market, 'price_tick'),
            };
            active = this.safeFloat (market, 'contract_status') === 1;
        }
        const maker = (base === 'OMG') ? 0 : 0.2 / 100;
        const taker = (base === 'OMG') ? 0 : 0.2 / 100;
        const minAmount = this.safeFloat (market, 'min-order-amt', Math.pow (10, -precision['amount']));
        const maxAmount = this.safeFloat (market, 'max-order-amt');
        const minCost = this.safeFloat (market, 'min-order-value', 0);
        return {
            'id': id,
            'symbol': symbol,
            'base': base,
            'quote': quote,
            'baseId': baseId,
            'quoteId': quoteId,
            'active': active,
            'precision': precision,
            'taker': taker,
            'maker': maker,
            'type': type,
            'spot': spot,
            'futures': futures,
            'swap': swap,
            'option': false,
            'limits': {
                'amount': {
                    'min': minAmount,
                    'max': maxAmount,
                },
                'price': {
                    'min': Math.pow (10, -precision['price']),
                    'max': undefined,
                },
                'cost': {
                    'min': minCost,
                    'max': undefined,
                },
            },
            'info': market,
        };
    }

    async fetchMarketsByType (type, params = {}) {
        if (type === 'spot') {
            const method = 'publicGetCommonSymbols';
            const response = await this[method] (params);
            const markets = this.safeValue (response, 'data');
            return this.parseMarkets (markets);
        } else if (type === 'futures') {
            const method = 'futuresPublicGetV1ContractContractInfo';
            const response = await this[method] (params);
            const markets = this.safeValue (response, 'data');
            return this.parseMarkets (markets);
        } else if (type === 'usdtSwap') {
            const method = 'usdtSwapPublicGetV1SwapContractInfo';
            const response = await this[method] (params);
            const markets = this.safeValue (response, 'data');
            return this.parseMarkets (markets);
        } else if (type === 'swap') {
            const method = 'swapPublicGetV1SwapContractInfo';
            const response = await this[method] (params);
            const markets = this.safeValue (response, 'data');
            return this.parseMarkets (markets);
        }
    }

    parseTicker (ticker, market = undefined) {
        //
        // fetchTicker
        //
        //     {
        //         "amount": 26228.672978342216,
        //         "open": 9078.95,
        //         "close": 9146.86,
        //         "high": 9155.41,
        //         "id": 209988544334,
        //         "count": 265846,
        //         "low": 8988.0,
        //         "version": 209988544334,
        //         "ask": [ 9146.87, 0.156134 ],
        //         "vol": 2.3822168242201668E8,
        //         "bid": [ 9146.86, 0.080758 ],
        //     }
        //
        // fetchTickers
        //     {
        //         symbol: "bhdht",
        //         open:  2.3938,
        //         high:  2.4151,
        //         low:  2.3323,
        //         close:  2.3909,
        //         amount:  628.992,
        //         vol:  1493.71841095,
        //         count:  2088,
        //         bid:  2.3643,
        //         bidSize:  0.7136,
        //         ask:  2.4061,
        //         askSize:  0.4156
        //     }
        //
        let symbol = undefined;
        if (market !== undefined) {
            symbol = market['symbol'];
        }
        const timestamp = this.safeInteger (ticker, 'ts');
        let bid = undefined;
        let bidVolume = undefined;
        let ask = undefined;
        let askVolume = undefined;
        if ('bid' in ticker) {
            if (Array.isArray (ticker['bid'])) {
                bid = this.safeFloat (ticker['bid'], 0);
                bidVolume = this.safeFloat (ticker['bid'], 1);
            } else {
                bid = this.safeFloat (ticker, 'bid');
                bidVolume = this.safeValue (ticker, 'bidSize');
            }
        }
        if ('ask' in ticker) {
            if (Array.isArray (ticker['ask'])) {
                ask = this.safeFloat (ticker['ask'], 0);
                askVolume = this.safeFloat (ticker['ask'], 1);
            } else {
                ask = this.safeFloat (ticker, 'ask');
                askVolume = this.safeValue (ticker, 'askSize');
            }
        }
        const open = this.safeFloat (ticker, 'open');
        const close = this.safeFloat (ticker, 'close');
        let change = undefined;
        let percentage = undefined;
        let average = undefined;
        if ((open !== undefined) && (close !== undefined)) {
            change = close - open;
            average = this.sum (open, close) / 2;
            if ((close !== undefined) && (close > 0)) {
                percentage = (change / open) * 100;
            }
        }
        const baseVolume = this.safeFloat (ticker, 'amount');
        const quoteVolume = this.safeFloat (ticker, 'vol');
        let vwap = undefined;
        if (baseVolume !== undefined && quoteVolume !== undefined && baseVolume > 0) {
            vwap = quoteVolume / baseVolume;
        }
        return {
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'high': this.safeFloat (ticker, 'high'),
            'low': this.safeFloat (ticker, 'low'),
            'bid': bid,
            'bidVolume': bidVolume,
            'ask': ask,
            'askVolume': askVolume,
            'vwap': vwap,
            'open': open,
            'close': close,
            'last': close,
            'previousClose': undefined,
            'change': change,
            'percentage': percentage,
            'average': average,
            'baseVolume': baseVolume,
            'quoteVolume': quoteVolume,
            'info': ticker,
        };
    }

    async fetchOrderBook (symbol, limit = undefined, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'symbol': market['id'],
            'type': 'step0',
        };
        const response = await this.marketGetDepth (this.extend (request, params));
        //
        //     {
        //         "status": "ok",
        //         "ch": "market.btcusdt.depth.step0",
        //         "ts": 1583474832790,
        //         "tick": {
        //             "bids": [
        //                 [ 9100.290000000000000000, 0.200000000000000000 ],
        //                 [ 9099.820000000000000000, 0.200000000000000000 ],
        //                 [ 9099.610000000000000000, 0.205000000000000000 ],
        //             ],
        //             "asks": [
        //                 [ 9100.640000000000000000, 0.005904000000000000 ],
        //                 [ 9101.010000000000000000, 0.287311000000000000 ],
        //                 [ 9101.030000000000000000, 0.012121000000000000 ],
        //             ],
        //             "ts":1583474832008,
        //             "version":104999698780
        //         }
        //     }
        //
        if ('tick' in response) {
            if (!response['tick']) {
                throw new ExchangeError (this.id + ' fetchOrderBook() returned empty response: ' + this.json (response));
            }
            const tick = this.safeValue (response, 'tick');
            const timestamp = this.safeInteger (tick, 'ts', this.safeInteger (response, 'ts'));
            const result = this.parseOrderBook (tick, timestamp);
            result['nonce'] = this.safeInteger (tick, 'version');
            return result;
        }
        throw new ExchangeError (this.id + ' fetchOrderBook() returned unrecognized response: ' + this.json (response));
    }

    async fetchTicker (symbol, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'symbol': market['id'],
        };
        const response = await this.marketGetDetailMerged (this.extend (request, params));
        //
        //     {
        //         "status": "ok",
        //         "ch": "market.btcusdt.detail.merged",
        //         "ts": 1583494336669,
        //         "tick": {
        //             "amount": 26228.672978342216,
        //             "open": 9078.95,
        //             "close": 9146.86,
        //             "high": 9155.41,
        //             "id": 209988544334,
        //             "count": 265846,
        //             "low": 8988.0,
        //             "version": 209988544334,
        //             "ask": [ 9146.87, 0.156134 ],
        //             "vol": 2.3822168242201668E8,
        //             "bid": [ 9146.86, 0.080758 ],
        //         }
        //     }
        //
        const ticker = this.parseTicker (response['tick'], market);
        const timestamp = this.safeValue (response, 'ts');
        ticker['timestamp'] = timestamp;
        ticker['datetime'] = this.iso8601 (timestamp);
        return ticker;
    }

    async fetchTickers (symbols = undefined, params = {}) {
        await this.loadMarkets ();
        const response = await this.marketGetTickers (params);
        const tickers = this.safeValue (response, 'data');
        const timestamp = this.safeInteger (response, 'ts');
        const result = {};
        for (let i = 0; i < tickers.length; i++) {
            const marketId = this.safeString (tickers[i], 'symbol');
            const market = this.safeValue (this.markets_by_id, marketId);
            let symbol = marketId;
            if (market !== undefined) {
                symbol = market['symbol'];
                const ticker = this.parseTicker (tickers[i], market);
                ticker['timestamp'] = timestamp;
                ticker['datetime'] = this.iso8601 (timestamp);
                result[symbol] = ticker;
            }
        }
        return this.filterByArray (result, 'symbol', symbols);
    }

    parseTrade (trade, market = undefined) {
        //
        // fetchTrades (public)
        //
        //     {
        //         "amount": 0.010411000000000000,
        //         "trade-id": 102090736910,
        //         "ts": 1583497692182,
        //         "id": 10500517034273194594947,
        //         "price": 9096.050000000000000000,
        //         "direction": "sell"
        //     }
        //
        // fetchMyTrades (private)
        //
        let symbol = undefined;
        if (market === undefined) {
            const marketId = this.safeString (trade, 'symbol');
            if (marketId in this.markets_by_id) {
                market = this.markets_by_id[marketId];
            }
        }
        if (market !== undefined) {
            symbol = market['symbol'];
        }
        let timestamp = this.safeInteger2 (trade, 'ts', 'created-at');
        timestamp = this.safeInteger (trade, 'created_at', timestamp);
        const order = this.safeString2 (trade, 'order-id', 'order_id');
        let side = this.safeString (trade, 'direction');
        let type = this.safeString (trade, 'type');
        if (type !== undefined) {
            const typeParts = type.split ('-');
            side = typeParts[0];
            type = typeParts[1];
        }
        const takerOrMaker = this.safeString (trade, 'role');
        const price = this.safeFloat2 (trade, 'price', 'trade_price');
        let amount = this.safeFloat2 (trade, 'filled-amount', 'amount');
        amount = this.safeFloat (trade, 'trade_volume', amount);
        let cost = undefined;
        if (market !== undefined && market['type'] !== 'spot') {
            cost = this.safeFloat (trade, 'trade_turnover');
        } else if (price !== undefined) {
            if (amount !== undefined) {
                cost = amount * price;
            }
        }
        let fee = undefined;
        let feeCost = this.safeFloat2 (trade, 'filled-fees', 'trade_fee');
        let feeCurrency = undefined;
        if (market !== undefined) {
            feeCurrency = (side === 'buy') ? market['base'] : market['quote'];
        }
        const filledPoints = this.safeFloat (trade, 'filled-points');
        if (filledPoints !== undefined) {
            if ((feeCost === undefined) || (feeCost === 0.0)) {
                feeCost = filledPoints;
                feeCurrency = this.safeCurrencyCode (this.safeString (trade, 'fee-deduct-currency'));
            }
        }
        if (feeCost !== undefined) {
            fee = {
                'cost': feeCost,
                'currency': feeCurrency,
            };
        }
        const tradeId = this.safeString2 (trade, 'trade-id', 'tradeId');
        const id = this.safeString (trade, 'id', tradeId);
        return {
            'id': id,
            'info': trade,
            'order': order,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'symbol': symbol,
            'type': type,
            'side': side,
            'takerOrMaker': takerOrMaker,
            'price': price,
            'amount': amount,
            'cost': cost,
            'fee': fee,
        };
    }

    async fetchMyTrades (symbol = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        let market = this.market (symbol);
        const request = {};
        const type = market['type'];
        let method = '';
        if (type === 'spot') {
            if (symbol !== undefined) {
                market = this.market (symbol);
                request['symbol'] = market['id'];
            }
            if (limit !== undefined) {
                request['size'] = limit; // 1-100 orders, default is 100
            }
            if (since !== undefined) {
                request['start-date'] = this.ymd (since); // maximum query window size is 2 days, query window shift should be within past 120 days
            }
            const response = await this.privateGetOrderMatchresults (this.extend (request, params));
            const trades = this.parseTrades (response['data'], market, since, limit);
            return trades;
        } else if (type === 'futures') {
            request['symbol'] = market['base'];
            method = 'futuresPrivatePostV1ContractOrderDetail';
        } else {
            request['contract_code'] = symbol;
            if (market['quote'] === 'USDT') {
                method = 'usdtSwapPrivatePostV1SwapOrderDetail';
            } else {
                method = 'swapPrivatePostV1SwapOrderDetail';
            }
        }
        const orderId = this.safeString2 (params, 'order_id', 'id');
        this.omit (params, 'order_id', 'id');
        if (orderId !== undefined) {
            request['order_id'] = orderId;
        }
        if (limit !== undefined) {
            request['page_size'] = limit;
        }
        const response = await this[method] (this.extend (request, params));
        const trades = this.safeValue (response['data'], 'trades', []);
        return this.parseTrades (trades, market, since, limit);
    }

    async fetchTrades (symbol, since = undefined, limit = 1000, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'symbol': market['id'],
        };
        if (limit !== undefined) {
            request['size'] = limit;
        }
        const response = await this.marketGetHistoryTrade (this.extend (request, params));
        //
        //     {
        //         "status": "ok",
        //         "ch": "market.btcusdt.trade.detail",
        //         "ts": 1583497692365,
        //         "data": [
        //             {
        //                 "id": 105005170342,
        //                 "ts": 1583497692182,
        //                 "data": [
        //                     {
        //                         "amount": 0.010411000000000000,
        //                         "trade-id": 102090736910,
        //                         "ts": 1583497692182,
        //                         "id": 10500517034273194594947,
        //                         "price": 9096.050000000000000000,
        //                         "direction": "sell"
        //                     }
        //                 ]
        //             },
        //             // ...
        //         ]
        //     }
        //
        const data = this.safeValue (response, 'data');
        let result = [];
        for (let i = 0; i < data.length; i++) {
            const trades = this.safeValue (data[i], 'data', []);
            for (let j = 0; j < trades.length; j++) {
                const trade = this.parseTrade (trades[j], market);
                result.push (trade);
            }
        }
        result = this.sortBy (result, 'timestamp');
        return this.filterBySymbolSinceLimit (result, symbol, since, limit);
    }

    parseOHLCV (ohlcv, market = undefined) {
        //
        //     {
        //         "amount":1.2082,
        //         "open":0.025096,
        //         "close":0.025095,
        //         "high":0.025096,
        //         "id":1591515300,
        //         "count":6,
        //         "low":0.025095,
        //         "vol":0.0303205097
        //     }
        //
        return [
            this.safeTimestamp (ohlcv, 'id'),
            this.safeFloat (ohlcv, 'open'),
            this.safeFloat (ohlcv, 'high'),
            this.safeFloat (ohlcv, 'low'),
            this.safeFloat (ohlcv, 'close'),
            this.safeFloat (ohlcv, 'amount'),
        ];
    }

    async fetchOHLCV (symbol, timeframe = '1m', since = undefined, limit = 1000, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const type = market['type'];
        let request = {};
        let method = '';
        if (type === 'spot') {
            request = {
                'symbol': market['id'],
                'period': this.timeframes[timeframe],
            };
            method = 'marketGetHistoryKline';
        } else {
            request = {
                'period': this.timeframes[timeframe],
            };
            if (type === 'futures') {
                request['symbol'] = symbol;
                method = 'futuresMarketGetMarketHistoryKline';
            } else if (market['quote'] === 'USDT') {
                request['contract_code'] = symbol;
                method = 'usdtSwapMarketGetMarketHistoryKline';
            } else {
                request['contract_code'] = symbol;
                method = 'swapMarketGetMarketHistoryKline';
            }
        }
        if (limit !== undefined) {
            request['size'] = limit;
        }
        if (since !== undefined) {
            request['from'] = parseInt (since / 1000);
        }
        const response = await this[method] (this.extend (request, params));
        //
        //     {
        //         "status":"ok",
        //         "ch":"market.ethbtc.kline.1min",
        //         "ts":1591515374371,
        //         "data":[
        //             {"amount":0.0,"open":0.025095,"close":0.025095,"high":0.025095,"id":1591515360,"count":0,"low":0.025095,"vol":0.0},
        //             {"amount":1.2082,"open":0.025096,"close":0.025095,"high":0.025096,"id":1591515300,"count":6,"low":0.025095,"vol":0.0303205097},
        //             {"amount":0.0648,"open":0.025096,"close":0.025096,"high":0.025096,"id":1591515240,"count":2,"low":0.025096,"vol":0.0016262208},
        //         ]
        //     }
        //
        const data = this.safeValue (response, 'data', []);
        return this.parseOHLCVs (data, market, timeframe, since, limit);
    }

    async fetchAccounts (params = {}) {
        await this.loadMarkets ();
        const response = await this.privateGetAccountAccounts (params);
        return response['data'];
    }

    async fetchCurrencies (params = {}) {
        const request = {
            'language': this.options['language'],
        };
        const response = await this.publicGetSettingsCurrencys (this.extend (request, params));
        const currencies = this.safeValue (response, 'data');
        const result = {};
        for (let i = 0; i < currencies.length; i++) {
            const currency = currencies[i];
            //
            //  {                     name: "ctxc",
            //              'display-name': "CTXC",
            //        'withdraw-precision':  8,
            //             'currency-type': "eth",
            //        'currency-partition': "pro",
            //             'support-sites':  null,
            //                'otc-enable':  0,
            //        'deposit-min-amount': "2",
            //       'withdraw-min-amount': "4",
            //            'show-precision': "8",
            //                      weight: "2988",
            //                     visible:  true,
            //              'deposit-desc': "Please don’t deposit any other digital assets except CTXC t…",
            //             'withdraw-desc': "Minimum withdrawal amount: 4 CTXC. !>_<!For security reason…",
            //           'deposit-enabled':  true,
            //          'withdraw-enabled':  true,
            //    'currency-addr-with-tag':  false,
            //             'fast-confirms':  15,
            //             'safe-confirms':  30                                                             }
            //
            const id = this.safeValue (currency, 'name');
            const precision = this.safeInteger (currency, 'withdraw-precision');
            const code = this.safeCurrencyCode (id);
            const active = currency['visible'] && currency['deposit-enabled'] && currency['withdraw-enabled'];
            const name = this.safeString (currency, 'display-name');
            result[code] = {
                'id': id,
                'code': code,
                'type': 'crypto',
                // 'payin': currency['deposit-enabled'],
                // 'payout': currency['withdraw-enabled'],
                // 'transfer': undefined,
                'name': name,
                'active': active,
                'fee': undefined, // todo need to fetch from fee endpoint
                'precision': precision,
                'limits': {
                    'amount': {
                        'min': Math.pow (10, -precision),
                        'max': Math.pow (10, precision),
                    },
                    'price': {
                        'min': Math.pow (10, -precision),
                        'max': Math.pow (10, precision),
                    },
                    'cost': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'deposit': {
                        'min': this.safeFloat (currency, 'deposit-min-amount'),
                        'max': Math.pow (10, precision),
                    },
                    'withdraw': {
                        'min': this.safeFloat (currency, 'withdraw-min-amount'),
                        'max': Math.pow (10, precision),
                    },
                },
                'info': currency,
            };
        }
        return result;
    }

    async fetchBalance (params = {}) {
        await this.loadMarkets ();
        await this.loadAccounts ();
        const type = this.safeString (params, 'type', 'spot');
        const quote = this.safeString (params, 'quote', '');
        let method = '';
        let request = {};
        if (type === 'spot') {
            request = {
                'id': this.accounts[0]['id'],
            };
            method = this.options['fetchBalanceMethod'];
        } else if (type === 'futures') {
            method = 'futuresPrivatePostV1ContractAccountInfo';
        } else if (quote === 'USDT') {
            method = 'usdtSwapPrivatePostV1SwapAccountInfo';
        } else {
            method = 'swapPrivatePostV1SwapAccountInfo';
        }
        const response = await this[method] (this.extend (request, params));
        let balances = this.safeValue (response['data'], 'list', []);
        if (type !== 'spot') {
            balances = this.safeValue (response, 'data', []);
        }
        const result = { 'info': response };
        for (let i = 0; i < balances.length; i++) {
            const balance = balances[i];
            if (type === 'spot') {
                const currencyId = this.safeString (balance, 'currency');
                const code = this.safeCurrencyCode (currencyId);
                let account = undefined;
                if (code in result) {
                    account = result[code];
                } else {
                    account = this.account ();
                }
                if (balance['type'] === 'trade') {
                    account['free'] = this.safeFloat2 (balance, 'balance');
                }
                if (balance['type'] === 'frozen') {
                    account['used'] = this.safeFloat2 (balance, 'balance');
                }
                result[code] = account;
            } else {
                const account = {};
                let code = undefined;
                if (type === 'futures' && quote === 'USDT') {
                    code = this.safeString (balance, 'contract_code');
                } else {
                    code = this.safeString (balance, 'symbol');
                }
                account['free'] = this.safeFloat (balance, 'margin_available');
                account['total'] = this.safeFloat (balance, 'margin_balance');
                result[code] = account;
            }
        }
        return this.parseBalance (result);
    }

    async fetchOrdersByStates (states, symbol = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const type = market['type'];
        let method = undefined;
        const request = {};
        if (type === 'spot') {
            request['symbol'] = market['id'];
            request['states'] = states;
            method = this.safeString (this.options, 'fetchOrdersByStatesMethod', 'private_get_order_orders');
        } else {
            request['contract_code'] = symbol;
            request['trade_type'] = 0;
            request['type'] = 1;
            request['create_date'] = 90;
            request['page_size'] = 50;
            request['status'] = states;
            if (type === 'futures') {
                request['symbol'] = market['base'];
                method = 'futuresPrivatePostV1ContractHisorders';
            } else if (market['quote'] === 'USDT') {
                method = 'usdtSwapPrivatePostV1SwapHisorders';
            } else {
                method = 'swapPrivatePostV1SwapHisorders';
            }
        }
        const response = await this[method] (this.extend (request, params));
        //
        //     { status:   "ok",
        //         data: [ {                  id:  13997833014,
        //                                symbol: "ethbtc",
        //                          'account-id':  3398321,
        //                                amount: "0.045000000000000000",
        //                                 price: "0.034014000000000000",
        //                          'created-at':  1545836976871,
        //                                  type: "sell-limit",
        //                        'field-amount': "0.045000000000000000",
        //                   'field-cash-amount': "0.001530630000000000",
        //                          'field-fees': "0.000003061260000000",
        //                         'finished-at':  1545837948214,
        //                                source: "spot-api",
        //                                 state: "filled",
        //                         'canceled-at':  0                      }  ] }
        //
        if (type === 'spot') {
            return this.parseOrders (response['data'], market, since, limit);
        } else {
            return this.parseOrders (response['data']['orders'], market, since, limit);
        }
    }

    async fetchOrder (id, symbol = undefined, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const type = market['type'];
        const request = {};
        let method = undefined;
        if (type === 'spot') {
            request['id'] = id;
            method = 'privateGetOrderOrdersId';
        } else if (id) {
            request['order_id'] = id;
        }
        if (type === 'futures') {
            request['symbol'] = market['base'];
            method = 'futuresPrivatePostV1ContractOrderInfo';
        } else if (type === 'swap' && market['quote'] === 'USDT') {
            request['contract_code'] = symbol;
            method = 'usdtSwapPrivatePostV1SwapOrderInfo';
        } else {
            request['contract_code'] = symbol;
            method = 'swapPrivatePostV1SwapOrderInfo';
        }
        const response = await this[method] (this.extend (request, params));
        const order = this.safeValue (response, 'data');
        if (type === 'spot') {
            return this.parseOrder (order);
        } else {
            if (order.length <= 0) {
                throw new OrderNotFound ();
            } else if (order.length === 1) {
                return this.parseOrder (order[0]);
            } else {
                const result = [];
                for (let i = 0; i < order.length; i++) {
                    result.push (this.parseOrder (order[i]));
                }
                return result;
            }
        }
    }

    async fetchOrders (symbol = undefined, since = undefined, limit = undefined, params = {}) {
        return await this.fetchOrdersByStates ('pre-submitted,submitted,partial-filled,filled,partial-canceled,canceled', symbol, since, limit, params);
    }

    async fetchOpenOrders (symbol = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        if (market['type'] === 'spot') {
            const method = this.safeString (this.options, 'fetchOpenOrdersMethod', 'fetch_open_orders_v1');
            return await this[method] (symbol, since, limit, params);
        } else {
            return await this.fetchOrdersByStates ('3,4', symbol, since, limit, params);
        }
    }

    async fetchOpenOrdersV1 (symbol = undefined, since = undefined, limit = undefined, params = {}) {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchOpenOrdersV1 requires a symbol argument');
        }
        return await this.fetchOrdersByStates ('pre-submitted,submitted,partial-filled', symbol, since, limit, params);
    }

    async fetchClosedOrders (symbol = undefined, since = undefined, limit = undefined, params = {}) {
        return await this.fetchOrdersByStates ('filled,partial-canceled,canceled', symbol, since, limit, params);
    }

    async fetchOpenOrdersV2 (symbol = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchOpenOrders requires a symbol argument');
        }
        const market = this.market (symbol);
        let accountId = this.safeString (params, 'account-id');
        if (accountId === undefined) {
            // pick the first account
            await this.loadAccounts ();
            for (let i = 0; i < this.accounts.length; i++) {
                const account = this.accounts[i];
                if (account['type'] === 'spot') {
                    accountId = this.safeString (account, 'id');
                    if (accountId !== undefined) {
                        break;
                    }
                }
            }
        }
        const request = {
            'symbol': market['id'],
            'account-id': accountId,
        };
        if (limit !== undefined) {
            request['size'] = limit;
        }
        const omitted = this.omit (params, 'account-id');
        const response = await this.privateGetOrderOpenOrders (this.extend (request, omitted));
        //
        //     {
        //         "status":"ok",
        //         "data":[
        //             {
        //                 "symbol":"ethusdt",
        //                 "source":"api",
        //                 "amount":"0.010000000000000000",
        //                 "account-id":1528640,
        //                 "created-at":1561597491963,
        //                 "price":"400.000000000000000000",
        //                 "filled-amount":"0.0",
        //                 "filled-cash-amount":"0.0",
        //                 "filled-fees":"0.0",
        //                 "id":38477101630,
        //                 "state":"submitted",
        //                 "type":"sell-limit"
        //             }
        //         ]
        //     }
        //
        const data = this.safeValue (response, 'data', []);
        return this.parseOrders (data, market, since, limit);
    }

    parseOrderStatus (status) {
        const statuses = {
            'partial-filled': 'open',
            'partial-canceled': 'canceled',
            'filled': 'closed',
            'canceled': 'canceled',
            'submitted': 'open',
            '1': 'open',
            '2': 'open',
            '3': 'open',
            '4': 'open',
            '5': 'canceled',
            '6': 'closed',
            '7': 'canceled',
            '11': 'canceling',
        };
        return this.safeString (statuses, status, status);
    }

    parseOrder (order, market = undefined) {
        //
        //     {                  id:  13997833014,
        //                    symbol: "ethbtc",
        //              'account-id':  3398321,
        //                    amount: "0.045000000000000000",
        //                     price: "0.034014000000000000",
        //              'created-at':  1545836976871,
        //                      type: "sell-limit",
        //            'field-amount': "0.045000000000000000", // they have fixed it for filled-amount
        //       'field-cash-amount': "0.001530630000000000", // they have fixed it for filled-cash-amount
        //              'field-fees': "0.000003061260000000", // they have fixed it for filled-fees
        //             'finished-at':  1545837948214,
        //                    source: "spot-api",
        //                     state: "filled",
        //             'canceled-at':  0                      }
        //
        //     {                  id:  20395337822,
        //                    symbol: "ethbtc",
        //              'account-id':  5685075,
        //                    amount: "0.001000000000000000",
        //                     price: "0.0",
        //              'created-at':  1545831584023,
        //                      type: "buy-market",
        //            'field-amount': "0.029100000000000000", // they have fixed it for filled-amount
        //       'field-cash-amount': "0.000999788700000000", // they have fixed it for filled-cash-amount
        //              'field-fees': "0.000058200000000000", // they have fixed it for filled-fees
        //             'finished-at':  1545831584181,
        //                    source: "spot-api",
        //                     state: "filled",
        //             'canceled-at':  0                      }
        //
        const id = this.safeString2 (order, 'id', 'order_id');
        const clientOrderId = this.safeString (order, 'client_order_id');
        let side = undefined;
        let type = undefined;
        let status = undefined;
        if ('type' in order) {
            const orderType = order['type'].split ('-');
            side = orderType[0];
            type = orderType[1];
            status = this.parseOrderStatus (this.safeString (order, 'state'));
        } else {
            side = this.safeString (order, 'direction');
            const price_type = this.safeString (order, 'order_price_type');
            const price_type_map = {
                '1': 'limit',
                '2': 'market',
                '9': 'market',
            };
            type = this.safeString (price_type_map, price_type);
            status = this.parseOrderStatus (this.safeString (order, 'status'));
        }
        let symbol = undefined;
        if (market === undefined) {
            if ('symbol' in order) {
                if (order['symbol'] in this.markets_by_id) {
                    const marketId = order['symbol'];
                    market = this.markets_by_id[marketId];
                }
            }
        }
        if (market !== undefined) {
            symbol = market['symbol'];
        }
        let timestamp = this.safeInteger2 (order, 'created-at', 'create_date');
        timestamp = this.safeInteger (order, 'created_at', timestamp);
        let amount = this.safeFloat2 (order, 'amount', 'volume');
        let filled = this.safeFloat2 (order, 'filled-amount', 'field-amount'); // typo in their API, filled amount
        filled = this.safeFloat (order, 'trade_volume', filled);
        if ((type === 'market') && (side === 'buy')) {
            amount = (status === 'closed') ? filled : undefined;
        }
        let price = this.safeFloat (order, 'price');
        if (price === 0.0) {
            price = undefined;
        }
        let cost = this.safeFloat2 (order, 'filled-cash-amount', 'field-cash-amount'); // same typo
        cost = this.safeFloat (order, 'trade_turnover', cost);
        let remaining = undefined;
        let average = undefined;
        if (filled !== undefined) {
            if (amount !== undefined) {
                remaining = amount - filled;
            }
            // if cost is defined and filled is not zero
            if ((cost !== undefined) && (filled > 0)) {
                average = cost / filled;
            }
        }
        if (type !== 'spot') {
            average = this.safeFloat (order, 'trade_avg_price');
        }
        let feeCost = this.safeFloat2 (order, 'filled-fees', 'field-fees'); // typo in their API, filled fees
        feeCost = this.safeFloat (order, 'fee', feeCost);
        let fee = undefined;
        if (feeCost !== undefined) {
            let feeCurrency = undefined;
            if (market !== undefined) {
                feeCurrency = (side === 'sell') ? market['quote'] : market['base'];
            }
            fee = {
                'cost': feeCost,
                'currency': feeCurrency,
            };
        }
        return {
            'info': order,
            'id': id,
            'clientOrderId': clientOrderId,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'lastTradeTimestamp': undefined,
            'symbol': symbol,
            'type': type,
            'side': side,
            'price': price,
            'average': average,
            'cost': cost,
            'amount': amount,
            'filled': filled,
            'remaining': remaining,
            'status': status,
            'fee': fee,
            'trades': undefined,
        };
    }

    async createOrder (symbol, type, side, amount, price = undefined, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        let request = {};
        let method = '';
        if (market['spot'] === true) {
            await this.loadAccounts ();
            request = {
                'account-id': this.accounts[0]['id'],
                'symbol': market['id'],
                'type': side + '-' + type,
            };
            if ((type === 'market') && (side === 'buy')) {
                if (this.options['createMarketBuyOrderRequiresPrice']) {
                    if (price === undefined) {
                        throw new InvalidOrder (this.id + " market buy order requires price argument to calculate cost (total amount of quote currency to spend for buying, amount * price). To switch off this warning exception and specify cost in the amount argument, set .options['createMarketBuyOrderRequiresPrice'] = false. Make sure you know what you're doing.");
                    } else {
                        // despite that cost = amount * price is in quote currency and should have quote precision
                        // the exchange API requires the cost supplied in 'amount' to be of base precision
                        // more about it here: https://github.com/ccxt/ccxt/pull/4395
                        // we use priceToPrecision instead of amountToPrecision here
                        // because in this case the amount is in the quote currency
                        request['amount'] = this.costToPrecision (symbol, parseFloat (amount) * parseFloat (price));
                    }
                } else {
                    request['amount'] = this.costToPrecision (symbol, amount);
                }
            } else {
                request['amount'] = this.amountToPrecision (symbol, amount);
            }
            if (type === 'limit' || type === 'ioc' || type === 'limit-maker') {
                request['price'] = this.priceToPrecision (symbol, price);
            }
            method = this.options['createOrderMethod'];
        } else {
            request = {
                'contract_code': symbol,
                'order_price_type': type,
                'volume': parseInt (amount),
                'direction': side,
            };
            if (type === 'market') {
                request['order_price_type'] = 'optimal_20';
            } else {
                request['price'] = price;
            }
            if (market['type'] === 'futures') {
                method = 'futuresPrivatePostV1ContractOrder';
            } else if (market['quote'] === 'USDT') {
                method = 'usdtSwapPrivatePostV1SwapOrder';
            } else {
                method = 'swapPrivatePostV1SwapOrder';
            }
        }
        this.omit (params, 'type');
        const response = await this[method] (this.extend (request, params));
        const timestamp = this.milliseconds ();
        let id = undefined;
        if (market['type'] === 'spot') {
            id = this.safeString (response, 'data');
        } else {
            const data = this.safeValue (response, 'data', {});
            id = this.safeString (data, 'order_id_str');
        }
        return {
            'info': response,
            'id': id,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'lastTradeTimestamp': undefined,
            'status': undefined,
            'symbol': symbol,
            'type': type,
            'side': side,
            'price': price,
            'amount': amount,
            'filled': undefined,
            'remaining': undefined,
            'cost': undefined,
            'trades': undefined,
            'fee': undefined,
            'clientOrderId': undefined,
            'average': undefined,
        };
    }

    async cancelOrder (id, symbol = undefined, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const type = market['type'];
        const request = {};
        let method = '';
        if (type === 'spot') {
            request['id'] = id;
            method = 'privatePostOrderOrdersIdSubmitcancel';
        } else {
            if (id !== undefined) {
                request['order_id'] = id;
            }
            if (type === 'futures') {
                request['symbol'] = market['base'];
                method = 'futuresPrivatePostV1ContractCancel';
            } else if (type === 'swap' && market['quote'] === 'USDT') {
                request['contract_code'] = symbol;
                method = 'usdtSwapPrivatePostV1SwapCancel';
            } else {
                request['contract_code'] = symbol;
                method = 'swapPrivatePostV1SwapCancel';
            }
        }
        const response = await this[method] (this.extend (request, params));
        //
        //     let response = {
        //         'status': 'ok',
        //         'data': '10138899000',
        //     };
        //
        return this.extend (this.parseOrder (response), {
            'id': id,
            'status': 'canceled',
        });
    }

    currencyToPrecision (currency, fee) {
        return this.decimalToPrecision (fee, 0, this.currencies[currency]['precision']);
    }

    calculateFee (symbol, type, side, amount, price, takerOrMaker = 'taker', params = {}) {
        const market = this.markets[symbol];
        const rate = market[takerOrMaker];
        let cost = amount * rate;
        let key = 'quote';
        if (side === 'sell') {
            cost *= price;
        } else {
            key = 'base';
        }
        return {
            'type': takerOrMaker,
            'currency': market[key],
            'rate': rate,
            'cost': parseFloat (this.currencyToPrecision (market[key], cost)),
        };
    }

    parseDepositAddress (depositAddress, currency = undefined) {
        //
        //     {
        //         currency: "eth",
        //         address: "0xf7292eb9ba7bc50358e27f0e025a4d225a64127b",
        //         addressTag: "",
        //         chain: "eth"
        //     }
        //
        const address = this.safeString (depositAddress, 'address');
        const tag = this.safeString (depositAddress, 'addressTag');
        const currencyId = this.safeString (depositAddress, 'currency');
        const code = this.safeCurrencyCode (currencyId);
        this.checkAddress (address);
        return {
            'currency': code,
            'address': address,
            'tag': tag,
            'info': depositAddress,
        };
    }

    async fetchDepositAddress (code, params = {}) {
        await this.loadMarkets ();
        const currency = this.currency (code);
        const request = {
            'currency': currency['id'],
        };
        const response = await this.v2PrivateGetAccountDepositAddress (this.extend (request, params));
        //
        //     {
        //         code: 200,
        //         data: [
        //             {
        //                 currency: "eth",
        //                 address: "0xf7292eb9ba7bc50358e27f0e025a4d225a64127b",
        //                 addressTag: "",
        //                 chain: "eth"
        //             }
        //         ]
        //     }
        //
        const data = this.safeValue (response, 'data', []);
        return this.parseDepositAddress (this.safeValue (data, 0, {}), currency);
    }

    async fetchDeposits (code = undefined, since = undefined, limit = undefined, params = {}) {
        if (limit === undefined || limit > 100) {
            limit = 100;
        }
        await this.loadMarkets ();
        let currency = undefined;
        if (code !== undefined) {
            currency = this.currency (code);
        }
        const request = {
            'type': 'deposit',
            'from': 0, // From 'id' ... if you want to get results after a particular transaction id, pass the id in params.from
        };
        if (currency !== undefined) {
            request['currency'] = currency['id'];
        }
        if (limit !== undefined) {
            request['size'] = limit; // max 100
        }
        const response = await this.privateGetQueryDepositWithdraw (this.extend (request, params));
        // return response
        return this.parseTransactions (response['data'], currency, since, limit);
    }

    async fetchWithdrawals (code = undefined, since = undefined, limit = undefined, params = {}) {
        if (limit === undefined || limit > 100) {
            limit = 100;
        }
        await this.loadMarkets ();
        let currency = undefined;
        if (code !== undefined) {
            currency = this.currency (code);
        }
        const request = {
            'type': 'withdraw',
            'from': 0, // From 'id' ... if you want to get results after a particular transaction id, pass the id in params.from
        };
        if (currency !== undefined) {
            request['currency'] = currency['id'];
        }
        if (limit !== undefined) {
            request['size'] = limit; // max 100
        }
        const response = await this.privateGetQueryDepositWithdraw (this.extend (request, params));
        // return response
        return this.parseTransactions (response['data'], currency, since, limit);
    }

    parseTransaction (transaction, currency = undefined) {
        //
        // fetchDeposits
        //
        //     {
        //         'id': 8211029,
        //         'type': 'deposit',
        //         'currency': 'eth',
        //         'chain': 'eth',
        //         'tx-hash': 'bd315....',
        //         'amount': 0.81162421,
        //         'address': '4b8b....',
        //         'address-tag': '',
        //         'fee': 0,
        //         'state': 'safe',
        //         'created-at': 1542180380965,
        //         'updated-at': 1542180788077
        //     }
        //
        // fetchWithdrawals
        //
        //     {
        //         'id': 6908275,
        //         'type': 'withdraw',
        //         'currency': 'btc',
        //         'chain': 'btc',
        //         'tx-hash': 'c1a1a....',
        //         'amount': 0.80257005,
        //         'address': '1QR....',
        //         'address-tag': '',
        //         'fee': 0.0005,
        //         'state': 'confirmed',
        //         'created-at': 1552107295685,
        //         'updated-at': 1552108032859
        //     }
        //
        const timestamp = this.safeInteger (transaction, 'created-at');
        const updated = this.safeInteger (transaction, 'updated-at');
        const code = this.safeCurrencyCode (this.safeString (transaction, 'currency'));
        let type = this.safeString (transaction, 'type');
        if (type === 'withdraw') {
            type = 'withdrawal';
        }
        const status = this.parseTransactionStatus (this.safeString (transaction, 'state'));
        const tag = this.safeString (transaction, 'address-tag');
        let feeCost = this.safeFloat (transaction, 'fee');
        if (feeCost !== undefined) {
            feeCost = Math.abs (feeCost);
        }
        return {
            'info': transaction,
            'id': this.safeString (transaction, 'id'),
            'txid': this.safeString (transaction, 'tx-hash'),
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'address': this.safeString (transaction, 'address'),
            'tag': tag,
            'type': type,
            'amount': this.safeFloat (transaction, 'amount'),
            'currency': code,
            'status': status,
            'updated': updated,
            'fee': {
                'currency': code,
                'cost': feeCost,
                'rate': undefined,
            },
        };
    }

    parseTransactionStatus (status) {
        const statuses = {
            // deposit statuses
            'unknown': 'failed',
            'confirming': 'pending',
            'confirmed': 'ok',
            'safe': 'ok',
            'orphan': 'failed',
            // withdrawal statuses
            'submitted': 'pending',
            'canceled': 'canceled',
            'reexamine': 'pending',
            'reject': 'failed',
            'pass': 'pending',
            'wallet-reject': 'failed',
            // 'confirmed': 'ok', // present in deposit statuses
            'confirm-error': 'failed',
            'repealed': 'failed',
            'wallet-transfer': 'pending',
            'pre-transfer': 'pending',
        };
        return this.safeString (statuses, status, status);
    }

    async withdraw (code, amount, address, tag = undefined, params = {}) {
        await this.loadMarkets ();
        this.checkAddress (address);
        const currency = this.currency (code);
        const request = {
            'address': address, // only supports existing addresses in your withdraw address list
            'amount': amount,
            'currency': currency['id'].toLowerCase (),
        };
        if (tag !== undefined) {
            request['addr-tag'] = tag; // only for XRP?
        }
        const response = await this.privatePostDwWithdrawApiCreate (this.extend (request, params));
        const id = this.safeString (response, 'data');
        return {
            'info': response,
            'id': id,
        };
    }

    sign (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = '/';
        if (api === 'market') {
            url += api;
        } else if ((api === 'public') || (api === 'private')) {
            url += this.version;
        } else if ((api === 'v2Public') || (api === 'v2Private')) {
            url += 'v2';
        } else if (api === 'futuresPrivate' || api === 'futuresPublic') {
            url += 'api';
        } else if (api === 'swapPrivate' || api === 'swapPublic') {
            url += 'swap-api';
        } else if (api === 'usdtSwapPrivate' || api === 'usdtSwapPublic') {
            url += 'linear-swap-api';
        } else if (api === 'usdtSwapMarket') {
            url += 'linear-swap-ex';
        } else if (api === 'swapMarket') {
            url += '';
        }
        url += '/' + this.implodeParams (path, params);
        const query = this.omit (params, this.extractParams (path));
        if (api === 'private' || api === 'v2Private' || api === 'futuresPrivate' || api === 'swapPrivate' || api === 'usdtSwapPrivate') {
            this.checkRequiredCredentials ();
            const timestamp = this.ymdhms (this.milliseconds (), 'T');
            let request = {
                'SignatureMethod': 'HmacSHA256',
                'SignatureVersion': '2',
                'AccessKeyId': this.apiKey,
                'Timestamp': timestamp,
            };
            if (method !== 'POST') {
                request = this.extend (request, query);
            }
            request = this.keysort (request);
            let auth = this.urlencode (request);
            // unfortunately, PHP demands double quotes for the escaped newline symbol
            const apiurl = this.safeString (this.urls['api'], api, '');
            const hostname = apiurl.replace ('http://', '').replace ('https://', '');
            // eslint-disable-next-line quotes
            const payload = [ method, hostname, url, auth ].join ("\n");
            const signature = this.hmac (this.encode (payload), this.encode (this.secret), 'sha256', 'base64');
            auth += '&' + this.urlencode ({ 'Signature': signature });
            url += '?' + auth;
            if (method === 'POST') {
                body = this.json (query);
                headers = {
                    'Content-Type': 'application/json',
                };
            } else {
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                };
            }
        } else {
            if (Object.keys (params).length) {
                url += '?' + this.urlencode (params);
            }
        }
        url = this.implodeParams (this.urls['api'][api], {
            'hostname': this.hostname,
        }) + url;
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    handleErrors (httpCode, reason, url, method, headers, body, response, requestHeaders, requestBody) {
        if (response === undefined) {
            return; // fallback to default error handler
        }
        if ('status' in response) {
            //
            //     {"status":"error","err-code":"order-limitorder-amount-min-error","err-msg":"limit order amount error, min: `0.001`","data":null}
            //
            const status = this.safeString (response, 'status');
            if (status === 'error') {
                const code = this.safeString (response, 'err-code');
                const feedback = this.id + ' ' + body;
                this.throwExactlyMatchedException (this.exceptions['exact'], code, feedback);
                const message = this.safeString (response, 'err-msg');
                this.throwExactlyMatchedException (this.exceptions['exact'], message, feedback);
                throw new ExchangeError (feedback);
            }
        }
    }
};
