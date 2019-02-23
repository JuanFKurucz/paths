'use strict';

/*
* Clase de pregunta, simulador de un nodo de un grafo
*/

import Game from './Game.js';
import Answer from './Answer.js';

export default class Question {
  static TitleCoordinate(){} //Esto aunque no lo creas va a ser una variable y no una funcion
  static AnswersCoordinates(){} //lo mismo con esto, probablemente un array este
  static setPosition(cord){
    Question.TitleCoordinate = cord; //told u
  }

  static setAnswerPosition(cord1,cord2){
    Question.AnswersCoordinates = [cord1,cord2]; //told u x2
  }

  constructor(id,title){
    /*
      Se asigna id, titulo, y se instancian respuestas y visitado como falso a la pregunta.
    */
    this.id = id;
    this.title = title;
    this.answers = [];
    this.visited = false;
  }

  /*
    Se le agrega una respuesta a la pregunta, se asigna la posicion de la respuesta segun la cantidad
    de respuestas que ya tenga la pregunta
  */
  addAnswer(answer){
    answer.position=this.answers.length;
    this.answers.push(answer);
  }

  /*
    Una funcion interesante


  */
  getRealAnswers(player){
    const realAnswers=[],
          answersLength = this.answers.length;
    for(let i=0;i<answersLength;i++){
      if(this.answers[i].canShow(player)){ //si el jugador puede ver la respuestas
        realAnswers.push(this.answers[i]);
      }
    }

    //Basicamente a esta altura realAnswers tiene todas las respuestas que el jugador puede ver

    if(answersLength<2){ //interesante esto puede q tenga q ser realAnswers.length
      //Si la pregunta tiene menos de dos respuestas se le asignan respuestas por defecto segun cuantas le falte
      //Las respuestas por defecto son ir para atras o volver al inicio con sus debidas acciones
      const texts = ["Ir para atras","Volver al incio"],
            path = Game.getPath(), //se obtiene el camino actual del jugador para saber cual es la pregunta anterior
            jumps = [path.lastIndexOf(this.id),0]; //los saltos son pregunta anterior o inicio
      let count=0;
      //se agregan las respuestas segun la demanda
      for(let i=answersLength;i<2-answersLength;i++){
        realAnswers.push(new Answer(this.id,jumps[count],texts[i]));
        count++;
      }
    }
    return realAnswers; //se retornan las respuestas reales
  }

  /*
  * Se dibuja la pregunta y sus respuestas
  */
  draw(ctx,player){
    //lo mismo de siempre, cosas de ctx, como colores posiciones textos, nada interesante.
    //Funciones de dibujado nomas.
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText(this.title, Question.TitleCoordinate.x, Question.TitleCoordinate.y);

    ctx.fillStyle = "#000000";
    ctx.font = "21px Arial";
    let answers=this.getRealAnswers(player), //llamado a la funcion anterior
        answersLength = answers.length;

    for(let i=0;i<answersLength;i++){
      let cord = Question.AnswersCoordinates[i];
      ctx.fillText(answers[i].getText(), cord.x, cord.y);
    }
  }

  /*
  * Elegir respuesta de la pregunta
  * retorna la respuesta elegida por el jugador
  */
  chooseAnswer(player){
    const direction = player.inAnswerZone(); //se obtiene en que lado esta el jugador
    if(direction!==0){
      let answers=this.getRealAnswers(player), //se obtienen las respuestas que el jugador puede hacer
          answersLength = answers.length;

      let index = 0;
      if(direction === 1){
        index = 1;
      }

      //index es el indice de la respuesta a seleccionar siendo 0 izquierda 1 derecha (creo, es indiferente esto)

      if(index>=0 && index<answersLength){
        return answers[index];
      }
    }
    return null;
  }
}
