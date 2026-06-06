# Guía de Estilos UI/UX (Inspiración Biblioteca Digital)

Este documento define las directrices visuales y de experiencia de usuario para el sistema de biblioteca, tomando como referencia un diseño limpio, moderno y orientado a la accesibilidad.

## 1. Paleta de Colores

El sistema utiliza fondos claros para la legibilidad, un color oscuro principal para el contraste y un color vibrante para las acciones principales.

* **Fondo Principal:** Blanco puro (`#FFFFFF` o `bg-white`) para las áreas de contenido y listados.
* **Fondo Secundario:** Gris muy claro (`#F3F4F6` o `bg-gray-100`) para separar secciones o como fondo detrás de las tarjetas.
* **Color Primario (Acento):** Ámbar / Naranja (`#F59E0B` o `bg-amber-500`). Se usa para botones principales, iconos de llamadas a la acción y bordes destacados.
* **Color Hero / Header:** Morado profundo o Índigo (`#312E81` o `bg-indigo-900`). Excelente para la barra de navegación superior o el banner de bienvenida.
* **Texto Principal:** Gris oscuro / Pizarra (`#1F2937` o `text-gray-800`) para títulos y texto normal. Nunca negro puro para no cansar la vista.

## 2. Tipografía

* **Familia:** Sans-serif limpia y geométrica (ej. *Inter*, *Roboto*, o *Poppins*).
* **Títulos de Sección (ej. "El libro y lectura"):** Tamaño grande (24px - `text-2xl`), peso semi-bold, color gris oscuro. Alineados a la izquierda.
* **Títulos de Tarjetas (Nombres de libros/autores):** Tamaño mediano (16px - `text-base`), peso medium. Debe truncarse si es muy largo (`truncate`).

## 3. Formas y Bordes (Borders & Radius)

La interfaz se caracteriza por ser "amigable" y orgánica, evitando las esquinas puntiagudas.

* **Tarjetas (Listado de libros/autores):** Esquinas redondeadas (`rounded-xl` o `rounded-2xl`).
* **Botones:** Forma de píldora, totalmente redondeados (`rounded-full`).
* **Contenedores de Búsqueda:** Ligeramente redondeados (`rounded-lg`).

## 4. Diseño de Componentes (Para Listar, Editar y Eliminar)

### A. Tarjetas de Listado (Cards)
En lugar de una tabla tradicional, los libros y autores se mostrarán en una cuadrícula de tarjetas (Grid).
* **Fondo:** Blanco.
* **Borde/Sombra:** Sin borde visible, pero con una sombra suave (`shadow-sm` o `shadow-md`).
* **Hover State (Interacción):** Al pasar el mouse, la tarjeta debe elevarse ligeramente (`hover:-translate-y-1`) y aumentar su sombra (`hover:shadow-lg`) para indicar que es interactiva.
* **Layout interno:** Imagen o ícono arriba, título y autor en el medio, y botones de acción en la parte inferior.

### B. Botones de Acción (CTAs)
* **Acción Principal (Ej. "Guardar", "Crear Libro"):** Fondo sólido Ámbar con texto blanco.
* **Acción Secundaria (Ej. "Ver más", "Editar"):** Botón fantasma (Ghost) o con contorno (Outline). Fondo transparente, borde y texto color Ámbar.
* **Acción Destructiva (Ej. "Eliminar"):** Para mantener la armonía pero advertir al usuario, usar un contorno rojo o un botón discreto que pida confirmación antes de borrar.

## 5. Recomendaciones de UX

* **Paginación Limpia:** Si hay muchos registros, usar una paginación minimalista en la parte inferior, usando el color de acento para la página activa.
* **Iconografía:** Usar iconos de línea (tipo *Lucide* o *Heroicons*) para las acciones de "Editar" (lápiz) y "Eliminar" (papelera) dentro de las tarjetas, ahorrando espacio visual.
* **Feedback Inmediato:** Usar "Toasts" o notificaciones pequeñas en la esquina superior cuando un libro se edita o elimina correctamente.
* **Estados de Carga (Skeletons):** Mientras la API de Prisma responde, mostrar tarjetas grises parpadeantes en lugar de una pantalla en blanco.