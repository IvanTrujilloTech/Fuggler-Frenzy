// Definición de tipos
export const FUGGLER_TYPES = {
  D: {
    id: 'D', name: 'Dientudos', color: '#618BB3', breakpoints: [2, 4, 6],
    icon: iconDientudos,
    bonuses: { 2: '+10% Daño', 4: '+25% Daño', 6: '+50% Daño' }
  },
  B: {
    id: 'B', name: 'Botones', color: '#61B361', breakpoints: [3, 5, 6],
    icon: iconBotones,
    bonuses: { 3: '+200 Vida', 5: '+500 Vida', 6: '+1000 Vida' }
  },
  R: {
    id: 'R', name: 'Radioactivos', color: '#FFEC58', breakpoints: [2, 4, 6],
    icon: iconRadioactivos,
    bonuses: { 2: '+10% Veneno', 4: '+30% Veneno', 6: '+70% Veneno' }
  },
  I: {
    id: 'I', name: 'Inadaptados', color: '#AA3B3D', breakpoints: [3, 5, 6],
    icon: iconInadaptados,
    bonuses: { 3: '+15 Armadura', 5: '+40 Armadura', 6: '+100 Armadura' }
  },
  C: {
    id: 'C', name: 'Cazadores', color: '#9261B3', breakpoints: [2, 4, 6],
    icon: iconCazadores,
    bonuses: { 2: '+15% Crit', 4: '+40% Crit', 6: '+80% Crit' }
  }
};
import TANQUE from '../assets/HUD/CATEGORIES/TANQUE.png';
import ASESINO from '../assets/HUD/CATEGORIES/ASESINO.png';
import LUCHADOR from '../assets/HUD/CATEGORIES/LUCHADOR.png';
import HOSTIGADOR from '../assets/HUD/CATEGORIES/HOSTIGADOR.png';
// utilidad para crear estadisticas base segun el tier
// ROLES de los Fugglers
export const FUGGLER_ROLES = {
  TANQUE: { name: 'Tanque', color: '#618BB3', img: TANQUE },
  ASESINO: { name: 'Asesino', color: '#AA3B3D', img: ASESINO },
  LUCHADOR: { name: 'Luchador', color: '#61B361', img: LUCHADOR },
  HOSTIGADOR: { name: 'Hostigador', color: '#FFEC58', img: HOSTIGADOR }
};

// Utilidades para definir estadisticas base por rol y tier
const getStatsByRole = (role, tier) => {
  const multipliers = { 1: 1, 2: 1.4, 3: 2.0, 4: 3.0 };
  const mult = multipliers[tier] || 1;

  switch (role) {
    case 'TANQUE':
      return {
        hp: Math.round(700 * mult),
        damage: Math.round(35 * mult),
        attackSpeed: 0.8,
        armor: Math.round(30 + (tier * 10)),
        scaling: { hp: 2.2, damage: 1.4, armor: 15 }
      };
    case 'ASESINO':
      return {
        hp: Math.round(400 * mult),
        damage: Math.round(65 * mult),
        attackSpeed: 1.25,
        armor: Math.round(10 + (tier * 5)),
        scaling: { hp: 1.4, damage: 2.5, armor: 5 }
      };
    case 'LUCHADOR':
      return {
        hp: Math.round(550 * mult),
        damage: Math.round(50 * mult),
        attackSpeed: 1.0,
        armor: Math.round(20 + (tier * 5)),
        scaling: { hp: 1.8, damage: 1.8, armor: 8 }
      };
    case 'HOSTIGADOR':
      return {
        hp: Math.round(480 * mult),
        damage: Math.round(58 * mult),
        attackSpeed: 1.15,
        armor: Math.round(15 + (tier * 5)),
        scaling: { hp: 1.6, damage: 2.2, armor: 5 }
      };
    default:
      return { hp: 500, damage: 50, attackSpeed: 1, armor: 20, scaling: { hp: 1.8, damage: 1.8 } };
  }
};

const createFuggler = (id, name, types, tier, cost, role, image = null, customStats = {}) => {
  const baseStats = getStatsByRole(role, tier);
  return {
    id,
    name,
    types,
    tier,
    cost,
    role,
    stats: { ...baseStats, ...customStats }, // Permite pisar valores especificos si queremos
    image
  };
};

