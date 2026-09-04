/* Página de inicio.
   1. Pinta la barra lateral (Temario) — la hace js/sidebar.js.
   2. Pinta el índice de portada: una tarjeta desplegable por unidad,
      con sus sesiones dentro (título, descripción y cuántos
      materiales/actividades tiene). La primera unidad se abre sola;
      el resto quedan colapsadas para no saturar la portada cuando
      haya muchas unidades. */

cargarBarraLateral(null);
cargarIndicePortada();

async function cargarIndicePortada() {
  const contenedor = document.getElementById('indice-portada');
  if (!contenedor) return;

  try {
    const curso = await (await fetch('data/curso.json')).json();
    const unidades = curso.unidades || [];

    if (unidades.length === 0) {
      contenedor.innerHTML = '<p class="vacio">Todavía no hay unidades publicadas. Vuelve pronto.</p>';
      return;
    }

    unidades.forEach((unidad, indiceUnidad) => {
      const detalles = document.createElement('details');
      detalles.className = 'unidad-card';
      if (indiceUnidad === 0) detalles.open = true;

      const resumen = document.createElement('summary');

      const cabecera = document.createElement('div');
      const tituloUnidad = document.createElement('p');
      tituloUnidad.className = 'unidad-card__titulo';
      tituloUnidad.textContent = unidad.titulo;
      cabecera.appendChild(tituloUnidad);
      if (unidad.descripcion) {
        const descUnidad = document.createElement('p');
        descUnidad.className = 'unidad-card__descripcion';
        descUnidad.textContent = unidad.descripcion;
        cabecera.appendChild(descUnidad);
      }
      resumen.appendChild(cabecera);
      detalles.appendChild(resumen);

      const idsSesiones = unidad.sesiones || [];
      const lista = document.createElement('div');
      lista.className = 'sesiones-portada';

      if (idsSesiones.length === 0) {
        const vacio = document.createElement('p');
        vacio.className = 'vacio';
        vacio.textContent = 'Todavía no hay sesiones publicadas en esta unidad.';
        lista.appendChild(vacio);
      }

      detalles.appendChild(lista);
      contenedor.appendChild(detalles);

      Promise.all(
        idsSesiones.map(id =>
          fetch(`data/unidades/${unidad.id}/${id}.json`)
            .then(r => r.ok ? r.json() : null)
            .catch(() => null)
        )
      ).then(sesiones => {
        sesiones.forEach((sesion, i) => {
          if (!sesion) {
            console.error(`No se ha podido cargar la sesión "${idsSesiones[i]}"`);
            return;
          }
          lista.appendChild(crearFilaSesionPortada(sesion));
        });
      });
    });
  } catch (error) {
    contenedor.innerHTML = '<p class="vacio">No se ha podido cargar el listado de unidades. Si estás probando el sitio en tu ordenador, recuerda abrirlo con un servidor local (ver README).</p>';
    console.error(error);
  }
}

function crearFilaSesionPortada(sesion) {
  const fila = document.createElement('a');
  fila.className = 'sesion-portada';
  fila.href = `tema.html?id=${encodeURIComponent(sesion.id)}`;

  const cuerpo = document.createElement('div');
  const tituloSesion = document.createElement('p');
  tituloSesion.className = 'sesion-portada__titulo';
  tituloSesion.textContent = sesion.titulo;
  const descripcionSesion = document.createElement('p');
  descripcionSesion.className = 'sesion-portada__descripcion';
  descripcionSesion.textContent = sesion.descripcion || '';

  const meta = document.createElement('p');
  meta.className = 'sesion-portada__meta';
  const nMateriales = (sesion.materiales || []).length;
  const nActividades = (sesion.actividades || []).length;
  meta.textContent = `${nMateriales} material(es) · ${nActividades} actividad(es)`;

  cuerpo.appendChild(tituloSesion);
  cuerpo.appendChild(descripcionSesion);
  cuerpo.appendChild(meta);
  fila.appendChild(cuerpo);
  return fila;
}
