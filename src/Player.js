'use strict';
export default class Player {
  constructor(x,y){
    this.width=50;
    this.height=50;
    this.initialX=parseInt(x-this.width/2);
    this.initialY=parseInt(y-this.height/2);
    this.x=this.initialX;
    this.y=this.initialY;
    this.color="#000000";
    this.speed=10;

    this.eventHandlers();
  }

  draw(ctx){
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  move(direction){
    switch(direction){
      case "up":
        this.y-=this.speed;
        break;
      case "down":
        this.y+=this.speed;
        break;
      case "left":
        this.x-=this.speed;
        break;
      case "right":
        this.x+=this.speed;
          break;
    }
    console.log(this.x,this.y);
  }

  eventHandlers(){
    document.addEventListener('keydown', (event) => {
      const code = event.keyCode;
      console.log(event);
      switch(code){
        case 65:
        case 37:
          this.move("left");
          break;
        case 68:
        case 39:
          this.move("right");
          break;
        case 87:
        case 38:
          this.move("up");
          break;
        case 83:
        case 40:
          this.move("down");
          break;
      }
    });
  }
}
