// Definición de tipos
export const FUGGLER_TYPES = {
  D: { id: 'D', name: 'Dientudos', color: '#B91C1C' }, // Rojo oscuro
  B: { id: 'B', name: 'Botones', color: '#1D4ED8' },  // Azul
  R: { id: 'R', name: 'Radioactivos', color: '#16A34A' }, // Verde Neon
  I: { id: 'I', name: 'Inadaptados', color: '#9333EA' }, // Morado
  C: { id: 'C', name: 'Cazadores', color: '#EAB308' }    // Amarillo
};

// Utilidad para crear stats base
const baseStats = (tier) => {
  switch(tier) {
    case 1: return { hp: 500, damage: 50, attackSpeed: 1.0, armor: 20 };
    case 2: return { hp: 700, damage: 70, attackSpeed: 1.05, armor: 25 };
    case 3: return { hp: 1000, damage: 100, attackSpeed: 1.1, armor: 30 };
    case 4: return { hp: 1500, damage: 150, attackSpeed: 1.2, armor: 40 };
    default: return { hp: 500, damage: 50, attackSpeed: 1.0, armor: 20 };
  }
};

const createFuggler = (id, name, types, tier, cost) => ({
  id,
  name,
  types,
  tier,
  cost,
  stats: baseStats(tier)
});

// FugglerPedia database (All 42)
export const FUGGLERS = [
  // 10 Comunes (Cost 1)
  createFuggler('c1', 'Mordisquitos de Felpa', ['D', 'B'], 1, 1),
  createFuggler('c2', 'Old Tooth', ['D', 'R'], 1, 1),
  createFuggler('c3', 'Gaptooth Mcgoo', ['D', 'I'], 1, 1),
  createFuggler('c4', 'Munch Munch C4', ['D', 'C'], 1, 1),
  createFuggler('c5', 'Sasquoosh', ['B', 'R'], 1, 1),
  createFuggler('c6', 'Sir Splodge-a-lot', ['B', 'I'], 1, 1),
  createFuggler('c7', 'Indecisive Monster', ['B', 'C'], 1, 1),
  createFuggler('c8', 'Squidge', ['R', 'I'], 1, 1),
  createFuggler('c9', 'Munch Munch C9', ['R', 'C'], 1, 1),
  createFuggler('c10', 'Vagabundo de Almacén', ['I', 'C'], 1, 1),

  // 15 Raros (Cost 2/3, we assume 2 for simplicity now)
  createFuggler('r1', 'Raro DB', ['D', 'B'], 2, 2),
  createFuggler('r2', 'Grin Grin', ['D', 'R'], 2, 2),
  createFuggler('r3', 'Mccoo', ['D', 'I'], 2, 2),
  createFuggler('r4', 'Raro DC', ['D', 'C'], 2, 2),
  createFuggler('r5', 'Raro BR', ['B', 'R'], 2, 2),
  createFuggler('r6', 'Raro BI', ['B', 'I'], 2, 2),
  createFuggler('r7', 'Raro BC', ['B', 'C'], 2, 2),
  createFuggler('r8', 'Raro RI', ['R', 'I'], 2, 2),
  createFuggler('r9', 'Raro RC', ['R', 'C'], 2, 2),
  createFuggler('r10', 'Raro IC', ['I', 'C'], 2, 2),
  createFuggler('r11', 'Raro DB Repetido', ['D', 'B'], 2, 2),
  createFuggler('r12', 'Raro DR Repetido', ['D', 'R'], 2, 2),
  createFuggler('r13', 'Raro DI Repetido', ['D', 'I'], 2, 2),
  createFuggler('r14', 'Raro DC Repetido', ['D', 'C'], 2, 2),
  createFuggler('r15', 'Raro BR Repetido', ['B', 'R'], 2, 2),

  // 12 Epicos (Cost 4)
  createFuggler('e1', 'Epico DB', ['D', 'B'], 3, 4),
  createFuggler('e2', 'Epico DR', ['D', 'R'], 3, 4),
  createFuggler('e3', 'Epico DI', ['D', 'I'], 3, 4),
  createFuggler('e4', 'Epico DC', ['D', 'C'], 3, 4),
  createFuggler('e5', 'Epico BR', ['B', 'R'], 3, 4),
  createFuggler('e6', 'Epico BI', ['B', 'I'], 3, 4),
  createFuggler('e7', 'Epico BC', ['B', 'C'], 3, 4),
  createFuggler('e8', 'Epico RI', ['R', 'I'], 3, 4),
  createFuggler('e9', 'Epico RC', ['R', 'C'], 3, 4),
  createFuggler('e10', 'Epico IC', ['I', 'C'], 3, 4),
  createFuggler('e11', 'Epico BI Comodín', ['B', 'I'], 3, 4),
  createFuggler('e12', 'Epico BC Comodín', ['B', 'C'], 3, 4),

  // 5 Legendarios (Cost 5, Single Type)
  createFuggler('l1', 'El Patriarca Colmillo', ['D'], 4, 5),
  createFuggler('l2', 'La Abuela de los Botones', ['B'], 4, 5),
  createFuggler('l3', 'El Residuo 0', ['R'], 4, 5),
  createFuggler('l4', 'El Rey de las Cajas', ['I'], 4, 5),
  createFuggler('l5', 'El Gran Saqueador', ['C'], 4, 5),
];

// Calcula probabilidad por ronda, ejemplo básico (ajustable):
export function getShopProbabilities(round) {
  if (round < 3) return { 1: 100, 2: 0, 3: 0, 4: 0 };
  if (round < 6) return { 1: 75, 2: 25, 3: 0, 4: 0 };
  if (round < 9) return { 1: 50, 2: 35, 3: 15, 4: 0 };
  return { 1: 30, 2: 40, 3: 25, 4: 5 }; // Rondas avanzadas
}
