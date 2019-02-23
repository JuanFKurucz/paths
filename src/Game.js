'use strict';

/*
* Game.js
* Este archivo y su clase son el controlador principal del juego, por aca pasa toda la logica...(es el main real :v.)
* A su vez este archivo actua como un simulador de un grafo. Es basicamente un grafo con mas funciones.
* Este juego necesita una serie de clases adicionales que tenemos que importar para su posterior uso que son las siguientes:
*/
import Player from './Player.js'; //Clase del jugador
import Question from './Question.js'; //Clase de la pregunta (Simula un un nodo en un grafo)
import Answer from './Answer.js'; //Clase de la respuesta (Simula una adyacencia en un grafo)
import Coordinate from './Coordinate.js'; //Una clase para poder extraer y pasar coordenadas facilmente (x,y)
import Data from './Data.js'; //Todas las preguntas y caminos del juego

/*
* La clase Game va a intentar simular lo que se llama singleton en la programacion orientada a objetos
* una clase singleton es basicamente una clase que solo tiene una instancia, en realidad no podrias crear mas de una.
* esta implementacion es medio precaria podes crear varias pero la variable gameObject siempre va a ser la ultima creada.
*/

let gameObject = null; // Objeto instanciado de la clase Game

export default class Game {

  /*
  * Funcion estatica de la clase que devuelve el atributo path del juego actual
  * es usada para revelar en el index.html el arbol de decisiones del usuario
  * Game.getPath() para su uso ya que es una funcion de clase por ser static
  */
  static getPath(){
     return gameObject.path;
  }

  /*
  * Constructor de la clase, parametros canvas e imagen de fondo como se vio que se le pasaban en el main.js
  * Se inicia el objeto Game
  */
  constructor(canvas,background){
    //Guardamos ambos contenedores en atributos para su uso posterior
    this.canvas = canvas;
    this.background = background;

    //Se inicializa el context del canvas, ctx = context, esto es para dibujar en el elemento de la web.
    this.ctx = this.canvas.getContext("2d");

    //Se guardan los datos de largo y ancho del canvas para saber la dimension del juego.
    this.width = parseFloat(this.canvas.getAttribute("width"));
    this.height = parseFloat(this.canvas.getAttribute("height"));

    //Se obtiene la coordenada del medio del juego.
    let mid = {
      x:parseInt(this.width/2),
      y:parseInt(this.height/2)
    };

    //Se configura la posicion en la que las preguntas deberian aparecer
    Question.setPosition(new Coordinate(mid.x,mid.y-100));
    //Se configura la posicion en la que las respuestas deberian aparecer
    Question.setAnswerPosition(
      new Coordinate(mid.x-175,this.height-20),
      new Coordinate(mid.x+175,this.height-20)
    );

    this.already=[]; //Es una especie de path, profundizare luego, es como el camino que ya recorriste.
    this.questions={}; //preguntas del juego, basicamente un diccionario de nodos del juego
    this.player = new Player(new Coordinate(mid.x,mid.y)); //Se inicia el jugador con la coordenada del medio

    this.path=[]; //El camino actual del jugador
    this.loadGame(); //Se carga el grafo del juego, todas las preguntas y sus respuestas

    this.play(); //Se inicia el dibujado por frames
    this.eventHandlers();  //Se inicia el control de eventos del jugador (movimientos, teclas, etc cualquier input).
    gameObject = this; //Se guarda el objeto de game actual en la variable global gameObject
  }

