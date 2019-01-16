'use strict';
import Game from './Game.js';
import Answer from './Answer.js';

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

  getRealAnswers(player){
    const realAnswers=[],
          answersLength = this.answers.length;
    for(let i=0;i<answersLength;i++){
      if(this.answers[i].canShow(player)){
        realAnswers.push(this.answers[i]);
      }
    }
    if(answersLength<2){
      const texts = ["Ir para atras","Volver al incio"],
            path = Game.getPath(),
            jumps = [path.lastIndexOf(this.id),0];
      let count=0;
      for(let i=answersLength;i<2-answersLength;i++){
        realAnswers.push(new Answer(this.id,jumps[count],texts[i]));
        count++;
      }
    }
    return realAnswers;
  }

  draw(ctx,player){
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText(this.title, Question.TitleCoordinate.x, Question.TitleCoordinate.y);


    ctx.fillStyle = "#000000";
    ctx.font = "21px Arial";
    let answers=this.getRealAnswers(player),
        answersLength = answers.length;

    for(let i=0;i<answersLength;i++){
      let cord = Question.AnswersCoordinates[i];
      ctx.fillText(answers[i].getText(), cord.x, cord.y);
    }
  }

  chooseAnswer(player){
    const direction = player.inAnswerZone();
    if(direction!==0){
      let answers=this.getRealAnswers(player),
          answersLength = answers.length;
      console.log(answers);
      let index = 0;
      if(direction === 1){
        index = 1;
      }

      if(index>=0 && index<answersLength){
        return answers[index];
      }
    }
    return null;
  }
}
