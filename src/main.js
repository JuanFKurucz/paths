'use strict';
import Game from './Game.js';

window.onload=function(){
  new Game(document.querySelector("#game"),document.querySelector("#backgroundImage"));
};
