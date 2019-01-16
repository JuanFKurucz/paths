'use strict';
import Player from './Player.js';
import Question from './Question.js';
import Answer from './Answer.js';
import Coordinate from './Coordinate.js';
import Data from './Data.js';

let gameObject = null;

export default class Game {
  static getPath(){
    return gameObject.path;
  }
  constructor(canvas,background){
    this.canvas = canvas;
    this.background = background;
    this.ctx = this.canvas.getContext("2d");
    this.width = parseFloat(this.canvas.getAttribute("width"));
    this.height = parseFloat(this.canvas.getAttribute("height"));

    let mid = {
      x:parseInt(this.width/2),
      y:parseInt(this.height/2)
    }
    Question.setPosition(new Coordinate(mid.x,mid.y-100));
    Question.setAnswerPosition(
      new Coordinate(mid.x-175,this.height-20),
      new Coordinate(mid.x+175,this.height-20)
    );
    this.already=[];
    this.questions={};
    this.player = new Player(new Coordinate(mid.x,mid.y));

    this.path=[];
    this.loadGame();

    this.play();
    this.eventHandlers();
    gameObject = this;
  }

  loadGame(){
    const questions = Data.questions,
          questionsLength = questions.length;

    for(let q=0;q<questionsLength;q++){
      const question = new Question(questions[q].id,questions[q].text);
      this.questions[questions[q].id]=question;
      if(questions[q].hasOwnProperty("answers")){
        const answers = questions[q].answers,
        answersLength = answers.length;
        for(let a=0;a<answersLength;a++){
          const source      = questions[q].id,
                destination = answers[a].destination,
                answer      = new Answer(source,destination,answers[a].text);
          if(answers[a].hasOwnProperty("action")){
            answer.action = answers[a].action;
          }
          if(answers[a].hasOwnProperty("condition")){
            answer.condition = answers[a].condition;
          }
          this.questions[source].addAnswer(answer);
        }
      }
    }



    let $debug = document.querySelector("#debuggGraph");
    this.currentQuestion = this.questions["0"];
    this.currentQuestion.visited=true;
    this.path.push(this.currentQuestion);
    this.createTableTree($debug,this.currentQuestion);
  }

  appendRedirect(parent,id){
    const br = document.createElement("br");
    parent.appendChild(br);
    const italic = document.createElement("i");
    italic.textContent="Redirects to question "+id;
    parent.appendChild(italic);
  }

  createTableTree(parent,question){
    this.already.push(question.id);
    const table = document.createElement("table");
    table.style="width:100%";
    parent.appendChild(table);
    const trMain = document.createElement("tr");
    table.appendChild(trMain);
    const tdQuestion = document.createElement("td");
    tdQuestion.textContent = question.id+" - "+question.title;
    tdQuestion.setAttribute("colspan",question.answers.length);
    trMain.appendChild(tdQuestion);
    const trAnswer = document.createElement("tr");
    table.appendChild(trAnswer);

    let answersLength = question.answers.length;
    for(let a=0;a<answersLength;a++){
      if(question.answers[a].canShow(this.player)){
        const tdAnswer1 = document.createElement("td");
        tdAnswer1.textContent = question.answers[a].text;
        tdAnswer1.id="question-"+question.id+"-answer-"+a;
        trAnswer.appendChild(tdAnswer1);
      }
    }
    return table;
  }

  draw(ctx){
    ctx.drawImage(this.background, 0, 0);
  }

  play(){
    this.draw(this.ctx);
    this.player.draw(this.ctx);
    this.currentQuestion.draw(this.ctx,this.player);
    requestAnimationFrame((timestamp) => {
        this.play();
    });
  }

  changeQuestion(){
    const answer = this.currentQuestion.chooseAnswer(this.player);
    if(answer&&answer!==null){
      const newQuestion = this.questions[answer.getDestination()];
      if(newQuestion && newQuestion !== null){
        this.player.resetPosition();
        this.player.act(answer.action);
        this.currentQuestion=newQuestion;
        this.currentQuestion.visited=true;
        if(newQuestion.id == "0"){
          this.path=[];
        } else {
          this.path.push(this.currentQuestion);
        }
        const tdAnswer = document.querySelector("#question-"+answer.source+"-answer-"+answer.position);
        console.log(tdAnswer);
        console.log("#question-"+answer.source+"-answer-"+answer.position);
        if(this.already.indexOf(answer.destination)===-1){
          if(tdAnswer && tdAnswer != null){
            tdAnswer.appendChild(this.createTableTree(tdAnswer,this.currentQuestion));
          }
        } else if(tdAnswer.getElementsByTagName("table").length===0 && tdAnswer.getElementsByTagName("i").length===0) {
          this.appendRedirect(tdAnswer,answer.destination);
        }
      }
    }
  }

  eventHandlers(){
    document.addEventListener('keydown', (event) => {
      const code = event.keyCode;
      switch(code){
        case 65:
        case 37:
          this.player.move("left",this.ctx);
          break;
        case 68:
        case 39:
          this.player.move("right",this.ctx);
          break;
        case 87:
        case 38:
          this.player.move("up",this.ctx);
          break;
        case 83:
        case 40:
          this.player.move("down",this.ctx);
          break;
        case 32:
          this.player.resetPosition();
          this.currentQuestion=this.questions["0"];
          break;
      }
      this.changeQuestion();
    });
  }

}
