var app = require("../src/server");
var http = require("http");
const {port} = require('../src/config')

const server = http.createServer(app);

const handleListening = () =>{
    process.env.NODE_ENV === "development"
        ? console.log(`http://localhost:${port}`)
        : console.log(`https://api-nurl.rsad.work`);
} 
server.listen(port, handleListening);
