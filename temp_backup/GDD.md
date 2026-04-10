# Proyecto Fuggler Frenzy - Autochess

## Manual de Reglas

### I. Estructura del Combate y Tablero

*   **El Tablero**: Se divide en dos campos. Los jugadores colocan sus piezas en su mitad. El combate es automático.
*   **Capacidad de Unidades**: Puedes tener un máximo de 6 Fugglers activos en el tablero.
*   **La Reserva**: Tienes 10 espacios de reserva en el banquillo para planear evoluciones y guardar piezas clave.
*   **Victoria/Derrota**: Si tus Fugglers eliminan a los del rival, ganas la ronda. Si pierdes, tu Avatar recibe daño basado en cuántos Fugglers enemigos sobrevivieron.

### II. Sistema de Economía

*   **Ingreso Pasivo**: Ganas una cantidad fija de oro por ronda.
*   **Tienda**: Gastas oro para comprar Fugglers (2 comunes, 2 raros, 1 épico y 1 legendario) o para refrescar la tienda (reroll).
*   **Venta**: Puedes vender Fugglers para recuperar parte del oro invertido (50%).
*   **Mecánica de Racha Inversa**:
    *   **Racha de Victorias**: Recibes menos oro (incentiva a gastar para mantener el poder).
    *   **Racha de Derrotas**: Recibes más oro (bono de consolación para remontar con mejores piezas).

### III. Evolución de Fugglers (Sistema de Estrellas)

Para mejorar a tus Fugglers, debes coleccionar duplicados:
*   **3 Fugglers A** -> se fusionan en 1 Fuggler A+
*   **3 Fugglers A+** -> se fusionan en 1 Fuggler A++
*   *Nota:* Al lado del HUD (nameplate) de vida de cada Fuggler, aparecerá el nivel de mejora para facilitar la legibilidad del nivel de cada enemigo. (A -> A+ -> A++)

### IV. Sinergias y Tipos (Lore Fuggler)

Cada Fuggler pertenece a dos familias temáticas. Al juntar diferentes Fugglers del mismo tipo, desbloqueas bonificaciones acumulativas:
*   **Niveles de Sinergia**: Generalmente escalan en (2/4/6) o (3/5/6).
*   **Legendarios Únicos**: Existe un Fuggler Legendario por cada tipo. Este Fuggler cuenta como la pieza final para alcanzar el nivel máximo de sinergia (ej: el Fuggler que completa el 6/6 de "Dientudos").

### V. Calendario de Ruletas (Rondas 3, 6, 9, 12...)

Cada 3 rondas, el combate se pausa y aparece la Ruleta de la Suerte Fuggler. El contenido de la ruleta evoluciona según la fase de la partida. El orden de selección será del jugador que menos vida tiene al que más tiene (ascendente).

| Ronda | Tipo de Ruleta | Contenido del Botín |
| :--- | :--- | :--- |
| **Ronda 3** | Ruleta Inicial | Un Objeto Básico aleatorio (Diente, Pila, Calcetín, etc.). |
| **Ronda 6** | Ruleta de Evolución | Un Fuggler A+ (Común o Raro). |
| **Ronda 9** | Ruleta de Equipo | Un Objeto Básico adicional para buscar combinaciones. |
| **Ronda 12** | Ruleta de Artefacto | Un Artefacto Asegurado (Objeto ya fusionado de alto poder). |

---

## Sinergias de Estilo "Fuggler"

### 1. Los "Dientudos" (The Toothsome Crew)
*   **Efecto**: Cada ataque básico tiene una probabilidad de "morder" (sangrado), haciendo daño en el tiempo.
*   **Niveles**: (2/4/6). El nivel 6 lo desbloquea *"El Ortodoncista"* (Legendario), que hace que todos los mordiscos (daños de sangrado) sean críticos.

### 2. "Botones y Remiendos" (Button-Eyed Creeps)
*   **Efecto**: Tienen una probabilidad de "descoserse" al recibir daño, regenerando un 50% de la vida que le ha quitado el ataque.
*   **Niveles**: (3/5/6). El nivel 6 es el *"Maestro Sastre"*, que revive a un aliado caído con la mitad de vida una sola vez por ronda.

### 3. "Peluches Radioactivos" (Neon Nightmares)
*   **Efecto**: Al inicio del combate, "ciegan" a los enemigos adyacentes con su brillo, haciendo que fallen sus primeros 3 ataques.
*   **Niveles**: (2/4/6). El nivel 6 es *"Luz de Gas"*; cuando muere, confunde a un enemigo para que ataque a su propio equipo durante 3 segundos.

### 4. "Los Inadaptados de Caja" (Box-Dwellers)
*   **Efecto**: Empiezan el combate con un "escudo de cartón" que bloquea los primeros 3 impactos.
*   **Niveles**: (3/5/6). El nivel 6 es *"El Intocable"*, cuyo escudo explota al romperse, aturdiendo a todos alrededor 3 segundos.

### 5. "Cazadores de Calzoncillos" (Brief-Thieves)
*   **Efecto**: Copia los efectos de los objetos del rival y los reparte entre el equipo.
*   **Niveles**: (2/4/6). El nivel 6 es *"Capitán Calzoncillos"*, duplica el efecto de los objetos copiados del rival.

