'use strict';

/*
* Clase de respuestas, simula adyacencia en un grafo
*/

export default class Answer {
  constructor(source,destination,text){
    /*
      Un constructor digno de explicar

      Source es la id de la pregunta que origina esta respuesta
      Destionation es la id de la pregunta a la cual se dirige esta respuesta
      Text es el texto de la respuesta
    */
    this.position=0; //interesting
    this.text = text; //texto
    this.source = source; //etc
    this.destination = destination; //etc
    this.action={}; //datos de accion de la respuesta
    this.condition={}; //datos de condicion de la respuesta
    this.optional=false; //respuesta opcional interesante
  }

  getText(){
    return this.text;
  }

  getDestination(){
    return this.destination;
  }

  /*
    Funcion digna de explicar
    canDo variable que esta diciendo si puede mostrar o no la respuesta

    Dada cada condicion que tiene la respuesta, se evalua esta condicion con los datos del jugador
    Si esta no se cumple, se cambia canDo a false y se retorna directamente este valor (osea falso)

    "condition":{"mapa":">0"}
      --> if(eval(player.data["mapa"]+""+">0") === false)
        --> if(player.data["mapa"]>0 === false)
        
  */
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
