'use strict';
export default
{
  "questions":[
    {"id":"0","text":"Quieres jugar?","answers":[
      {"destination":"1","text":"Si"},
      {"destination":"0","text":"No"}
    ]},
    {"id":"1","text":"Vas caminando por el bosque y encuentras una manzana","answers":[
      {"destination":"2","text":"Agarrar"},
      {"destination":"","text":"Seguir caminando"}
    ]},
    {"id":"2","text":"Que hacer con la manzana?","answers":[
      {"destination":"3","text":"Comer","action":{"hunger":"-10"}},
      {"destination":"12","text":"Guardar","action":{"apple":"+1"}}
    ]},
    {"id":"3","text":"La manzana no parecia muy normal, puede que necesites un medico","answers":[
      {"destination":"4","text":"Ir a la ciudad"},
      {"destination":"5","text":"Seguir caminando"}
    ]},
    {"id":"4","text":"Mueres envenenado"},
    {"id":"5","text":"Te encuentras con una extraña persona","answers":[
      {"destination":"4","text":"Huir"},
      {"destination":"6","text":"Acercarse"}
    ]},
    {"id":"6","text":"Te paras enfrente a esta persona y esta se queda mirandote","answers":[
      {"destination":"7","text":"Saludar"},
      {"destination":"8","text":"Combatir","action":{"sword":"+1"}}
    ]},
    {"id":"7","text":"Mueres asesinado"},
    {"id":"8","text":"Desenfundas tu espada y te preparas para el combate, tu oponente tambien lo hace","answers":[
      {"destination":"7","text":"Guardar Espada"},
      {"destination":"9","text":"Atacar","action":{"kill":"+1"}}
    ]},
    {"id":"9","text":"Logras asesinar a tu oponente pero algo viene por detras","answers":[
      {"destination":"7","text":"Reposicionarse"},
      {"destination":"10","text":"Atacar ciegamente","action":{"kill":"+1"}}
    ]},
    {"id":"10","text":"Asesinas al nuevo oponente, que hacer?","answers":[
      {"destination":"4","text":"Seguir caminando"},
      {"destination":"11","text":"Revisar cuerpo","action":{"money":"+5"}}
    ]},
    {"id":"11","text":"Encuentras un antidoto para veneno y tomas $5 del cuerpo","answers":[
      {"destination":"4","text":"Guardar"},
      {"destination":"12","text":"Tomar"}
    ]},


    {"id":"12","text":"A donde ir","answers":[
      {"destination":"22","text":"Seguir caminando","condition":{"mapa":">0"}},
      {"destination":"13","text":"Ir a la ciudad"},
      {"destination":"21","text":"Seguir caminando"}
    ]},
    {"id":"13","text":"Que quieres hacer en la ciudad?","answers":[
      {"destination":"12","text":"Salir de la ciudad"},
      {"destination":"14","text":"Ir al almacen"}
    ]},
    {"id":"14","text":"Vender o comprar?","answers":[
      {"destination":"16","text":"Vender","condition":{"item":">0"}},
      {"destination":"19","text":"Comprar","condition":{"money":">4"}},
      {"destination":"13","text":"Salir del almacen"}
    ]},
    {"id":"16","text":"Vender manzana","answers":[
      {"destination":"17","text":"Si"},
      {"destination":"12","text":"No"}
    ]},
    {"id":"17","text":"Has ganado $5 por la manzana","answers":[
      {"destination":"12","text":"Salir de la ciudad"},
      {"destination":"14","text":"Ir al almacen"}
    ]},
    {"id":"19","text":"Comprar mapa","answers":[
      {"destination":"20","text":"Si","action":{"mapa":"+1"}},
      {"destination":"12","text":"No"}
    ]},
    {"id":"20","text":"Has comprado un mapa","answers":[
      {"destination":"12","text":"Salir de la ciudad"},
      {"destination":"14","text":"Ir al almacen"}
    ]},

    {"id":"21","text":"Estoy perdido"},
    {"id":"22","text":"Aventurarse","answers":[
      {"destination":"12","text":"No"},
      {"destination":"","text":"Si"}
    ]},
  ]
}
