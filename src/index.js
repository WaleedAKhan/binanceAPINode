var db = require("./db");
const Binance = require('node-binance-api');
const binance = new Binance().options({
  APIKEY: '',
  APISECRET: ''
});

binance.options.reconnect = true;

//var buySellRatios = {}

var streams = ['BTCUSDT', 'ETHUSDT', 'DOGEUSDT', 'FILUSDT', 'BNBUSDT', 'ADAUSDT', 'TRXUSDT', 'LTCUSDT', '1INCHUSDT', 'ZRXUSDT']
//var streams = 'BTCUSDT';

 binance.websockets.trades(streams, (trades) => {

   //console.log(trades);
  let {e:eventType, E:eventTime, s:symbol, p:price, q:quantity, m:maker, a:tradeId, T:tradeTime} = trades;
  //console.info(symbol+" trade update. price: "+price+", quantity: "+quantity+", maker: "+maker);
  //console.info(trades.s);
  //console.log(db.read(symbol));

  if(maker){
    var action = 'sell';
    var sellAmount = parseFloat(quantity)*parseFloat(price);
    var buyAmount = 0;
	var netFlow = - sellAmount;
	}
  else{
	var action = 'buy';
	var sellAmount = 0;
    var buyAmount = parseFloat(quantity)*parseFloat(price);
    var netFlow = buyAmount;
  }
  //
  // if (symbol in buySellRatios == false){
	//   buySellRatios[symbol] = [buyAmount, sellAmount];
	// 	//console.log(action, buyAmount, sellAmount);
  // }


  db.update(symbol, buyAmount, sellAmount);
  var dbRead = db.read(symbol);
  var ratio = dbRead[0]/dbRead[1];
  //console.log(ratio);
  var date = new Date(tradeTime).toLocaleTimeString("en-US");
  //ratio = buySellRatios[symbol][0]/buySellRatios[symbol][1];
  if(ratio > 1.4 || ratio < 0.7) {
	  console.log(ratio, symbol, price,date);
  };




});


//console.log(binance);
