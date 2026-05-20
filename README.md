# Fuggler Frenzy

Fuggler Frenzy es una plataforma web interactiva inspirada en el género Auto-chess y basada en el universo de las criaturas textiles conocidas como Fugglers. Este proyecto ha sido desarrollado como trabajo práctico final para el segundo año del Ciclo Formativo de Grado Superior en Desarrollo de Aplicaciones Web (DAW), aplicando conceptos avanzados de reactividad, gestión de estado centralizada e integración con base de datos en tiempo real.

---

## Lore y Concepto del Proyecto

El concepto artístico y narrativo del proyecto gira en torno a los Fugglers: muñecos de felpa caracterizados por su aspecto grotesco, sonrisas dentadas asimétricas y ojos de botón desalineados. En el contexto de este simulador, estas criaturas han sido extraídas de su entorno para competir en una arena de combate subterránea y urbana. 

Cada criatura posee atributos únicos basados en sus materiales de confección y habilidades innatas, utilizando objetos desechados (como pilas sulfatadas, bobinas de hilo o imperdibles) para incrementar su potencial destructivo. El objetivo del jugador es actuar como gestor y estratega de estas abominaciones, maximizando las sinergias de sus tipos antes de que su barra de salud sea desmantelada por el adversario.

---

## Reglas del Juego y Dinámicas de Simulación

El diseño de las mecánicas de juego sigue un esquema estructurado en turnos y fases, garantizando el equilibrio en la toma de decisiones estratégicas:

1. **Gestión de la Economía (Oro)**: El jugador recibe una asignación de oro al inicio de cada ronda de planificación. Este recurso permite adquirir nuevas unidades en la tienda o realizar actualizaciones de inventario (Reroll) por un coste fijo de 2 unidades de oro para renovar la oferta de criaturas disponibles.
2. **Capacidad del Tablero y Nivel de Jugador**: El límite de unidades activas en combate está condicionado por el nivel de experiencia del jugador (escalable del nivel 1 al 6). El paso de nivel requiere la compra progresiva de puntos de experiencia, cuyo coste aumenta de forma proporcional. El banquillo auxiliar permite almacenar hasta 9 unidades inactivas en reserva.
3. **Fases de Juego**: Cada turno cuenta con una fase de planificación de duración limitada (30 segundos), durante la cual el usuario puede reorganizar sus unidades y equipar objetos. Al expirar el tiempo, el sistema transiciona automáticamente a la fase de combate.
4. **Sistema de Sinergias de Tipos**: Las criaturas están clasificadas bajo subtipos específicos (Dientudos, Botones, Radioactivos, Inadaptados y Cazadores). La acumulación de unidades distintas de un mismo tipo en el tablero de combate desbloquea modificadores de estadísticas pasivas para todo el grupo.
5. **Crafteo y Combinación de Artefactos**: Cada unidad puede equipar un máximo de dos objetos. Al detectar la coincidencia de dos componentes compatibles en una misma unidad, el sistema los fusiona de manera inmediata en un artefacto avanzado con propiedades tácticas añadidas (por ejemplo, daño por espinas o explosión post-mortem).

---

## Arquitectura y Tecnologías Utilizadas

La arquitectura técnica de la aplicación se fundamenta en un ecosistema robusto de herramientas Front-end modernas para garantizar velocidad de renderizado, modularidad y sincronización óptima:

- **Vue 3 (Composition API con <script setup>)**: Constituye el núcleo del desarrollo, permitiendo estructurar los componentes de forma declarativa y aprovechar el sistema de reactividad mediante variables de estado controladas.
- **Vite**: Utilizado como entorno de desarrollo y herramienta de empaquetado (bundler), facilitando compilaciones incrementales veloces y una distribución de recursos optimizada para producción.
- **Pinia (useGameStore y useMultiplayerStore)**: Actúa como almacén de estado centralizado (Single Source of Truth), separando la lógica del estado del juego (oro, tienda, inventario) de la lógica de sincronización multijugador.
- **Firebase Realtime Database (RTDB)**: Motor NoSQL en la nube para la persistencia del estado compartido en las partidas multijugador, asegurando actualizaciones reactivas instantáneas entre los diferentes clientes.
- **VueDraggable Pro**: Implementado para proporcionar una manipulación táctil y de ratón (Drag and Drop) precisa durante el traslado de las unidades entre el banquillo y el tablero.
- **@Floating-UI/vue**: Empleado para la visualización de tooltips dinámicos con información detallada de los personajes, evitando recortes visuales producidos por las propiedades de desbordamiento CSS de los contenedores padre.
- **Vanilla CSS3**: Toda la interfaz gráfica ha sido desarrollada con CSS puro, aplicando técnicas de Glassmorphism, diseños adaptables basados en Flexbox y Grid, y estilos personalizados de costuras simuladas en consonancia con la temática del proyecto.

