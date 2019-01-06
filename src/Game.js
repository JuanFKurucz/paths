'use strict';
import Player from './Player.js';
import Question from './Question.js';
import Answer from './Answer.js';

export default class Game {
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
    Question.setPosition(mid.x,mid.y-100);
    console.log(mid);
    this.player = new Player(mid.x,mid.y);

    this.currentQuestion = new Question("Hello dah");

    this.play();
  }

  draw(ctx){
    ctx.drawImage(this.background, 0, 0);
  }

  play(){
    this.draw(this.ctx);
    this.player.draw(this.ctx);
    this.currentQuestion.draw(this.ctx);
    requestAnimationFrame((timestamp) => {
        this.play();
    });
  }

}
