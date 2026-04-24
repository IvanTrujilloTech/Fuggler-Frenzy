import objAlfiletero from "../assets/HUD/OBJECTS/ALFILETERO 1.svg";
import objBobina from "../assets/HUD/OBJECTS/BOBINA.svg";
import objCalcetines from "../assets/HUD/OBJECTS/CALCETINES.svg";
import objCanicas from "../assets/HUD/OBJECTS/CANICAS 1.svg";
import objCollar from "../assets/HUD/OBJECTS/COLLAR BOTONES 1.svg";
import objDentadura from "../assets/HUD/OBJECTS/DENTADURA.svg";
import objDIENTE_LECHE from "../assets/HUD/OBJECTS/DIENTE_DE_LECHE.svg";
import objImperdible from "../assets/HUD/OBJECTS/IMPERDIBLE.svg";
import objJabon from "../assets/HUD/OBJECTS/JABON (1) 1.svg";
import objJERSEY from "../assets/HUD/OBJECTS/JERSEY 1.svg";
import objMando from "../assets/HUD/OBJECTS/MANDO 1.svg";
import objPila from "../assets/HUD/OBJECTS/PILA_SULFATADA.svg";
import ombligo from "../assets/HUD/OBJECTS/PELUSA DE OMBLIGO.svg";
import { effect } from "vue";
export const ITEM_COMPONENTS = {
  tooth: {
    id: "tooth",
    img: objDIENTE_LECHE,
    name: "Diente de Leche Suelto",
    description: "+10% Daño de Ataque",
    type: "component",
    lore: "Arrancado a mordiscos de... alguien. Aún tiene algo de sangre seca y huele fatal. Perfecto para clavarlo en los ojos del enemigo.",
  },
  thread: {
    id: "thread",
    img: objBobina,
    name: "Bobina de Hilo Enredado",
    description: "+10% Velocidad de Ataque",
    type: "component",
    lore: "Hilo rebozado en babas. Quien intente desenredarlo acabará perdiendo la cordura y ganando una rabieta.",
  },
  pin: {
    id: "pin",
    img:objImperdible,
    name: "Imperdible Oxidado",
    description: "+100 Puntos de Vida",
    type: "component",
    lore: "Ideal para evitar que se te salgan las tripas de fieltro. Al menos si el tétanos no te mata primero.",
  },
  sock: {
    id: "sock",
    img: objCalcetines,
    name: "Calcetín Desparejado",
    description: "+13% Probabilidad Crítico",
    type: "component",
    lore: "Lleva tres meses debajo de la cama. Está tan crujiente que corta como el cristal.",
  },
  soap: {
    id: "soap",
    img:objJabon, 
    name: "Pastilla de Jabón Gastada",
    description: "+1 Resistencia CC",
    type: "component",
    lore: "¡Agh, está limpia! Produce un asco tremendo que hace que te resbale casi cualquier problema.",
  },
  battery: {
    id: "battery",
    img:objPila,
    name: "Pila Sulfatada",
    description: "+1s Duración CC",
    type: "component",
    lore: "Un líquido extraño sale de ella y te hace vibrar los dientes. Si la chupas a lo mejor te salen superpoderes.",
  },
};

export const ARTIFACT_RECIPES = {
  tooth_tooth: {
    id: "dentadura",
    img: objDentadura,
    name: "Dentadura Postiza Real",
    description: "Cada 3 ataques roba vida máxima.",
    effects: ["lifesteal_proportional"],
    recipe: ["tooth", "tooth"],
    lore: "Robada de la mesita de noche del abuelo de un bocado. Te permite roer almas y alimentarte de su desesperación.",
  },
  sock_thread: {
    id: "jersey_picante",
    img: objJERSEY,
    name: "Jersey de Lana Picante",
    description: "Devuelve 20% del daño (espinas).",
    effects: ["thorns_20"],
    recipe: ["sock", "thread"],
    lore: "Teje un calcetín asqueroso con un hilo baboso y tendrás una prenda tan repulsiva que atacarte provoca asco y dolor.",
  },
  battery_battery: {
    id: "mando_pegajoso",
    img:objMando,
    name: "Mando a Distancia Pegajoso",
    description: "Alerta aturde enemigo aleatorio 3s.",
    effects: ["start_stun_3s"],
    recipe: ["battery", "battery"],
    lore: "Pilas tóxicas potencian este mando cubierto de... mejor no preguntes de qué. Un solo clic fríe los plomos a cualquiera.",
  },
  pin_thread: {
    id: "alfiletero_abuela",
    img: objAlfiletero,
    name: "Alfiletero de la Abuela",
    description: "Al morir explota haciendo daño de área.",
    effects: ["death_explosion"],
    recipe: ["pin", "thread"],
    lore: 'Una bomba casera cosida con mucho rencor. "Si yo muero y me descoso, ¡vosotros os venís conmigo!"',
  },
  tooth_battery: {
    id: "bolsa_canicas",
    img:objCanicas,
    name: "Bolsa de Canicas Tragadas",
    description: "Ataques rebotan en enemigo adicional.",
    effects: ["attack_bounce"],
    recipe: ["tooth", "battery"],
    lore: "Canicas potentes que saben a muela y vibran. Una vez que las escupes, rebotarán rompiendo cráneos a diestro y siniestro.",
  },
  pin_soap: {
    id: "collar_botones",
    img:objCollar,
    name: "Collar de Botones Desalineados",
    description: "Escudo por cada enemigo eliminado.",
    effects: ["shield_on_kill"],
    recipe: ["pin", "soap"],
    lore: "Un jabón atado miserablemente con imperdibles para que resbalen los golpes. Tan cochambroso que da más pena que daño.",
  },
  ombligo_pelusa:{
    id: "ombligo_pelusa",
    img: ombligo,
    name: "Pelusa de Ombligo",
    description: " Es un objeto consumible. Si se lo das a un Fuggler, este gana un nivel de estrella instantáneamente (A -> A+).",
    effects: ["fuggler_level_up"],
    recipe: ["ombligo", "ombligo"],
    lore: "Una bola de pelusa que se forma en el ombligo. Es tan asquerosa que puede hacer evolucionar a un Fuggler con solo tocarlo.",
  }
};

export function combineItems(item1Id, item2Id) {
  const combination1 = `${item1Id}_${item2Id}`;
  const combination2 = `${item2Id}_${item1Id}`;
  
  // Buscar en las recetas por la clave de combinación
  for (const recipe of Object.values(ARTIFACT_RECIPES)) {
    if ((recipe.recipe[0] === item1Id && recipe.recipe[1] === item2Id) ||
        (recipe.recipe[0] === item2Id && recipe.recipe[1] === item1Id)) {
      return recipe;
    }
  }
  
  return ARTIFACT_RECIPES[combination1] || ARTIFACT_RECIPES[combination2] || null;
}
