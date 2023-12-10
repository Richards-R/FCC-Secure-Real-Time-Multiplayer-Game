import Player from './Player.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 500

canvas.width = CANVAS_WIDTH
canvas.height = CANVAS_HEIGHT

let allPlayers = []
let clientPlayer
let clientFruit

let monkeyObj = new Image();

monkeyObj.onload = function() {
    ctx.drawImage(monkeyObj, ...getCoord(clientPlayer));
};
monkeyObj.src = "./public/images/monkey.png";

socket.on('connect', function(){
    
    let playerId = socket.io.engine.id
    
    // create a new player
    clientPlayer = new Player({
        x: Math.floor(Math.random() * CANVAS_WIDTH - 30),
        y: Math.floor(Math.random() * CANVAS_HEIGHT - 30),
        score: 0,
        id:playerId
    })

    socket.emit("start", clientPlayer)

    socket.on("player_updates", (players)=> {
        allPlayers = players
        drawPlayers(allPlayers)
    })

    socket.on("fruit", (fruit) => {
        clientFruit = fruit
        drawFruit(fruit.x, fruit.y, fruit.value)
    })

    document.addEventListener("keydown", (e) => {
    let dir_keydown;
    let direction;
    let wasd = ["W","A","S", "D"]
    if (wasd.includes(e.key)){
        dir_keydown = e.key.toLowerCase()
    }else{
        dir_keydown = e.key
    }
         
    switch (dir_keydown) {
        case "w":
        case "ArrowUp":
            direction = "up";
            break;
        case "a":
        case "ArrowLeft":
            direction = "left";
            break;
        case "s":
        case "ArrowDown":
            direction = "down";
            break;
        case "d":
        case "ArrowRight":
            direction = "right";
            break;
        default:null;
    }
        
        let monkeyObj = new Image();
   
        monkeyObj.onload = function() {
            ctx.drawImage(monkeyObj, ...getCoord(clientPlayer));
        };
        monkeyObj.src = "./public/images/monkey.png";
        
    if (direction) {
      ctx.clearRect(...getCoord(clientPlayer))
      clientPlayer.movePlayer(direction, 10)
      checkBoundary(clientPlayer);
      ctx.drawImage(monkeyObj, ...getCoord(clientPlayer));
      allPlayers = allPlayers.map(p => {
        if (p.id === clientPlayer.id) {
          return clientPlayer
        } else {
          return p
        }
      })
      socket.emit("player_updates", allPlayers)
    }

    if (clientPlayer.collision(clientFruit)) {
      ctx.clearRect(...getFruitCoord(clientFruit))
      clientFruit = { value: 0 }
      ctx.drawImage(monkeyObj, ...getCoord(clientPlayer));
      socket.emit("collision", clientPlayer)
      let rank = clientPlayer.calculateRank(allPlayers)
      document.getElementById("rank").innerText = rank
    }
  })

});

    // format player(square box) coordinate x, y, width, height
    function getCoord(player) {
      return [player.x, player.y, 40, 50]
    }
  
    // check boundary collision 
    function checkBoundary(player) {
      if (player.x < 5) {
        player.x = 5
      }
      if (player.x > CANVAS_WIDTH - 25) {
        player.x = CANVAS_WIDTH - 25
      }
      if (player.y < 5) {
        player.y = 5
      }
      if (player.y > CANVAS_HEIGHT - 25) {
        player.y = CANVAS_HEIGHT - 25
      }
    }

    // draw collectible for player to catch
    function drawFruit(x, y, value) {

        let fruit1 = "public/images/fruits/apple.png"
        let fruit2 = "public/images/fruits/banana.png"
        let fruit3 = "public/images/fruits/sberry.png"

        let fruitArr = [fruit1, fruit2, fruit3]
        let fruitObj = new Image();

        fruitObj.onload = function() {
            ctx.drawImage(fruitObj, x, y, 50, 50);
        };
        fruitObj.src = fruitArr[(Math.floor(Math.random() * fruitArr.length))];
    }
    
    // format fruit coordinate 
    // to clear it from screen
    function getFruitCoord(fruit) {
      let radFactor = fruit.value * 2 + 25
      return [fruit.x - radFactor, bait.y - radFactor, fruit.x + radFactor, fruit.y + radFactor]
    }
    
    // draw all players
    function drawPlayers(players) {
      for (let p of players) {
          ctx.drawImage(monkeyObj, ...getCoord(p));
      }
    }
          