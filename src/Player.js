'use strict';

/*
* Clase del jugador
*/

import Coordinate from './Coordinate.js';

export default class Player {

  constructor(cord){
    this.width=50; //largo del jugador
    this.height=50; //altura del jugador
    this.initialCord = new Coordinate(parseInt(cord.x-this.width/2),parseInt(cord.y-this.height/2)); //coordenada inicial (medio)
    this.cord = new Coordinate(this.initialCord.x,this.initialCord.y); //cordenada actual
    this.color="#000000"; //color bello con el cual se pinta
    this.speed=15; //velocidad de movimiento
    this.data={ //diccionario de acumuladores (actions de answers)
      "money":0,
    }
  }

  /*
    Funcion que mueve al jugador a su posicion inicial (medio)
  */
  resetPosition(){
    this.cord.copy(this.initialCord);
  }

  /*
    Dibuja al jugador
  */
  draw(ctx){
    ctx.fillStyle = this.color;
    ctx.fillRect(this.cord.x, this.cord.y, this.width, this.height);
  }

  /*
    Funcion que comprueba la colision con los bordes del fondo, el jugador solo puede moverse en el espacio blanco
    del juego.

    Parametro vertexes: vertices a comprobar si colisionan con un borde
  */
  checkCollision(vertexes,ctx){
    const bg = [255,255,255]; //rgb del blanco
    for(let v in vertexes){ //para cada vertices dados
      let pixelData = ctx.getImageData(vertexes[v][0], vertexes[v][1], 1, 1).data; //se obtiene el color rgba del pixel del vertice dado
      //se comparan que todos los pxieles no sean blanco
      //es medio mala esta comparacion pero como el juego es solo blanco y negro funciona
      for(let b in bg){
        if(bg[b]!==pixelData[b]){
          //es porque donde detecte un r 255 o g 255 o b 255 es colision, deberia chequear con and los 3.
          //por ende no podes poner rojos, ni verdes, ni azules pures porque colisiona, solo camina en blanco puro
          return true;
        }
      }
    }
    return false;
  }

  /*
    Funcion que retorna

    Esta funcion retorna la posicion del jugador logicamente,
    Si el jugador esta en la mitad de arriba no esta en ningun area de respuestas por ende retorna 0
    Si no,
      si el jugador esta a la izquierda de su posicion inicial esta en la respuesta de la izquierda por ende -1
      y si no 1 porque esta a la derecha
    eso
    Resumidamente te dice cual respuesta agarro

  * Retorna 0  si no
  * Retorna 1 si es la respuesta derecha
  * Retorna -1 si es la respuesta izquierda
  */
  inAnswerZone(){
    if(this.cord.y>this.initialCord.y*2-this.width){
      if(this.cord.x<=this.initialCord.x){
        return -1;
      }
      return 1;
    }
    return 0;
  }

  /*
  * Funcion que gestiona el movimiento del jugador

    Parametro direction: direccion del input dado por el jugador
  */
  move(direction,ctx,speed=null){
    //Si se le asigna un valor a speed tomara esta velocidad y no la del jugador
    if(speed == null){
      speed=this.speed; //Si no se asigna nada al parametr speed se tomara la velocidad del jugador
    }

    let newX=this.cord.x, //se inician las coordenadas del jugador
        newY=this.cord.y;

    let collision=true; //se supone q esta en colision xq lo malo es siempre verdadero

    /*
    * Pequeño detalle:
      JavaScript y el ctx dibujan las coordenadas de forma rara
      La X incrementa normal, de izq a derecha siendo 0,1,2,3,4 etc
      La Y incrementa para abajo,
      La coordenada 0,0 esta arriba a la izquierda

      Por ende para subir restas Y, y para bajar aumentas Y
      Para la izquierda restas X y para la derecha aumentas X
    */

    /*
      Vertices del jugador

         1_______2
         |      |
        |______|
       3       4
    1 = newX,newY
    2 = newX+this.width,newY
    3 = newX,newY+this.height
    4 = newX+this.width,newY+this.height
    */

    //Para cada direccion se obtiene la nueva coordenada afectada y se chequea si esta en colision
    switch(direction){
      case "up":
        /*
        * Si el movimiento es hacia arriba, la Y se decrementa
        * Los vertices que pueden colisionar en este movimiento son los dos vertices de arriba
        */
        newY-=speed;
        collision=this.checkCollision([[newX,newY],[newX+this.width,newY]],ctx);
        break;
      case "down":
        /*
        * Si el movimiento es hacia abajo, la Y se incrementa
        * Los vertices que pueden colisionar en este movimiento son los dos vertices de abajo
        */
        newY+=speed;
        collision=this.checkCollision([[newX,newY+this.height],[newX+this.width,newY+this.height]],ctx);
        break;
      case "left":
        /*
        * Si el movimiento es hacia la izquierda, la X se decrementa
        * Los vertices que pueden colisionar en este movimiento son los dos de la izquierda
        */
        newX-=speed;
        collision=this.checkCollision([[newX,newY],[newX,newY+this.height]],ctx);
        break;
      case "right":
        /*
        * Si el movimiento es hacia la izquierda, la X se incrementa
        * Los vertices que pueden colisionar en este movimiento son los dos de la derecha
        */
        newX+=speed;
        collision=this.checkCollision([[newX+this.width,newY],[newX+this.width,newY+this.height]],ctx);
        break;
    }
    if(collision===false){
      //si no existe colision se mueve al jugador a las nuevas coordenadas
      this.cord.x=newX;
      this.cord.y=newY;
    } else if(speed>0) {
      //si no, y la velocidad es mayor q 0, se intenta mover al jugador a una velocidad mas pequeña
      //a las nuevas coordenadas, esto es para acercar al jugador al borde lo mas posible y prevenir que haya
      //un espacio blanco entre el borde y el jugador debido a la velocidad
      this.move(direction,ctx,speed-1);
    }
  }

  /*
  * Funcion que modifica una accion del jugador, es decir un apropiedad de sus acumuladores
  * no se pueden tener acumuladores negativos

  Ejemplo de parametro action --> "action":{"mapa":"+1"}
  */
  act(action){
    if(action !== null){
      for(let key in action){
        if(!this.data.hasOwnProperty(key)){
          this.data[key]=0;
        }
        this.data[key]+=parseInt(action[key]);
        if(this.data[key]<0){
          this.data[key]=0;
        }
      }
    }
  }
}