import imgAwelaBotones from '../assets/units/AwelaBotones.png';
import imgGaptoothMcgoo from '../assets/units/GaptoothMcgoo.png';
import imgGranSaqueador from '../assets/units/GranSaqueador.png';
import imgIbai from '../assets/units/Ibai.png';
import imgIndecisiveMonster from '../assets/units/IndecisiveMonster.png';
import imgLudopatia from '../assets/units/Ludopatia.png';
import imgMcNugget from '../assets/units/McNugget.png';
import imgMordisquitosFelpa from '../assets/units/MordisquitosFelpa.png';
import imgMunchMunch from '../assets/units/MunchMunch.png';
import imgMierdon from '../assets/units/mierdon.png';
import imgOldTooth from '../assets/units/OldTooth.png';
import imgPatriarcaColmillo from '../assets/units/PatriarcaColmillo.png';
import imgResiduo0 from '../assets/units/Residuo0.png';
import imgReyDeLasCajas from '../assets/units/ReyDeLasCajas.png';
import imgSasquoosh from '../assets/units/Sasquoosh.png';
import imgSirSplodge from '../assets/units/SirSplodge.png';
import imgSquidge from '../assets/units/Squidge.png';
import imgVagabundo from '../assets/units/Vagabundo.png';
import imgatomicfuggler from '../assets/units/atomicfuggler.png';
import imgburundanga from '../assets/units/burundanga.png';
import imgcalamardo from '../assets/units/calamardo.png';
import imgcalsotetes from '../assets/units/calsotetes.png';
import imgcesped from '../assets/units/cesped.png';
import imgcharcaCharquez from '../assets/units/charcaCharquez.png';
import imgcheto from '../assets/units/cheto.png';
import imggenzqueen from '../assets/units/gen z queen.png';
import imggoldidgger from '../assets/units/goldidgger.png';
import imgjulio from '../assets/units/julio.png';
import imgknight from '../assets/units/knight.png';
import imgkosovo from '../assets/units/kosovo.png';
import imglacobra from '../assets/units/lacobra.png';
import imglanadelrey from '../assets/units/lanadelrey.png';
import imglorena from '../assets/units/lorena.png';
import imglorna from '../assets/units/lorna.png';
import imgmanuela from '../assets/units/manuela.png';
import imgmarsupial from '../assets/units/marsupial.png';
import imgmelinda_gordon from '../assets/units/melinda_gordon.png';
import imgoctavio from '../assets/units/octavio.png';
import imgpepins from '../assets/units/pepins.png';
import imgpetitsuisse from '../assets/units/petitsuisse.png';
import imgpunchline from '../assets/units/punchline.png';
import imgrallita from '../assets/units/rallita.png';
import iconDientudos from '../assets/HUD/SINERGYS/DIENTUDOS.svg';
import iconBotones from '../assets/HUD/SINERGYS/BOTONES.svg';
import iconRadioactivos from '../assets/HUD/SINERGYS/RADIOACTIVOS.svg';
import iconInadaptados from '../assets/HUD/SINERGYS/INADAPTADOS.svg';
import iconCazadores from '../assets/HUD/SINERGYS/CAZADORES.svg';

