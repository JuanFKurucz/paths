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
    this.speed=15;
  }


  draw(ctx){
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  checkCollision(vertexes,ctx){
    const bg = [255,255,255];
    for(let v in vertexes){
      let pixelData = ctx.getImageData(vertexes[v][0], vertexes[v][1], 1, 1).data;
      for(let b in bg){
        if(bg[b]!==pixelData[b]){
          return true;
        }
      }
    }
    return false;
  }

  move(direction,ctx,speed=null){
    if(speed == null){
      speed=this.speed;
    }
    let newX=this.x,
        newY=this.y;
    let collision=true;
    switch(direction){
      case "up":
        newY-=speed;
        collision=this.checkCollision([[newX,newY],[newX+this.width,newY]],ctx);
        break;
      case "down":
        newY+=speed;
        collision=this.checkCollision([[newX,newY+this.height],[newX+this.width,newY+this.height]],ctx);
        break;
      case "left":
        newX-=speed;
        collision=this.checkCollision([[newX,newY],[newX,newY+this.height]],ctx);
        break;
      case "right":
        newX+=speed;
        collision=this.checkCollision([[newX+this.width,newY],[newX+this.width,newY+this.height]],ctx);
        break;
    }
    if(collision===false){
      this.x=newX;
      this.y=newY;
    } else if(speed>0) {
      this.move(direction,ctx,speed-1);
    }
  }
}
