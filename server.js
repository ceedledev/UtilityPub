const express = require('express');
const server = express();

server.get('/', (req, res) => {
  res.send("Coucou")
})

function keepAlive(){
    server.listen(3000, ()=>{console.log("Le serveur à bien démarrer.")});
}

module.exports = keepAlive;
