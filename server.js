var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var url = require('url');
var bodyParser = require('body-parser');
//app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var clientResponseRef;
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.get("/", (req, res) => {
    res.send("Server is running!");
});
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
io.on('connection',(socket)=>{
    console.log('a node connected');
    socket.on("page-response",(response)=>{
        if (clientResponseRef) {
            clientResponseRef.send(response);
            clientResponseRef = null; // Reset to avoid stale references
        }
    })
})
var server_port = process.env.PORT||3000;
http.listen(server_port,"0.0.0.0",()=>{
    console.log("listening on:"+ server_port);
})