---

## Especificación Técnica y Flujo Lógico Interno

Esta sección detalla las implementaciones lógicas más críticas del desarrollo que garantizan la consistencia técnica de la plataforma:

### 1. Sincronización Multijugador y Validación de Lobbies
El estado de la partida se sincroniza de forma continua con Firebase. Uno de los mayores retos de ingeniería de este proyecto ha sido la gestión de la persistencia de arrays vacíos en bases de datos NoSQL, lo cual requirió un proceso de normalización en el cliente para forzar la inyección de posiciones densas uniformes de longitud fija (21 posiciones para el tablero y 9 para el banquillo):
```javascript
const denseBoard = Array.from({ length: 21 }, (_, i) => this.board[i] || []);
```
Asimismo, para asegurar la integridad de la fase de combate y evitar emparejamientos incompletos en los que un jugador quede sin rival activo, se ha implementado un control estricto en la lobby. El inicio de la partida multijugador está restringido a salas con exactamente **2, 4, 6 u 8 jugadores**. Si el número total de participantes es impar, el sistema ejecuta dos mecanismos de control coordinados:
- **Protección en Backend**: La acción `startGame` en el store multijugador evalúa el número de claves activas en el nodo de jugadores e impide la actualización del estado de Firebase si el valor no es par.
- **Interfaz del Host**: El botón de inicio se deshabilita automáticamente y se presenta una advertencia gráfica de precaución (Caution) utilizando el recurso optimizado `assets/HUD/caution.webp` bajo una animación pulsante CSS para guiar al anfitrión.

### 2. Motor de Combate y Coordenadas Hexagonales
El motor de combate funciona en tiempo real mediante un bucle de ejecución (ticks) cada 500 milisegundos.
- **Sistema de Coordenadas**: El tablero utiliza una cuadrícula hexagonal adaptada a un mapeo axial empleando las coordenadas `(q, r)`. La distancia real entre casillas se evalúa matemáticamente en cada ciclo:
  ```javascript
  const dist = (Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2;
  ```
- **Hilos de Acción de la IA**: En cada tick, cada unidad evalúa las posiciones enemigas mediante la distancia calculada. Si la distancia es igual o inferior a 1 casilla, se ejecuta el ataque básico tras superar el cooldown derivado de la estadística de velocidad de ataque del personaje. Si el enemigo está fuera del alcance de ataque, la unidad busca el vecino libre más cercano para dar un paso en su dirección.

### 3. Modelo de Probabilidades y Balanceo de Tiers
- **Distribución en Tienda**: La tienda calcula la disponibilidad de criaturas mediante la función `getShopProbabilities(round)`. Los tiers más altos sólo aparecen a medida que avanzan las rondas de juego, mitigando la ventaja temprana aleatoria.
- **Ajuste de Estadísticas en Tiers Altos**: Las unidades de Tier 4 (Legendarios) disponían originalmente de un multiplicador base de `3.0` aplicado sobre las plantillas de HP y Daño físico de sus respectivos roles. Para corregir el desequilibrio en la fase media de la partida, este factor de escalado se ha reajustado a **`2.6`** (~13.3% de reducción), manteniendo su estatus de poder superior pero permitiendo estrategias de contrajuego basadas en sinergias de tiers inferiores.

### 4. Lógica de Fusión y Evolución por Estrellas
El almacén central de Pinia monitoriza constantemente el estado del banquillo y del tablero activo tras cada transacción mediante la acción `checkUpgrades`. Cuando detecta tres instancias idénticas del mismo personaje con el mismo nivel de estrellas, ejecuta la fusión automática hacia el siguiente rango de estrellas (hasta un máximo de 3 estrellas o rango A++), eliminando los duplicados sobrantes, reintegrando los objetos asociados al inventario general y multiplicando los atributos de combate por el coeficiente de escalado de su rol.
