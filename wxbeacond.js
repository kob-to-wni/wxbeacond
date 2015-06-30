var bleacon = require("bleacon");
var moment = require("moment");
var fs = require("fs");
var path = require("path");

var PORT = 8888;

/**
 * ファイルの存在チェック
 */
function exists(file){
	try{
		fs.accessSync(file, fs.R_OK);
		return true;
	} catch (e){
		return false;
	}
}

/**
 * ログ
 */
function log(message){
	console.log("[" + moment().format("YYYY/MM/DD HH:mm:ss") + "] " + message);
}

/**
 * 簡易HTTPサーバー
 */
var server = require("http").createServer(function(request, response) {
	//URLの整形
	var p = request.url;
	if(p.lastIndexOf("/") == p.length - 1){
		p += "index.html"
	}
	if(p.indexOf("/") == 0){
		p = p.substring(1);
	}
	//実パス変換
	var realPath = path.resolve(__dirname, p);
	if(exists(realPath) == false){
		//ファイルが存在しない
		log("404 Not Found: " + request.url + " => " + realPath);
		response.writeHead(404);
		response.end();
		return;
	}
	//返却
	log("200 OK: " + request.url + " => " + realPath);
	fs.readFile(realPath, "binary", function(err, data){
		response.writeHead(200, {"Content-Length": data.length});
		response.write(data, "binary");
		response.end();
	});
});
server.listen(PORT, "127.0.0.1", function() {
    log("Server is listening... Press Ctrl-C for quit server.");
});

/**
 * WebSocket
 */
var socket = require("socket.io")(server);
socket.on("connection", function(s){
	//接続した
	log("Connected.");
	s.on("event", function(data){
		//イベント発生
		log("Event raised.");
	});
	s.on("disconnect", function(){
		//切断した
		log("Disconnected.");
	});
});

/**
 * ビーコン検出時処理
 */
bleacon.on('discover', function(beacon) {
	//変換
	var temperature = (((beacon.major >> 4) & 0x03ff) * 100 - 30000) / 1000.0;
	var humidity = ((beacon.major << 3) & 0x0078) | ((beacon.minor >> 13) & 0x0007);
	var pressure = Math.floor(((beacon.minor & 0x1fff) * 0.1 + 300) * 10) / 10;

	//送信
	socket.sockets.emit("data", '{ "rssi": ' + beacon.rssi + ', "temperature": ' + temperature + ', "humidity": ' + humidity + ', "pressure": ' + pressure + ' }');
});
//ビーコン検索開始
bleacon.startScanning("c722db4c5d911801beb5001c4de7b3fd");

setInterval(function(){
	var beacon = {
		rssi: -1 * Math.floor(Math.random() * 100)
	};
	var temperature = 25 + Math.floor(Math.random() * 10) / 10;
	var humidity = 50 + Math.floor(Math.random() * 10 - 5) / 10;
	var pressure = 1013 + Math.floor(Math.random() * 10 - 5) / 10;
	socket.sockets.emit("data", '{ "rssi": ' + beacon.rssi + ', "temperature": ' + temperature + ', "humidity": ' + humidity + ', "pressure": ' + pressure + ' }');
}, 1000);