export const FUGGLERS = [
  // 10 comunes (coste 1)
  createFuggler('c1', 'Mordisquitos de Felpa', ['D', 'B'], 1, 1, 'LUCHADOR', imgMordisquitosFelpa),
  createFuggler('c2', 'Old Tooth', ['D', 'R'], 1, 1, 'HOSTIGADOR', imgOldTooth),
  createFuggler('c3', 'Gaptooth Mcgoo', ['D', 'I'], 1, 1, 'TANQUE', imgGaptoothMcgoo),
  createFuggler('c4', 'Munch Munch', ['D', 'C'], 1, 1, 'ASESINO', imgMunchMunch),
  createFuggler('c5', 'Sasquoosh', ['B', 'R'], 1, 1, 'TANQUE', imgSasquoosh),
  createFuggler('c6', 'Sir Splodge-a-lot', ['B', 'I'], 1, 1, 'TANQUE', imgSirSplodge),
  createFuggler('c7', 'Indecisive Monster', ['B', 'C'], 1, 1, 'LUCHADOR', imgIndecisiveMonster),
  createFuggler('c8', 'Squidge', ['R', 'I'], 1, 1, 'HOSTIGADOR', imgSquidge),
  createFuggler('c9', 'Mierdón', ['R', 'C'], 1, 1, 'ASESINO', imgMierdon),
  createFuggler('c10', 'Vagabundo de Almacén', ['I', 'C'], 1, 1, 'LUCHADOR', imgVagabundo),

  // 15 raros (coste 2)
  createFuggler('r1', 'Ibai', ['D', 'B'], 2, 2, 'TANQUE', imgIbai, { hp: 1200 }),
  // Corregido para que customStats se mezcle bien
  createFuggler('r2', 'Ludopatia', ['D', 'R'], 2, 2, 'HOSTIGADOR', imgLudopatia),
  createFuggler('r3', 'McNugget', ['D', 'I'], 2, 2, 'LUCHADOR', imgMcNugget),
  createFuggler('r4', 'Atomic Fuggler', ['D', 'C'], 2, 2, 'ASESINO', imgatomicfuggler),
  createFuggler('r5', 'Burundanga', ['B', 'R'], 2, 2, 'HOSTIGADOR', imgburundanga),
  createFuggler('r6', 'Calamardo', ['B', 'I'], 2, 2, 'LUCHADOR', imgcalamardo),
  createFuggler('r7', 'Calsotetes', ['B', 'C'], 2, 2, 'ASESINO', imgcalsotetes),
  createFuggler('r8', 'Cesped', ['R', 'I'], 2, 2, 'TANQUE', imgcesped),
  createFuggler('r9', 'Charca Charquez', ['R', 'C'], 2, 2, 'LUCHADOR', imgcharcaCharquez),
  createFuggler('r10', 'Cheto', ['I', 'C'], 2, 2, 'ASESINO', imgcheto),
  createFuggler('r11', 'Gen Z Queen', ['D', 'B'], 2, 2, 'HOSTIGADOR', imggenzqueen),
  createFuggler('r12', 'Gold Digger', ['D', 'R'], 2, 2, 'ASESINO', imggoldidgger),
  createFuggler('r13', 'Julio', ['D', 'I'], 2, 2, 'LUCHADOR', imgjulio),
  createFuggler('r14', 'Knight', ['D', 'C'], 2, 2, 'TANQUE', imgknight),
  createFuggler('r15', 'Kosovo', ['B', 'R'], 2, 2, 'HOSTIGADOR', imgkosovo),

  // 12 epicos (coste 4)
  createFuggler('e1', 'La Cobra', ['D', 'B'], 3, 4, 'ASESINO', imglacobra),
  createFuggler('e2', 'Lana Del Rey', ['D', 'R'], 3, 4, 'HOSTIGADOR', imglanadelrey),
  createFuggler('e3', 'Lorena', ['D', 'I'], 3, 4, 'LUCHADOR', imglorena),
  createFuggler('e4', 'Lorna', ['D', 'C'], 3, 4, 'ASESINO', imglorna),
  createFuggler('e5', 'Manuela', ['B', 'R'], 3, 4, 'TANQUE', imgmanuela),
  createFuggler('e6', 'Marsupial', ['B', 'I'], 3, 4, 'HOSTIGADOR', imgmarsupial),
  createFuggler('e7', 'Melinda Gordon', ['B', 'C'], 3, 4, 'LUCHADOR', imgmelinda_gordon),
  createFuggler('e8', 'Octavio', ['R', 'I'], 3, 4, 'TANQUE', imgoctavio),
  createFuggler('e9', 'Pepins', ['R', 'C'], 3, 4, 'ASESINO', imgpepins),
  createFuggler('e10', 'Petit Suisse', ['I', 'C'], 3, 4, 'LUCHADOR', imgpetitsuisse),
  createFuggler('e11', 'Punchline', ['B', 'I'], 3, 4, 'HOSTIGADOR', imgpunchline),
  createFuggler('e12', 'Rallita', ['B', 'C'], 3, 4, 'ASESINO', imgrallita),

  // 5 legendarios (coste 5)
  createFuggler('l1', 'El Patriarca Colmillo', ['D'], 4, 5, 'LUCHADOR', imgPatriarcaColmillo),
  createFuggler('l2', 'La Abuela de los Botones', ['B'], 4, 5, 'TANQUE', imgAwelaBotones),
  createFuggler('l3', 'El Residuo 0', ['R'], 4, 5, 'HOSTIGADOR', imgResiduo0),
  createFuggler('l4', 'El Rey de las Cajas', ['I'], 4, 5, 'TANQUE', imgReyDeLasCajas),
  createFuggler('l5', 'El Gran Saqueador', ['C'], 4, 5, 'ASESINO', imgGranSaqueador),
];

