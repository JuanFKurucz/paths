'use strict';

/*
* Main del proyecto
* En este archivo se inicia el proyecto. Se carga la clase "Game" del archivo "Game.js" y se -instancia- un nuevo objeto de la clase
* a esta clase se le pasa como atributos el contenedor canvas del juego y una imagen precargada para cargarla en el juego.
* Contendor canvas = document.querySelector("#game")
* Imagen precargada = document.querySelector("#backgroundImage")
* Los podes ver en el index.html
*/

import Game from './Game.js';

window.onload=function(){
  //Al cargar el sitio completamente
  new Game(document.querySelector("#game"),document.querySelector("#backgroundImage"));
};
