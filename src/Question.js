'use strict';
export default class Question {
  static x(){}
  static y(){}
  static setPosition(x,y){
    Question.x=x;
    Question.y=y;
  }

  constructor(title){
    this.title = title;
    this.answers = [];
  }

  addAnswer(answer){
    this.answers.push(answer);
  }

  draw(ctx){
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText(this.title, Question.x, Question.y);
  }

  chooseAnswer(index){
    if(index>=0 && index<this.answers.length){
      return this.answers[index].getDestination();
    }
    return null;
  }
}
