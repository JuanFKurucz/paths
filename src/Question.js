'use strict';
export default class Question {
  static TitleCoordinate(){}
  static AnswersCoordinates(){}
  static setPosition(cord){
    Question.TitleCoordinate = cord;
  }

  static setAnswerPosition(cord1,cord2){
    Question.AnswersCoordinates = [cord1,cord2];
  }

  constructor(id,title){
    this.id = id;
    this.title = title;
    this.answers = [];
    this.visited = false;
  }

  addAnswer(answer){
    answer.position=this.answers.length;
    this.answers.push(answer);
  }

  draw(ctx,player){
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText(this.title, Question.TitleCoordinate.x, Question.TitleCoordinate.y);


    ctx.fillStyle = "#000000";
    ctx.font = "21px Arial";
    let answersLength = this.answers.length;
    let realI=0;
    for(let i=0;i<answersLength;i++){
      if(this.answers[i].canShow(player)){
        let cord = Question.AnswersCoordinates[realI];
        ctx.fillText(this.answers[i].getText(), cord.x, cord.y);
        realI++;
      }
      if(realI===answersLength){
        break;
      }
    }
  }

  chooseAnswer(direction){
    if(direction!==0){
      let index = 0;
      if(direction === 1){
        index = 1;
      }
      if(index>=0 && index<this.answers.length){
        console.log(this.answers);
        return this.answers[index];
      }
    }
    return null;
  }
}
