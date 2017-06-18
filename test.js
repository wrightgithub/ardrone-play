var express = require('express');
var arDrone = require('ar-drone');
var querystring = require('querystring');
var client = arDrone.createClient();
var dronestream = require("dronestream");
var app = express();
// 设置静态文件路径
app.use(express.static('public'));

var latestImage;
var latestVideo;

// 获取图片
app.get('/see/:id', function(req, res) {
    // console.log('in see.................')
    res.writeHead(200, { 'Content-Type': 'image/png' });
    return res.end(latestImage, "binary");
});
client.getPngStream()
    .on('error', console.log)
    .on('data', function(frame) {
        latestImage = frame;
    });

// 获取视频
dronestream.listen(3001, {
    tcpVideoStream: client.getVideoStream()
});




// 基本 web 请求
app.get('/', function(req, res) {
    res.send('Hello World');
})

app.get('/takeoff', function(req, res) {
    client.takeoff();
    res.end("plane has takeoff")
    console.log('takeoff')
})


app.get('/land', function(req, res) {
    client.land()
    res.end("plane has land")
    console.log('land')
})

var server = app.listen(8081, function() {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

})