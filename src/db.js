var low = require("lowdb");
var FileSync = require("lowdb/adapters/FileSync");

var adapter = new FileSync("storage.json");
var db2 = low(adapter);

// Set some defaults (required if your JSON file is empty)
var objects = {};
var streams = ['BTCUSDT', 'ETHUSDT', 'DOGEUSDT', 'FILUSDT', 'BNBUSDT', 'ADAUSDT', 'TRXUSDT', 'LTCUSDT', '1INCHUSDT', 'ZRXUSDT'];
for (i = 0; i < streams.length; i++) {
  objects[streams[i]] = [0,0];
}

db2.defaults(objects).write();

var update = module.exports.update = function update(symbol, buy, sell) {
    //console.log(symbol, buy, sell);
    buyCurr = db2.get(symbol).value()[0];
    sellCurr = db2.get(symbol).value()[1];
    lastRatio = buyCurr/sellCurr
    currRatio = (buyCurr+buy)/(sellCurr+sell)
    return db2.set(symbol, [buyCurr+buy, sellCurr+sell, currRatio, 100*(currRatio-lastRatio)/lastRatio]).write();
};

var read = module.exports.read =  function read(param) {
  //console.log(param);
  return db2.get(param).value();
};
