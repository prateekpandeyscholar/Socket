var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var url = requre('url');
var bodyParser = require('body-parser');
app.use(bodyParser());
var clientResponseRef;
app.get('/*',(req,res)=>{
  var pathname = url.parse(req.url).pathname;
  var obj = {
    pathname:pathname,
    method:"get",
    params: req.query
  }
  io.emit("page-request",obj);
  clientResponseRef=res;
})
app.post('/*',(req,res)=>{
    var pathname = url.parse(req.url).pathname;
    var obj = {
      pathname:pathname,
      method:"post",
      params: req.body
    }
    io.emit("page-request",obj);
    clientResponseRef=res;
})
io.on('conntection',(socket)=>{
    console.log('a node connected');
    socket.on("page-response",(response)=>{
    clientResponseRef.send(response);
    })
})
var server_port = process.env.YOUR_PORT||process.env.port||3000;
http.listen(server_port,()=>{
    console.log("listentin on:"+ server_port);
})