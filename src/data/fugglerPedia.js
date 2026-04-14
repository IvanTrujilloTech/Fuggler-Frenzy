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

// utilidad para crear estadisticas base segun el tier
const baseStats = (tier) => {
  switch (tier) {
    case 1: return { hp: 500, damage: 50, attackSpeed: 1.0, armor: 20 };
    case 2: return { hp: 700, damage: 70, attackSpeed: 1.05, armor: 25 };
    case 3: return { hp: 1000, damage: 100, attackSpeed: 1.1, armor: 30 };
    case 4: return { hp: 1500, damage: 150, attackSpeed: 1.2, armor: 40 };
    default: return { hp: 500, damage: 50, attackSpeed: 1.0, armor: 20 };
  }
};

const createFuggler = (id, name, types, tier, cost, image = null) => ({
  id,
  name,
  types,
  tier,
  cost,
  stats: baseStats(tier),
  image
});

import imgAwelaBotones from '../assets/units/AwelaBotones.png';
import imgGaptoothMcgoo from '../assets/units/GaptoothMcgoo.png';
import imgGranSaqueador from '../assets/units/GranSaqueador.png';
import imgIbai from '../assets/units/Ibai.png';
import imgIndecisiveMonster from '../assets/units/IndecisiveMonster.png';
import imgLudopatia from '../assets/units/Ludopatia.png';
import imgMcNugget from '../assets/units/McNugget.png';
import imgMordisquitosFelpa from '../assets/units/MordisquitosFelpa.png';
import imgMunchMunch from '../assets/units/MunchMunch.png';
import imgMunchMunchRC from '../assets/units/MunchMunchRC.png';
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
  createFuggler('c1', 'Mordisquitos de Felpa', ['D', 'B'], 1, 1, imgMordisquitosFelpa),
  createFuggler('c2', 'Old Tooth', ['D', 'R'], 1, 1, imgOldTooth),
  createFuggler('c3', 'Gaptooth Mcgoo', ['D', 'I'], 1, 1, imgGaptoothMcgoo),
  createFuggler('c4', 'Munch Munch', ['D', 'C'], 1, 1, imgMunchMunch),
  createFuggler('c5', 'Sasquoosh', ['B', 'R'], 1, 1, imgSasquoosh),
  createFuggler('c6', 'Sir Splodge-a-lot', ['B', 'I'], 1, 1, imgSirSplodge),
  createFuggler('c7', 'Indecisive Monster', ['B', 'C'], 1, 1, imgIndecisiveMonster),
  createFuggler('c8', 'Squidge', ['R', 'I'], 1, 1, imgSquidge),
  createFuggler('c9', 'Munch Munch RC', ['R', 'C'], 1, 1, imgMunchMunchRC),
  createFuggler('c10', 'Vagabundo de Almacén', ['I', 'C'], 1, 1, imgVagabundo),

  // 15 raros (coste 2)
  createFuggler('r1', 'Ibai', ['D', 'B'], 2, 2, imgIbai),
  createFuggler('r2', 'Ludopatia', ['D', 'R'], 2, 2, imgLudopatia),
  createFuggler('r3', 'McNugget', ['D', 'I'], 2, 2, imgMcNugget),
  createFuggler('r4', 'Atomic Fuggler', ['D', 'C'], 2, 2, imgatomicfuggler),
  createFuggler('r5', 'Burundanga', ['B', 'R'], 2, 2, imgburundanga),
  createFuggler('r6', 'Calamardo', ['B', 'I'], 2, 2, imgcalamardo),
  createFuggler('r7', 'Calsotetes', ['B', 'C'], 2, 2, imgcalsotetes),
  createFuggler('r8', 'Cesped', ['R', 'I'], 2, 2, imgcesped),
  createFuggler('r9', 'Charca Charquez', ['R', 'C'], 2, 2, imgcharcaCharquez),
  createFuggler('r10', 'Cheto', ['I', 'C'], 2, 2, imgcheto),
  createFuggler('r11', 'Gen Z Queen', ['D', 'B'], 2, 2, imggenzqueen),
  createFuggler('r12', 'Gold Digger', ['D', 'R'], 2, 2, imggoldidgger),
  createFuggler('r13', 'Julio', ['D', 'I'], 2, 2, imgjulio),
  createFuggler('r14', 'Knight', ['D', 'C'], 2, 2, imgknight),
  createFuggler('r15', 'Kosovo', ['B', 'R'], 2, 2, imgkosovo),

  // 12 epicos (coste 4)
  createFuggler('e1', 'La Cobra', ['D', 'B'], 3, 4, imglacobra),
  createFuggler('e2', 'Lana Del Rey', ['D', 'R'], 3, 4, imglanadelrey),
  createFuggler('e3', 'Lorena', ['D', 'I'], 3, 4, imglorena),
  createFuggler('e4', 'Lorna', ['D', 'C'], 3, 4, imglorna),
  createFuggler('e5', 'Manuela', ['B', 'R'], 3, 4, imgmanuela),
  createFuggler('e6', 'Marsupial', ['B', 'I'], 3, 4, imgmarsupial),
  createFuggler('e7', 'Melinda Gordon', ['B', 'C'], 3, 4, imgmelinda_gordon),
  createFuggler('e8', 'Octavio', ['R', 'I'], 3, 4, imgoctavio),
  createFuggler('e9', 'Pepins', ['R', 'C'], 3, 4, imgpepins),
  createFuggler('e10', 'Petit Suisse', ['I', 'C'], 3, 4, imgpetitsuisse),
  createFuggler('e11', 'Punchline', ['B', 'I'], 3, 4, imgpunchline),
  createFuggler('e12', 'Rallita', ['B', 'C'], 3, 4, imgrallita),

  // 5 legendarios (coste 5, un solo tipo)
  createFuggler('l1', 'El Patriarca Colmillo', ['D'], 4, 5, imgPatriarcaColmillo),
  createFuggler('l2', 'La Abuela de los Botones', ['B'], 4, 5, imgAwelaBotones),
  createFuggler('l3', 'El Residuo 0', ['R'], 4, 5, imgResiduo0),
  createFuggler('l4', 'El Rey de las Cajas', ['I'], 4, 5, imgReyDeLasCajas),
  createFuggler('l5', 'El Gran Saqueador', ['C'], 4, 5, imgGranSaqueador),
];

// calcula la probabilidad de aparicion por tier segun la ronda (ajustable)
export function getShopProbabilities(round) {
  if (round < 3) return { 1: 100, 2: 0, 3: 0, 4: 0 };
  if (round < 6) return { 1: 75, 2: 25, 3: 0, 4: 0 };
  if (round < 9) return { 1: 50, 2: 35, 3: 15, 4: 0 };
  return { 1: 30, 2: 40, 3: 25, 4: 5 }; // rondas avanzadas
}
