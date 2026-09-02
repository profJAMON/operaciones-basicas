/* Pinta tema.html a partir del parámetro ?id=.
   1. Busca en data/curso.json a qué unidad pertenece esa sesión.
   2. Carga el contenido completo desde data/sesiones/<id>.json. */

const ICONOS = { pdf: 'PDF', enlace: 'WEB', video: 'VID' };

async function cargarTema() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const raiz = document.getElementById('tema-raiz');

  if (!id) {
        raiz.innerHTML = '<p class="vacio">No se ha especificado ninguna sesión.</p>';
        return;
  }

  try {
        const [curso, sesionResp] = await Promise.all([
                fetch('data/curso.json').then(r => r.json()),
                fetch(`data/sesiones/${id}.json`)
              ]);

      if (!sesionResp.ok) {
              raiz.innerHTML = '<p class="vacio">No se ha encontrado esta sesión.</p>';
              return;
      }
        const tema = await sesionResp.json();

      const unidadDeLaSesion = (curso.unidades || []).find(u => (u.sesiones || []).includes(id));

      document.title = `${tema.titulo} · Operaciones Básicas`;
        if (unidadDeLaSesion) {
                document.getElementById('tema-unidad').textContent = unidadDeLaSesion.titulo;
        }
        document.getElementById('tema-titulo').textContent = tema.titulo;
        document.getElementById('tema-descripcion').textContent = tema.descripcion || '';

      pintarLeccion(tema.contenido);
        pintarMateriales(tema.materiales || []);
        pintarActividades(tema.actividades || []);
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

cargarTema();