// calcula la probabilidad de aparicion por tier segun la ronda (ajustable)
export function getShopProbabilities(round) {
  if (round < 3) return { 1: 100, 2: 0, 3: 0, 4: 0 };
  if (round < 6) return { 1: 75, 2: 25, 3: 0, 4: 0 };
  if (round < 9) return { 1: 50, 2: 35, 3: 15, 4: 0 };
  return { 1: 30, 2: 40, 3: 25, 4: 5 }; // rondas avanzadas
}
import objAlfiletero from '../assets/HUD/OBJECTS/ALFILETERO 1.svg';
import objBobina from '../assets/HUD/OBJECTS/BOBINA.svg';
import objCalcetines from '../assets/HUD/OBJECTS/CALCETINES.svg';
import objCanicas from '../assets/HUD/OBJECTS/CANICAS 1.svg';
import objCollar from '../assets/HUD/OBJECTS/COLLAR BOTONES 1.svg';
import objDentadura from '../assets/HUD/OBJECTS/DENTADURA.svg';
import objDIENTE_LECHE from '../assets/HUD/OBJECTS/DIENTE_DE_LECHE.svg';
import objImperdible from '../assets/HUD/OBJECTS/IMPERDIBLE.svg';
import objJabon from '../assets/HUD/OBJECTS/JABON (1) 1.svg';
import objJERSEY from '../assets/HUD/OBJECTS/JERSEY 1.svg';
import objMando from '../assets/HUD/OBJECTS/MANDO 1.svg';
import objPila from '../assets/HUD/OBJECTS/PILA_SULFATADA.svg';

export const OBJECTS = {
  'PILA SULFATADA': {
    'img': objPila,
    'enunciado': 'Aumenta tiempo de stun o ceguera en +1 segundo.',

  },
  'PASTILLA DE JABON GASTADA': {
    'img': objJabon,
    'enunciado': 'Aumenta la resistencia a stun o ceguera en -1 segundo',

  },
  'CALCETIN DESPAREJO': {
    'img': objCalcetines,
    'enunciado': 'Aumenta la probabilidad de crítico en 13%',
  },
  'IMPERDIBLE OXIDADO': {
    'img': objImperdible,
    'enunciado': 'Otorga 100 puntos de vida..'
  },
  'BOBINA DE HILO ENREDADO': {
    'img': objBobina,
    'enunciado': 'Aumenta la velocidad de ataque en un 10%'
  },
  'DIENTE DE LECHE SUELTO': {
    'img': objDIENTE_LECHE,
    'enunciado': 'Aumenta daño de ataque en 10%'
  },
}
export const ARTEFACTOS = {
  'DENTADURA POSTIZA REAL': {
    'receta': {
      'obj1': 'DIENTE',
      'obj2': 'DIENTE',
    },
    'enunciado': 'Cada 3 ataques, el fuggler arranca un trozo de vida máxima al enemigo y se suma a la suya.'
  },
  'JERSEY DE LANA PICANTE': {
    'receta': {
      'obj1': 'CALCETIN',
      'obj2': 'HILO'
    },
    'enunciado': 'El Fuggler se vuelve tan "incómodo" que devuelve el 20% del daño recibido a los atacantes (espinas).'
  },
  'MANGO A DISTANCIA PEGAJOSA': {
    'receta': {
      'obj1': 'PILA',
      'obj2': 'PILA'
    },
    'enunciado': 'Al inicio del combate, aturde a un enemigo aleatorio durante 3 segundos.'
  },
  'ALFILETERO DE LA ABUELA': {
    'receta': {
      'obj1': 'IMPERDIBLE',
      'obj2': 'HILO',
    },
    'enunciado': 'Al morir, el Fuggler explota y hace daño en area.'
  },
  'BOLSA DE CANICAS TRAGADAS': {
    'receta': {
      'obj1': 'DIENTE',
      'obj2': 'PILA'
    },
    'enunciado': 'Los ataques básicos rebotan en un enemigo adicional cercano.'
  },
  'COLLAR DE CANICAS TRAGADAS': {
    'receta': {
      'obj1': 'IMPERDIBLE',
      'obj2': 'JABON'
    },
    'enunciado': 'El Fuggler gana un escudo por cada Fuggler enemigo eliminado.'
  },
  costScale: {
    1: 1,
    2: 3,
    3: 6,
    4: 9
  }
}
