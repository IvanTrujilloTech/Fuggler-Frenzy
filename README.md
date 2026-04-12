# Fuggler Frenzy 

¡Bienvenido al foso, saco de pulgas de fieltro! Estás a punto de adentrarte en el torneo más sucio, mal cosido y destructivo que jamás haya pisado el mundo digital.

---

## Lore Fuggleriano

**¡Bienvenidos, muggles y despojos deshilachados, a Fuggler Frenzy!** 
Aquí los peluches no se abrazan para dormir; te roban los dientes mientras sueñas, te babean la almohada e intentan ahogarte con calcetines que llevan seis meses bajo la cama. Tienes el "honor" de comandar a estas abominaciones del diseño textil en un sangriento duelo por la supervivencia.

En este tablero rancio no hay espacio para el amor. Cada Fuggler, armado con botones desalineados, sonrisas macabras y componentes radiactivos extraídos del cubo de la basura, luchará hasta que no le quede relleno en las tripas para proclamarse el Rey del Basurero. 

Junta sus peores manías, equípalos con basura letal y disfruta viendo cómo destruyen la paciencia (y el panel de HP) de tu oponente. ¡Que gane el más horrendo!

---

## Normas del Basurero (Cómo Jugar)

Para ganar en Fuggler Frenzy tendrás que ser calculador y un poco despiadado. Las reglas son las siguientes:

1. **Gestión de Oro (G)**: Durante cada ronda recibirás oro. Usa este oro sapiencialmente para comprar a tus abominaciones favoritas en la Tienda, o usa la función de **Reroll (2G)** para refrescar los Fugglers disponibles y tentar a la suerte apostando por Míticos o Épicos.
2. **Capacidad del Tablero**: Eres el gestor de un ejército limitado. Puedes añadir escoria a tu banquillo con total impunidad, pero solo podrás colocar un máximo de **6 Fugglers a la vez en el tablero aliado**.
3. **Fase de Combate**: Arrastra a tus Fugglers con el ratón o el dedo desde tu banquillo hasta los hexágonos libres del tablero y prepárate para la colisión auto-chess contra el equipo enemigo.
4. **Artefactos y Basura**: Revisa tu Pedia a menudo. En el juego tienes a tu disposición componentes espantosos (como *Dientes Sueltos* o *Pilas Sulfatadas*). Si equipas determinados combos, podrás crear **Artefactos Combinados**, dotando a tu Fuggler de un impacto brutal: desde hacer que te roben la vida, hasta causar una explosión al descoserse.
5. **Alineación de Tipos**: Algunos Fugglers poseen subtipos compartidos (*Radioactivos, Inadaptados, Dientudos...*). Tenlo en mente antes de posicionarlos en el tablero de batalla.

---

## Tecnologías Utilizadas

Para tejer a estas criaturas se ha empleado el siguiente conjunto de herramientas y librerías modernas del ecosistema Front-end:

- **Vue 3 (Composition API & `<script setup>`)**: El esqueleto reactivo sobre el que cuelgan pedazos de lógica y toda la gestión hiperveloz de componentes reactivos.
- **Vite**: El empaquetador ultrarrápido que levanta el entorno de desarrollo sin tirones.
- **Pinia (`useGameStore`)**: Gestor de estado unificado que maneja la persistencia del oro, la tienda, el inventario del jugador y el progreso global por rondas de las peleas Fuggler a Fuggler sin sudar.
- **Vue Router**: Motor de rutas fluido. Facilita la división escénica (Landing y FugglerPedia independientes del entorno de juego brutal `GameView`).
- **VueDraggable Pro**: La varita mágica que permite a los usuarios hacer Drag & Drop, manipulando y trasladando a los Fugglers como un saco de patatas entre el tablero y el banquillo.
- **@Floating-UI/vue**: Impulsa todo el sistema de ventanas emergentes para la enciclopedia de componentes, superponiendo tooltips esquivadores de reglas CSS de *clip-paths* para mostrarte sin recortes sus terroríficas virtudes.
- **Vanilla CSS3 (Glassmorphism & Grids)**: Dejado completamente limpio sin frameworks. Aquí reinan variables CSS, transiciones de *dropshadow*, bordes punteados (*stitches*) y diseños cristalinos tintados con luz tóxica (`#cbf066`) para una inmersión completa al estilo de muñeco vudú. 
