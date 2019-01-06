'use strict';
export default class Answer {
  constructor(source,destination,text){
    this.text = text;
    this.source = source;
    this.destination = destination;
  }

  getText(){
    return this.text;
  }

  getDestination(){
    return this.destination;
  }
}
