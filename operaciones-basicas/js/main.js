/* Pinta el índice de unidades y sesiones en index.html a partir de data/temas.json */

async function cargarIndice() {
  const contenedor = document.getElementById('indice-temas');
  try {
    const respuesta = await fetch('data/temas.json');
    const datos = await respuesta.json();
    const unidades = datos.unidades || [];

    if (unidades.length === 0) {
      contenedor.innerHTML = '<p class="vacio">Todavía no hay unidades publicadas. Vuelve pronto.</p>';
      return;
    }

    unidades.forEach((unidad, indiceUnidad) => {
      const bloque = document.createElement('section');
      bloque.className = 'unidad';

      const cabecera = document.createElement('div');
      cabecera.className = 'unidad__cabecera';
      const titulo = document.createElement('h2');
      titulo.className = 'unidad__titulo';
      titulo.textContent = `Unidad ${indiceUnidad + 1} · ${unidad.titulo}`;
      cabecera.appendChild(titulo);
      if (unidad.descripcion) {
        const descripcion = document.createElement('p');
        descripcion.className = 'unidad__descripcion';
        descripcion.textContent = unidad.descripcion;
        cabecera.appendChild(descripcion);
      }
      bloque.appendChild(cabecera);

      const sesiones = unidad.sesiones || [];
      if (sesiones.length === 0) {
        const vacio = document.createElement('p');
        vacio.className = 'vacio';
        vacio.textContent = 'Todavía no hay sesiones publicadas en esta unidad.';
        bloque.appendChild(vacio);
      } else {
        const lista = document.createElement('div');
        lista.className = 'indice';

        const filaCabecera = document.createElement('div');
        filaCabecera.className = 'indice__cabecera';
        filaCabecera.innerHTML = '<span>Fecha</span><span>Sesión</span>';
        lista.appendChild(filaCabecera);

        sesiones.forEach(sesion => {
          const fila = document.createElement('a');
          fila.className = 'tema-fila';
          fila.href = `tema.html?id=${encodeURIComponent(sesion.id)}`;

          const fecha = document.createElement('span');
          fecha.className = 'tema-fila__fecha';
          fecha.textContent = formatearFecha(sesion.fecha);

          const cuerpo = document.createElement('div');
          const tituloSesion = document.createElement('p');
          tituloSesion.className = 'tema-fila__titulo';
          tituloSesion.textContent = sesion.titulo;
          const descripcionSesion = document.createElement('p');
          descripcionSesion.className = 'tema-fila__descripcion';
          descripcionSesion.textContent = sesion.descripcion || '';

          const meta = document.createElement('p');
          meta.className = 'tema-fila__meta';
          const nMateriales = (sesion.materiales || []).length;
          const nActividades = (sesion.actividades || []).length;
          meta.textContent = `${nMateriales} material(es) · ${nActividades} actividad(es)`;

          cuerpo.appendChild(tituloSesion);
          cuerpo.appendChild(descripcionSesion);
          cuerpo.appendChild(meta);

          fila.appendChild(fecha);
          fila.appendChild(cuerpo);
          lista.appendChild(fila);
        });

        bloque.appendChild(lista);
      }

      contenedor.appendChild(bloque);
    });
  } catch (error) {
    contenedor.innerHTML = '<p class="vacio">No se ha podido cargar el listado de unidades. Si estás probando el sitio en tu ordenador, recuerda abrirlo con un servidor local (ver README).</p>';
    console.error(error);
  }
}

function formatearFecha(iso) {
  const [anio, mes, dia] = iso.split('-');
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${dia} ${meses[parseInt(mes, 10) - 1]}`;
}

cargarIndice();
