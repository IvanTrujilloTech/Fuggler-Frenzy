export const ITEM_COMPONENTS = {
  tooth: { id: 'tooth', name: 'Diente de Leche Suelto', description: '+10% Daño de Ataque', type: 'component' },
  thread: { id: 'thread', name: 'Bobina de Hilo Enredado', description: '+10% Velocidad de Ataque', type: 'component' },
  pin: { id: 'pin', name: 'Imperdible Oxidado', description: '+100 Puntos de Vida', type: 'component' },
  sock: { id: 'sock', name: 'Calcetín Desparejado', description: '+13% Probabilidad Crítico', type: 'component' },
  soap: { id: 'soap', name: 'Pastilla de Jabón Gastada', description: '+1 Resistencia CC', type: 'component' },
  battery: { id: 'battery', name: 'Pila Sulfatada', description: '+1s Duración CC', type: 'component' },
};

export const ARTIFACT_RECIPES = {
  'tooth_tooth': { id: 'dentadura', name: 'Dentadura Postiza Real', description: 'Cada 3 ataques roba vida máxima.', effects: ['lifesteal_proportional'] },
  'sock_thread': { id: 'jersey_picante', name: 'Jersey de Lana Picante', description: 'Devuelve 20% del daño (espinas).', effects: ['thorns_20'] },
  'battery_battery': { id: 'mando_pegajoso', name: 'Mando a Distancia Pegajoso', description: 'Alerta aturde enemigo aleatorio 3s.', effects: ['start_stun_3s'] },
  'pin_thread': { id: 'alfiletero_abuela', name: 'Alfiletero de la Abuela', description: 'Al morir explota haciendo daño de área.', effects: ['death_explosion'] },
  'tooth_battery': { id: 'bolsa_canicas', name: 'Bolsa de Canicas Tragadas', description: 'Ataques rebotan en enemigo adicional.', effects: ['attack_bounce'] },
  'pin_soap': { id: 'collar_botones', name: 'Collar de Botones Desalineados', description: 'Escudo por cada enemigo eliminado.', effects: ['shield_on_kill'] }
};

export function combineItems(item1Id, item2Id) {
  const combination1 = `${item1Id}_${item2Id}`;
  const combination2 = `${item2Id}_${item1Id}`;
  return ARTIFACT_RECIPES[combination1] || ARTIFACT_RECIPES[combination2] || null;
}
