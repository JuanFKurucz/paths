'use strict';
export default class Coordinate {
  constructor(x,y){
    this.x=x;
    this.y=y;
  }

  copy(cord){
    this.x=cord.x;
    this.y=cord.y;
  }
}