  /*
  * loadGame
  * Funcion que carga el grafo del juego, utiliza el archivo data.js con el listado de preguntas y respuestas
  * y crea objetos Question con sus respuestas. A su vez inicia el visualizador de camino del index
  */
  loadGame(){
    const questions = Data.questions, //Diccionario de preguntas de data.js
          questionsLength = questions.length;

    for(let q=0;q<questionsLength;q++){
      /*
      * Se itera por cada pregunta
      * Cada pregunta esta compuesta por un atributo "id", otro "text" y un array de respuestas llamado "answers"
      * El atributo id es unico y es un int
      * El atributo text es el texto de la pregunta y es un string
      * El array de respuestas esta compuesto por una lista de diccionarios con atributos "destination" y "text"
      *   Siendo "text" el texto de la respuesta
      *   Y "destination" la id de la pregunta a la cual esta respuesta salta
      *   Algunas respuestas tienen una propiedad llamada "action" que modifica un diccionario de atributos del jugador
      *   Y otras tienen un atributo llamado "condition" que hacen que se muestre o no la respuesta dependiendo de la condicion
      *
      * A continuacion es simplemente la carga de todos estos datos, sinceramente no hay mucho que explicar
      * Son llamados a constructores de clases y futuras funciones de clases que vamos a ver.
      *
      * Hay metodos de JavaScript que seguramente no sepas tipo hasOwnProperty, este metodo se le aplica a objetos
      * si el objeto tiene una propiedad q le pasas devuelve verdadero, basicamente estos diccionarios son objetos,
      * y es como preguntar si tienen la clave, es decir si question tiene answers, y si cada answer tiene action, o condition
      * dado que estos atributos son opcionales uno se ve forzado a preguntar si existen.
      *  SI UNA PREGUNTA PUEDE NO TENER RESPUESTA <3.


      Es como acumular la información, guardar. mm Sí, entiendo plenamente eso ^.^

      Claro, vos tenes un super archivo con toda la info ("Data.js") tirada en cosas extrañas, aca lo estamos transformando a objetos
      para poder manipularlo facilmente, y estamos haciendo que todos estos objetos esten vinculados entre si realmente.
      */
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

    let $debug = document.querySelector("#debuggGraph"); //$debug es el contenedor donde se visualiza el camino actual
    this.currentQuestion = this.questions["0"]; //Se declara la pregunta actual como la pregunta con id 0
    this.currentQuestion.visited=true; //Se declara esta pregunta como visitada
    this.path.push(this.currentQuestion); //Se pone en el camino actual esta pregunta
    this.createTableTree($debug,this.currentQuestion); //Se genera la vista del visualizador de caminos
  }

  /*
  * Funcion auxiliar de createTableTree
  * Cuando la respuesta de una pregunta es otra pregunta ya creada en el visualizador, en vez de recrear la pregunta
  * se escribe un texto que dice que redirecciona a la pregunta id
  * Parametro parent es el bloque contenedor donde se escribe la nueva pregunta
  * Parametro id es la id de la pregunta a la cual redirecciona
  */
  appendRedirect(parent,id){

    const br = document.createElement("br");
    parent.appendChild(br);
    const italic = document.createElement("i");
    italic.textContent="Redirects to question "+id;
    parent.appendChild(italic);
  }

  /*
  * Funcion que crea la tabla visualizadora de caminos hechos
  * Parametro parent es el bloque donde se crea la tabla
  Esta funcion lo que hace es generar una tabla del estilo:
    |PREGUNTA|
    |R1|R2|R.|
  Inicialmente las respuestas se cargan segun las puedas ver
  Ahora, esta misma funcion ademas de ser usada para generar la tabla inicial es usada
  par generar subtablas.
  Cada respuesta genera una tabla nueva cuando uno entra en esa respuesta.

  Por ende el parametro question es la pregunta a la que se entro y el parent
  es el bloque donde se crea la tabla, siendo este el container inicial como un container de respuesta

  <table style="width: 100%;"> //tabla inicial
     <tr>
        <td colspan="2">0 - Quieres jugar?</td> //pregunta inicial
     </tr>
     <tr>
        <td id="question-0-answer-0">
           Si //respuesta inicial 1
           <table style="width: 100%;"> //se entro a la respuesta 1 se creo una tabla nueva
              <tr>
                 <td colspan="2">1 - Vas caminando por el bosque y encuentras una manzana</td> //pregunta 1
              </tr>
              <tr>
                 <td id="question-1-answer-0">
                    Agarrar //respuesta 1 de pregunta 1
                    <table style="width: 100%;"> //se entro a la respuesta 1 de la pregunta 1
                       <tr>
                          <td colspan="2">2 - Que hacer con la manzana?</td> //pregunta 2
                       </tr>
                       <tr>
                          <td id="question-2-answer-0">Comer</td> //respuesta 1 pregunta 2
                          <td id="question-2-answer-1">Guardar</td> //respuesta 2 pregunta 2
                       </tr>
                    </table>
                 </td>
                 <td id="question-1-answer-1">Seguir caminando</td> //respuesta 2 de pregunta 1
              </tr>
           </table>
        </td>
        <td id="question-0-answer-1">No</td> //respuesta inicial 2
     </tr>
  </table>

  Esto es literalmente lo que genera, si vez el codigo mas abajo vas a ver q esta creando table, tr, td
  es lo que ves ahi arriba
  */
  createTableTree(parent,question){
    this.already.push(question.id); //se agrega a la lista already la pregunta como ya explorada (already es un path global en todas las vidas)

    //se crea la tabla
    const table = document.createElement("table");
    table.style="width:100%";
    parent.appendChild(table);
    const trMain = document.createElement("tr");
    table.appendChild(trMain);

    //Se crea el campo para la pregunta
    const tdQuestion = document.createElement("td");
    tdQuestion.textContent = question.id+" - "+question.title;
    tdQuestion.setAttribute("colspan",question.answers.length);
    trMain.appendChild(tdQuestion);
    const trAnswer = document.createElement("tr");
    table.appendChild(trAnswer);

    //Se crean los campos para las respuestas que se ven
    let answersLength = question.answers.length;
    for(let a=0;a<answersLength;a++){
      if(question.answers[a].canShow(this.player)){ //funcion canShow nos devuelve si el jugador puede o no ver la respuesta
        const tdAnswer1 = document.createElement("td");
        tdAnswer1.textContent = question.answers[a].text;
        tdAnswer1.id="question-"+question.id+"-answer-"+a;
        trAnswer.appendChild(tdAnswer1);
      }
    }
    return table;
  }

  /*
  * Funcion que dibuja el fondo del juego, con la imagen de fondo
  */
  draw(ctx){
    ctx.drawImage(this.background, 0, 0);
  }

  /*
  * Funcion que realiza todos los dibujados del juego en orden
  * Primero se dibuja el fondo
  * Despues el jugador
  * Despues la pregunta y sus respuestas
  * Y despues se espera al siguiente frame para dibujar devuelta.
  */
  play(){
    this.draw(this.ctx);
    this.player.draw(this.ctx);
    this.currentQuestion.draw(this.ctx,this.player);
    requestAnimationFrame((timestamp) => {
        this.play();
    });
  }

  /*
  * Funcion que cambia de pregunta, salta de una pregunta a otra dependiendo la posicion del jugador y la respuesta
  */
  changeQuestion(){ //----Profundizar (yo)-----
    const answer = this.currentQuestion.chooseAnswer(this.player); //devuelve la respuesta de la posicion actual del jugador segun la pregunta actual
    if(answer&&answer!==null){ //Si en la posicion actual del jugador existe una respuesta
      const newQuestion = this.questions[answer.getDestination()]; //Se consigue la pregunta del destino de la respuesta
      if(newQuestion && newQuestion !== null){ //Si esta pregunta existe
        this.player.resetPosition(); //Se mueve al jugador al medio
        this.player.act(answer.action); //Se hacen las acciones de la respuesta
        this.currentQuestion=newQuestion; //Se cambia la pregunta actual a la nueva pregunta
        this.currentQuestion.visited=true; //Se marca la pregunta actual como visitada (la nueva pregunta)

        //Si la persona volvio al inicio se reseta el camino hecho, si no se agrega al camino la nueva pregunta
        if(newQuestion.id == "0"){
          this.path=[];
        } else {
          this.path.push(this.currentQuestion);
        }

        //Se obtiene el contenedor de la respuesta accionada
        const tdAnswer = document.querySelector("#question-"+answer.source+"-answer-"+answer.position);
        if(this.already.indexOf(answer.destination)===-1){ //Si la pregunta nueva no fue visitada anteriormente
          if(tdAnswer && tdAnswer != null){ //Si el bloque de la respuesta existe
            //se le agrega a este bloque la nueva tabla de la pregunta nueva, aca es donde pasa esa cosa rara
            tdAnswer.appendChild(this.createTableTree(tdAnswer,this.currentQuestion));
          }
        } else if(tdAnswer.getElementsByTagName("table").length===0 && tdAnswer.getElementsByTagName("i").length===0) {
          /*
          * basicamente si la pregunta ya fue visitada se agrega la redireccion
          * Esta preguntando si no existe una tabla adentro de la respuesta y si no existe un tag i q es italic
          * Basicamente esta preguntando si no es la primera respuesta q visitaste donde entro esa pregunta, y si no esta escrita ya la redireccion
          * Las redirecciones se escriben en tags <i> y cada pregunta es una tabla por ende si la respuesta tiene una tabla es la original
          */
          this.appendRedirect(tdAnswer,answer.destination);
        }
      }
    }
  }

  /*
  * Funcion que responde a los input del usuario
  */
  eventHandlers(){
    document.addEventListener('keydown', (event) => { //al presionar una tecla, (al bajar una tecla)
      const code = event.keyCode; //codigo ascii de la tecla
      switch(code){
        case 65: //a
        case 37: //flecha izq
          this.player.move("left",this.ctx);
          break;
        case 68: //d
        case 39: //felcha derecha
          this.player.move("right",this.ctx);
          break;
        case 87: //w
        case 38: //felcha arriba
          this.player.move("up",this.ctx);
          break;
        case 83: //s
        case 40: //felcha abajo
          this.player.move("down",this.ctx);
          break;
        case 32: //espacio
          //al tocar espacio se "reinicia" el juego sin perder el progreso de los caminos visualizados
          this.player.resetPosition();
          this.currentQuestion=this.questions["0"];
          break;
      }
      this.changeQuestion(); //Cada vez que se toca una tecla se ejecuta la funcion de cambiarPregunta
      //Esto se hace ya que cada vez que se toca una tecla o se reinicia el juego o el jugador se mueve
      //Por ende es probable que la pregunta tenga q cambiarse.
    });
  }

}
