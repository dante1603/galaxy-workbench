
# GALAXY WORKBENCH: MANIFIESTO MAESTRO DEL PROYECTO ODYSSEY

**Propósito del documento:**
Este manifiesto establece la visión total, los principios rectores, las capas de diseño, las tecnologías involucradas y el papel de la IA en el desarrollo del videojuego **Odyssey**. Cualquier IA usada para generar contenido, datos o código debe adherirse estrictamente a este documento.

---

## 1. Visión General del Proyecto

**Odyssey** es un simulador de galaxias vivas tipo **Sandbox Voxel**, jugado desde la perspectiva de un **parásito consciente** (Simbionte Neural) que controla cuerpos alienígenas.

El proyecto combina:
*   **Ciencia Ficción Soft + Fantasía:** Admitimos elementos fantásticos (poderes, misticismo, energía vital) siempre que tengan una coherencia interna o biológica, similar a la mezcla de géneros en *Star Wars* o *Dragon Ball*.
*   **Universo Voxel Esférico:** A diferencia de mundos planos (Minecraft), generamos planetas esféricos completos, sistemas estelares y galaxias enteras.
*   **Exploración en múltiples escalas:** Galaxia → Sistema → Planeta → Bioma → Criatura.
*   **El Parásito:** La interfaz de usuario es diegética; eres una entidad que "hackea" la biología del huésped y la tecnología.

**Filosofía Central:**
Cada nivel del cosmos debe ser legible, interpretable y profundo. Nada se genera "porque sí"; cada resultado proviene de una cadena lógica basada en física simplificada + biología procedural + narrativa ecosistémica.

---

## 2. Arquitectura de Escalas "Micro ↔ Macro"

Odyssey opera como un continuo interconectado:

**Escala 1: Galaxia**
*   Distribución procedural de estrellas con "sabores estelares".
*   Rutas, facciones, comercio y eventos globales.
*   Persistencia total a través de semillas (Seeds).

**Escala 2: Sistemas Estelares**
*   Tipos de estrellas definen la luz y energía del sistema.
*   Órbitas y "Zonas de Ricitos de Oro" dinámicas.

**Escala 3: Planetas (Voxels)**
*   Geología voxel modificable y destructible.
*   Mapas de calor/humedad/presión gobiernan: clima, biomas y fauna.
*   Climatología realista: tormentas, estaciones, procesos atmosféricos.

**Escala 4: Biomas**
*   Flora, fauna, minerales específicos.
*   Reglas ecológicas definidas por capas de datos.
*   Reacción a acciones del jugador: caza, quemas, sobreexplotación.

**Escala 5: Entidades Vivas (ECS)**
*   Sistema modular.
*   Cuerpos, comportamiento, dieta, stats, drops.
*   Adaptación a interacción del jugador.

---

## 3. Mecánicas Nucleares

### 3.1. El Protocolo Parásito (Core Gameplay)
**Regla de Oro: NO EXISTEN HUMANOS.**
El universo está poblado únicamente por especies alienígenas.
*   **Identidad Real:** El jugador NO es el alienígena que se ve en pantalla. El jugador es un **Parásito Simbionte** (similar a una babosa cerebral) que se adhiere a la cabeza del anfitrión.
*   **Mecánica de Muerte:** Cuando la "Salud del Huésped" llega a 0, el cuerpo muere. El Parásito es expulsado y debe encontrar un nuevo anfitrión o reaparecer en un cuerpo clonado/nuevo.
*   **Interfaz Diegética (HUD):** Menús, mapas y chat no son "del juego", son proyecciones neuronales que el parásito inyecta directamente en el nervio óptico del huésped controlado.
*   **Multijugador:** Es una red psíquica entre parásitos conectando a sus huéspedes.

### 3.2. Especies Jugables (Huéspedes)
Cada especie es una "clase jugable" nativa de un bioma, actuando como un **traje biológico desechable** para el parásito.
*   **Caracoles Solares:** Fotosintéticos, soporte.
*   **Pangolines del Desierto:** Tanques, artesanos.
*   **Especies Oceánicas/Voladoras:** Exploración tridimensional.
*   *Nota:* El parásito hereda las estadísticas físicas del huésped, pero mantiene su propia progresión mental (niveles de parásito, recetas aprendidas).

### 3.3. Supervivencia y Construcción
*   Construcción modular en naves, bases y equipamiento.
*   Progresión: Supervivencia → Industrialización → Vuelo Atmosférico → Espacio.

### 3.4. Combate y Cristales
*   Combate terrestre, orbital y espacial.
*   **Sistema de Cristales:** Tecnología central basada en elementos (Fuego, Hielo, Gravedad, Electricidad). Los cristales actúan como munición, combustible y componentes mágicos/tecnológicos.

---

## 4. Ecosistemas Reactivos y Modularidad

### 4.1. Fauna Modular
*   Basada en arquetipos (Mamífero, Reptil, Verme, Mecanoide, etc.).
*   Componentes combinables: Cuerpo + Dieta + Ataque + Locomoción.

### 4.2. Dinamismo
*   Eventos climáticos alteran la vida.
*   Colapso de cadenas tróficas si el jugador interviene demasiado.
*   Progreso visible y persistente del mundo.

---

## 5. Tecnología y Rol de la IA

### 5.1. Determinismo
Todo lo que se genera depende de una semilla (Seed). Una misma semilla debe generar exactamente el mismo resultado en todas las escalas (Galaxia, Planeta, Criatura).

### 5.2. Principios para la IA (Gemini)
La IA actúa como un **Motor de Contenido y Narrativa**, no como motor de física.

1.  **Generar Datos, NO Reglas:** La IA rellena las bases de datos (JSON), no inventa la lógica del código.
2.  **Lore y Sabor:** Crear descripciones, nombres y contextos culturales ricos.
3.  **Coherencia Biológica:** Si una criatura vive en un desierto, la IA debe darle características lógicas (piel gruesa, retención de agua), aunque sea una criatura fantástica.
4.  **No romper la Inmersión:** El tono debe ser técnico-poético, adecuado para un registro científico de una civilización avanzada.

---

## 6. Estética y Diseño

**Estilo Visual:**
*   **Ciencia Ficción Orgánica:** Influencias de fauna marina y biotecnología.
*   **Fantasía Espacial:** Materiales brillantes, energías visibles (Ki/Magia), estructuras antiguas imposibles.
*   **Interfaz:** Oscura, limpia, con acentos de neón (Cian/Ámbar/Magenta) que evocan una computadora biológica avanzada.

**Sonido:**
*   Ambientes densos y alienígenas.

---

*Este documento sirve como la "Estrella del Norte" del Proyecto Odyssey. Todas las herramientas desarrolladas en este Workbench deben apuntar a facilitar la creación de este universo.*
