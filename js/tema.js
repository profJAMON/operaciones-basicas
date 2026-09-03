/* Pinta tema.html a partir del parámetro ?id=.
   1. Pinta la barra lateral (Temario), marcando esta sesión como activa.
   2. Busca en data/curso.json a qué unidad pertenece.
   3. Carga el contenido completo desde data/unidades/<unidad>/<id>.json.
   4. Genera el índice "En esta página" a partir de los h2/h3 del contenido. */

const ICONOS = { pdf: 'PDF', enlace: 'WEB', video: 'VID' };

async function cargarTema() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const raiz = document.getElementById('tema-raiz');

  cargarBarraLateral(id);

  if (!id) {
    raiz.innerHTML = '<p class="vacio">No se ha especificado ninguna sesión.</p>';
    return;
  }

  try {
    const curso = await (await fetch('data/curso.json')).json();
    const unidadDeLaSesion = (curso.unidades || []).find(u => (u.sesiones || []).includes(id));

    if (!unidadDeLaSesion) {
      raiz.innerHTML = '<p class="vacio">No se ha encontrado esta sesión.</p>';
      return;
    }

    const sesionResp = await fetch(`data/unidades/${unidadDeLaSesion.id}/${id}.json`);

    if (!sesionResp.ok) {
      raiz.innerHTML = '<p class="vacio">No se ha encontrado esta sesión.</p>';
      return;
    }
    const tema = await sesionResp.json();

    document.title = `${tema.titulo} · Operaciones Básicas`;
    document.getElementById('tema-unidad').textContent = unidadDeLaSesion.titulo;
    document.getElementById('tema-titulo').textContent = tema.titulo;
    document.getElementById('tema-descripcion').textContent = tema.descripcion || '';

    pintarLeccion(tema.contenido);
    pintarMateriales(tema.materiales || []);
    pintarActividades(tema.actividades || []);
    pintarIndicePagina();
  } catch (error) {
    raiz.innerHTML = '<p class="vacio">No se ha podido cargar la sesión. Si estás probando el sitio en tu ordenador, recuerda abrirlo con un servidor local (ver README).</p>';
    console.error(error);
  }
}

function pintarLeccion(contenidoHtml) {
  if (!contenidoHtml) return;
  document.getElementById('leccion-contenido').innerHTML = contenidoHtml;
  document.getElementById('seccion-leccion').hidden = false;
}

function pintarMateriales(materiales) {
  const seccion = document.getElementById('seccion-materiales');
  const lista = document.getElementById('lista-materiales');

  if (materiales.length === 0) {
    seccion.hidden = true;
    return;
  }

  materiales.forEach(m => {
    const item = document.createElement('li');
    const enlace = document.createElement('a');
    enlace.className = 'material';
    enlace.href = m.url;
    enlace.target = '_blank';
    enlace.rel = 'noopener';

    const icono = document.createElement('span');
    icono.className = 'material__icono';
    icono.textContent = ICONOS[m.tipo] || 'DOC';

    const titulo = document.createElement('span');
    titulo.className = 'material__titulo';
    titulo.textContent = m.titulo;

    enlace.appendChild(icono);
    enlace.appendChild(titulo);
    item.appendChild(enlace);
    lista.appendChild(item);
  });
}

function pintarActividades(actividades) {
  const seccion = document.getElementById('seccion-actividades');
  const contenedor = document.getElementById('lista-actividades');

  if (actividades.length === 0) {
    seccion.hidden = true;
    return;
  }

  actividades.forEach(actividad => renderActividad(contenedor, actividad));
}

function pintarIndicePagina() {
  const aside = document.getElementById('indice-pagina');
  if (!aside) return;

  const encabezados = document.querySelectorAll('#leccion-contenido h2, #leccion-contenido h3');
  if (encabezados.length === 0) {
    aside.hidden = true;
    return;
  }

  const titulo = document.createElement('p');
  titulo.className = 'indice__titulo';
  titulo.textContent = 'En esta página';
  aside.appendChild(titulo);

  encabezados.forEach((h, i) => {
    if (!h.id) h.id = `seccion-${i}`;
    const enlace = document.createElement('a');
    enlace.href = `#${h.id}`;
    enlace.textContent = h.textContent;
    if (h.tagName === 'H3') enlace.classList.add('indice__sub');
    aside.appendChild(enlace);
  });
}

cargarTema();
