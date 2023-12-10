require('dotenv').config();
const express = require('express');
const helmet = require('helmet')

const bodyParser = require('body-parser');
const expect = require('chai');
const socket = require("socket.io");
const cors = require('cors');

//const noCache = require('nocache')

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');
const app = express();

// helmet 
app.use(helmet.noSniff(),
    helmet.xssFilter(),
    helmet.hidePoweredBy({setTo : "PHP 7.4.3"}))

app.use(helmet.noCache())

// (ORIGINAL) Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  }); 
//

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/assets', express.static(process.cwd() + '/assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//For FCC testing purposes and enables user to connect from outside the hosting platform
app.use(cors({origin: '*'})); 

//For FCC testing purposes
fccTestingRoutes(app);
    
// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const portNum = process.env.PORT || 3000;

//Set up server and tests
const server = app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});
const io = socket.listen(server);
const Collectible = require("./public/Collectible.mjs")
const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 500

let players = []
let fruitNum = 0
let fruit

io.on('connection', (socket) => {

    //new player connects
    console.log("server side New Connection ID", socket.id)

    socket.on("start", (player) => {
        console.log("Player", player, "has joined")
        players.push(player)

        //send player info
        socket.emit("player_updates", players)

        //create a fruit
        fruit = createFruit(fruitNum)
        socket.emit("fruit", fruit)
    })

       //  on player collision
      socket.on("collision", (player) => {
        for (let p of players) {
          if (p.id === player.id) {
            p.score += fruit.value
          }
        }
        // update fruit
        fruit = createFruit(fruitNum)
        socket.emit("fruit", fruit)
      })
    })

// create a new collectible 
function createFruit(id) {
  let random_x, random_y, random_value
  random_x = Math.floor(Math.random() * (CANVAS_WIDTH - 50)) 
  random_y = Math.floor(Math.random() * (CANVAS_HEIGHT - 50)) 
  random_value = Math.floor(Math.random() * 5) + 1
  fruitNum += 1
  return new Collectible({
    x: random_x,
    y: random_y,
    value: random_value,
    id: id
  })
}


module.exports = app; // For testing
