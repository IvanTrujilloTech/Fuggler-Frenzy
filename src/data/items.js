export const ITEM_COMPONENTS = {
  tooth: { id: 'tooth', name: 'Diente de Leche Suelto', description: '+10% Daño de Ataque', type: 'component', lore: 'Arrancado a mordiscos de... alguien. Aún tiene algo de sangre seca y huele fatal. Perfecto para clavarlo en los ojos del enemigo.' },
  thread: { id: 'thread', name: 'Bobina de Hilo Enredado', description: '+10% Velocidad de Ataque', type: 'component', lore: 'Hilo rebozado en babas. Quien intente desenredarlo acabará perdiendo la cordura y ganando una rabieta.' },
  pin: { id: 'pin', name: 'Imperdible Oxidado', description: '+100 Puntos de Vida', type: 'component', lore: 'Ideal para evitar que se te salgan las tripas de fieltro. Al menos si el tétanos no te mata primero.' },
  sock: { id: 'sock', name: 'Calcetín Desparejado', description: '+13% Probabilidad Crítico', type: 'component', lore: 'Lleva tres meses debajo de la cama. Está tan crujiente que corta como el cristal.' },
  soap: { id: 'soap', name: 'Pastilla de Jabón Gastada', description: '+1 Resistencia CC', type: 'component', lore: '¡Agh, está limpia! Produce un asco tremendo que hace que te resbale casi cualquier problema.' },
  battery: { id: 'battery', name: 'Pila Sulfatada', description: '+1s Duración CC', type: 'component', lore: 'Un líquido extraño sale de ella y te hace vibrar los dientes. Si la chupas a lo mejor te salen superpoderes.' },
};

export const ARTIFACT_RECIPES = {
  'tooth_tooth': { id: 'dentadura', name: 'Dentadura Postiza Real', description: 'Cada 3 ataques roba vida máxima.', effects: ['lifesteal_proportional'], recipe: ['tooth', 'tooth'], lore: 'Robada de la mesita de noche del abuelo de un bocado. Te permite roer almas y alimentarte de su desesperación.' },
  'sock_thread': { id: 'jersey_picante', name: 'Jersey de Lana Picante', description: 'Devuelve 20% del daño (espinas).', effects: ['thorns_20'], recipe: ['sock', 'thread'], lore: 'Teje un calcetín asqueroso con un hilo baboso y tendrás una prenda tan repulsiva que atacarte provoca asco y dolor.' },
  'battery_battery': { id: 'mando_pegajoso', name: 'Mando a Distancia Pegajoso', description: 'Alerta aturde enemigo aleatorio 3s.', effects: ['start_stun_3s'], recipe: ['battery', 'battery'], lore: 'Pilas tóxicas potencian este mando cubierto de... mejor no preguntes de qué. Un solo clic fríe los plomos a cualquiera.' },
  'pin_thread': { id: 'alfiletero_abuela', name: 'Alfiletero de la Abuela', description: 'Al morir explota haciendo daño de área.', effects: ['death_explosion'], recipe: ['pin', 'thread'], lore: 'Una bomba casera cosida con mucho rencor. "Si yo muero y me descoso, ¡vosotros os venís conmigo!"' },
  'tooth_battery': { id: 'bolsa_canicas', name: 'Bolsa de Canicas Tragadas', description: 'Ataques rebotan en enemigo adicional.', effects: ['attack_bounce'], recipe: ['tooth', 'battery'], lore: 'Canicas potentes que saben a muela y vibran. Una vez que las escupes, rebotarán rompiendo cráneos a diestro y siniestro.' },
  'pin_soap': { id: 'collar_botones', name: 'Collar de Botones Desalineados', description: 'Escudo por cada enemigo eliminado.', effects: ['shield_on_kill'], recipe: ['pin', 'soap'], lore: 'Un jabón atado miserablemente con imperdibles para que resbalen los golpes. Tan cochambroso que da más pena que daño.' }
};

export function combineItems(item1Id, item2Id) {
  const combination1 = `${item1Id}_${item2Id}`;
  const combination2 = `${item2Id}_${item1Id}`;
  return ARTIFACT_RECIPES[combination1] || ARTIFACT_RECIPES[combination2] || null;
}
