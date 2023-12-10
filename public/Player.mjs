class Player {
  constructor({x, y, score, id}) {
      this.x = x
      this.y = y
      this.score = score
      this.id = id 
  }

  movePlayer(dir, speed) {
    if (dir == "left" ){
        this.x -= speed
        }
    if (dir == "right"){
        this.x += speed
        }
    if (dir == "up" ){
        this.y -= speed
      }
    if (dir == "down"){
        this.y += speed
      }
  }

  collision(item) {
    let baitRadius = item.value * 2 + 10
    if (Math.abs(this.x - item.x) < baitRadius + 15
      && Math.abs(this.y - item.y) < baitRadius + 15) {
      return true
    } else {
      return false
    }
  }

  calculateRank(arr) {
      let scoresArray = [];
      let ranking = 1;
        
      let playersTotal = (scoresArray = arr.map(x => x.score).sort((a,b) => b-a)).length;
       
      for (let i = 0; i < arr.length; i++) {
          if (arr[i].score > this.score) {
              ranking += 1
          }
      }
      return `Rank: ${ranking}/${playersTotal}`
  }
}


export default Player;