#### Tabla de Estructura de Tipos

| Sinergia | Estilo de Juego | El Legendario (Tipo Único) |
| :--- | :--- | :--- |
| **Dientudos** | Daño por segundo (DoT) | "El Ortodoncista" |
| **Botones** | Regeneración y resurrección | "Maestro Sastre" |
| **Radioactivos** | Control de masas | "Luz de Gas" |
| **Inadaptados** | Bloqueo de ataques y stun | "El Intocable" |
| **Cazadores** | Robo de estadísticas | "Capitán Calzoncillos" |

---

## Sistema de Objetos

Los objetos se dividen en Componentes (simples) y Artefactos (combinados). Se obtienen al finalizar cada ronda. Un Fuggler puede llevar hasta 2 componentes o 1 artefacto. Son irreversibles; vender al Fuggler destruye el objeto.

### 1. Componentes Básicos
*   **Diente de Leche Suelto**: Aumenta daño de ataque en 10%.
*   **Bobina de Hilo Enredado**: Aumenta la velocidad de ataque en un 10%.
*   **Imperdible Oxidado**: Otorga 100 puntos de vida.
*   **Calcetín Desparejado**: Aumenta la probabilidad de crítico en 13%.
*   **Pastilla de Jabón Gastada**: Aumenta la resistencia a stun o ceguera en -1 segundo.
*   **Pila Sulfatada**: Aumenta tiempo de stun o ceguera en +1 segundo.

*(Nota: juntar 2 componentes iguales dobla el efecto, ej: Imperdible x2 = 200 HP)*

### 2. Artefactos Combinados

| Objeto Combinado | Receta | Efecto Especial |
| :--- | :--- | :--- |
| **Dentadura Postiza Real** | Diente + Diente | Cada 3 ataques, arranca un trozo de vida máxima al enemigo y se suma a la suya. |
| **Jersey de Lana Picante** | Calcetín + Hilo | Devuelve el 20% del daño recibido a los atacantes (espinas). |
| **Mando a Distancia Pegajoso** | Pila + Pila | Al inicio del combate, aturde a un enemigo aleatorio durante 3 segundos. |
| **Alfiletero de la Abuela** | Imperdible + Hilo | Al morir, el Fuggler explota y hace daño en area. |
| **Bolsa de Canicas Tragadas** | Diente + Pila | Los ataques básicos rebotan en un enemigo adicional cercano. |
| **Collar de Botones Desalineados**| Imperdible + Jabón | Gana un escudo por cada Fuggler enemigo eliminado. |

### Mecánica Especial: Pelusa de Ombligo
Si vendes a un Fuggler con un artefacto equipado, el artefacto se destruye y hay 20% de probabilidad de obtener una **Pelusa de Ombligo**. 
*   **Uso**: Consumible. Al dárselo a un Fuggler, gana un nivel de estrella instantáneamente (A -> A+).

---

## FugglerPedia (42 Fugglers únicos)

| Rareza | Coste de Oro | Cantidad Únicos | Notas |
| :--- | :--- | :--- | :--- |
| **Comunes** | 1 Oro | 12 | Aparecen en todas las rondas. |
| **Raros** | 2-3 Oro | 15 | Aparecen a partir de la ronda 3. |
| **Épicos** | 4 Oro | 9 (o 12) | Aparecen a partir de la ronda 6. |
| **Legendarios** | 5 Oro | 6 (o 5) | Uno por tipo. Aparecen a partir de la ronda 9. |

### Sistema Multi-Tipos
Las 10 Combinaciones de Tipos (Parejas):
* `[DB]` Dientudo + Botones
* `[DR]` Dientudo + Radioactivo
* `[DI]` Dientudo + Inadaptado
* `[DC]` Dientudo + Cazador
* `[BR]` Botones + Radioactivo
* `[BI]` Botones + Inadaptado
* `[BC]` Botones + Cazador
* `[RI]` Radioactivo + Inadaptado
* `[RC]` Radioactivo + Cazador
* `[IC]` Inadaptado + Cazador

**1. Comunes (1 Oro) - 10 Unidades:** Cada combinación aparece 1 vez.  
*(Mordisquitos de Felpa, Old Tooth, Gaptooth Mcgoo, Munch Munch, Sasquoosh, Sir Splodge-a-lot, Indecisive Monster, Squidge, Munch Munch [repetido o variante], Vagabundo de Almacén).*

**2. Raros (2-3 Oro) - 15 Unidades:** 5 parejas se repiten dos veces para cerrar ciclo.

**3. Épicos (4 Oro) - 12 Unidades:** Cada combinación + 2 comodines (BI, BC) para equilibrar.

**4. Legendarios (5 Oro) - 5 Unidades:** Tipos Puros.
*   **[L1 Dientudo]**: El Patriarca Colmillo
*   **[L2 Botones]**: La Abuela de los Botones
*   **[L3 Radioactivo]**: El Residuo 0
*   **[L4 Inadaptado]**: El Rey de las Cajas (Gatito Abandonado)
*   **[L5 Cazador]**: El Gran Saqueador
