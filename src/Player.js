'use strict';
import Coordinate from './Coordinate.js';
export default class Player {
  constructor(cord){
    this.width=50;
    this.height=50;
    this.initialCord = new Coordinate(parseInt(cord.x-this.width/2),parseInt(cord.y-this.height/2));
    this.cord = new Coordinate(this.initialCord.x,this.initialCord.y);
    this.color="#000000";
    this.speed=15;
    this.data={
      "money":0,
    }
  }

  resetPosition(){
    this.cord.copy(this.initialCord);
  }

  draw(ctx){
    ctx.fillStyle = this.color;
    ctx.fillRect(this.cord.x, this.cord.y, this.width, this.height);
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

  /*
  * Returns 0 if not
  * Returns 1 if it is right answer
  * Returns -1 if it is left answer
  */
  inAnswerZone(){
    if(this.cord.y>this.initialCord.y*2-this.width){
      if(this.cord.x<=this.initialCord.x){
        return -1;
      }
      return 1;
    }
    return 0;
  }

  move(direction,ctx,speed=null){
    if(speed == null){
      speed=this.speed;
    }
    let newX=this.cord.x,
        newY=this.cord.y;
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
      this.cord.x=newX;
      this.cord.y=newY;
    } else if(speed>0) {
      this.move(direction,ctx,speed-1);
    }
  }

  act(action){
    if(action !== null){
      for(let key in action){
        if(!this.data.hasOwnProperty(key)){
          this.data[key]=0;
        }
        this.data[key]+=parseInt(action[key]);
        if(this.data[key]<0){
          this.data[key]=0;
        }
      }
    }
  }
}
