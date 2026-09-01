# Operaciones Básicas — web de la asignatura

Sitio estático (HTML + CSS + JS, sin frameworks ni build step) para ir publicando
los temas de la asignatura a medida que los creas. Los alumnos ven un índice con
los temas más recientes primero; cada tema puede tener materiales (PDF, enlaces,
vídeos) y actividades interactivas (quiz de opción múltiple, relacionar conceptos).

## Candado de acceso (contraseña)

El sitio pide una contraseña antes de mostrar nada (`js/candado.js`). **Importante:
esto es solo disuasorio**, no seguridad real — GitHub Pages publica el sitio en
una URL abierta, y cualquier persona con conocimientos técnicos puede leer el
código fuente y saltárselo. Sirve para que no lo vea cualquiera que pase por el
enlace por casualidad, no para proteger datos sensibles.

**Contraseña provisional: `operaciones2026`** — cámbiala antes de publicar:

1. Abre la consola del navegador (F12) en cualquier página web.
2. Pega y ejecuta (cambiando `tu-nueva-contraseña`):
   ```js
   crypto.subtle.digest('SHA-256', new TextEncoder().encode('tu-nueva-contraseña'))
     .then(b => console.log(Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2,'0')).join('')))
   ```
3. Copia el texto largo que aparece.
4. Pégalo en `js/candado.js`, sustituyendo el valor de `HASH_ESPERADO`.

Cada alumno solo tiene que escribirla una vez por sesión de navegador (se guarda
con `sessionStorage`, así que se la volverá a pedir si cierra la pestaña).

## Cómo está organizado

```
index.html          → página de inicio, lista los temas
tema.html            → plantilla de detalle de un tema (usa ?id=... en la URL)
css/estilos.css      → todos los estilos
js/main.js           → pinta el índice de index.html
js/tema.js           → pinta el detalle de tema.html
js/actividades.js    → motor de actividades interactivas (quiz, relacionar)
data/temas.json      → AQUÍ ES DONDE AÑADES CONTENIDO NUEVO
materiales/          → PDFs y otros ficheros que cuelgues (organizados por tema)
```

No hay backend ni base de datos: todo el contenido vive en `data/temas.json`,
y los ficheros (apuntes, etc.) se suben directamente al repositorio dentro de
`materiales/`.

## Añadir un tema nuevo

Edita `data/temas.json` y añade un objeto nuevo dentro del array `"temas"`:

```json
{
  "id": "identificador-unico-sin-espacios",
  "titulo": "Título del tema",
  "fecha": "2026-09-15",
  "descripcion": "Una o dos frases sobre el tema.",
  "contenido": "<h2>Un apartado</h2><p>Texto de la sesión, en HTML. Opcional: si lo omites, la página solo muestra descripción + materiales + actividades.</p>",
  "materiales": [
    { "tipo": "pdf", "titulo": "Apuntes", "url": "materiales/mi-tema/apuntes.pdf" },
    { "tipo": "enlace", "titulo": "Un enlace externo", "url": "https://..." }
  ],
  "actividades": [
    {
      "tipo": "quiz",
      "titulo": "Autoevaluación",
      "preguntas": [
        { "pregunta": "¿Enunciado?", "opciones": ["A", "B", "C"], "correcta": 1 }
      ]
    },
    {
      "tipo": "relacionar",
      "titulo": "Relaciona los conceptos",
      "pares": [
        { "izquierda": "Término", "derecha": "Definición" }
      ]
    }
  ]
}
```

Notas:
- `"contenido"` es HTML libre que se inserta tal cual en la página del tema (apartado "lección"). Usa `<h2>`, `<p>`, `<ul>`, `<pre><code>...</code></pre>` para bloques de código, y `<div class="nota">...</div>` para avisos destacados. Como es HTML que tú mismo escribes, recuerda escapar `<` y `>` como `&lt;` y `&gt;` cuando quieras mostrar una etiqueta HTML como texto (por ejemplo, dentro de un bloque de código de ejemplo).
- `"correcta"` es el **índice** (empezando en 0) de la opción correcta dentro de `"opciones"`.
- `"id"` debe ser único y sin espacios (se usa en la URL: `tema.html?id=identificador-unico-sin-espacios`).
- `"materiales"` y `"actividades"` son opcionales: si un tema no tiene actividades, simplemente omite esa clave o déjala como `[]`.
- Los tipos de material soportados son `pdf`, `enlace` y `video` (solo cambia el icono que se muestra; en los tres casos es un enlace normal).
- Si subes un PDF, colócalo dentro de `materiales/<nombre-del-tema>/` y apunta `"url"` a esa ruta relativa.

### Añadir un tipo de actividad nuevo

El motor está en `js/actividades.js`. Para añadir un tipo nuevo (por ejemplo,
"rellenar huecos"):
1. Escribe una función `renderRellenarHuecos(contenedor, datos)` siguiendo el
   patrón de `renderQuiz` o `renderRelacionar`.
2. Regístrala en el objeto `RENDERERS` al final del fichero.
3. Usa `"tipo": "rellenarHuecos"` en `data/temas.json`.

## Probarlo en tu ordenador antes de publicar

Como el sitio carga `data/temas.json` con `fetch`, no funciona si simplemente
abres `index.html` haciendo doble clic (los navegadores bloquean `fetch` sobre
`file://`). Necesitas un servidor local muy simple:

```bash
# Desde la carpeta del proyecto:
python3 -m http.server 8000
# Abre http://localhost:8000 en el navegador
```

O, si usas VS Code, la extensión "Live Server" hace lo mismo con un clic.

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en tu cuenta de GitHub (puede ser público o
   privado; si es privado necesitarás GitHub Pro/Team/Edu para activar Pages).
2. Sube todo el contenido de esta carpeta a la raíz del repositorio:
   ```bash
   cd operaciones-basicas
   git init
   git add .
   git commit -m "Primera versión del sitio"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
   git push -u origin main
   ```
3. En GitHub, ve a **Settings → Pages**.
4. En "Build and deployment", elige **Deploy from a branch**, rama `main`,
   carpeta `/ (root)`. Guarda.
5. En un par de minutos tu web estará publicada en
   `https://TU-USUARIO.github.io/TU-REPOSITORIO/`.

## Publicar contenido nuevo a partir de ahora

Cada vez que quieras subir un tema nuevo:
```bash
# edita data/temas.json y añade tus PDFs a materiales/
git add .
git commit -m "Añadir tema: nombre del tema"
git push
```
GitHub Pages se actualiza sola en uno o dos minutos tras cada `push`.

## Ideas para ampliar más adelante

- Añadir un buscador/filtro por palabra clave en el índice.
- Guardar en el navegador (con `localStorage`) qué actividades ha completado
  cada alumno, para que vean su progreso.
- Añadir un tipo de actividad "ordenar pasos" (arrastrar una secuencia de
  pasos hasta ponerlos en el orden correcto).
- Sustituir `data/temas.json` por varios ficheros (uno por tema) si la lista
  crece mucho, para que los `git diff` sean más pequeños.
