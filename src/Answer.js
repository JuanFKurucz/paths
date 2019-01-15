'use strict';
export default class Answer {
  constructor(source,destination,text){
    this.position=0;
    this.text = text;
    this.source = source;
    this.destination = destination;
    this.action={};
    this.condition={};
    this.optional=false;
  }

  getText(){
    return this.text;
  }

  getDestination(){
    return this.destination;
  }

  canShow(player){
    let canDo=true;
    for(let key in this.condition){
      if(eval(player.data[key]+""+this.condition[key]) === false){
        canDo=false;
        break;
      }
    }
    return canDo;
  }
}
