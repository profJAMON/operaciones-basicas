/* Pinta el índice de temas en index.html a partir de data/temas.json */

async function cargarIndice() {
  const contenedor = document.getElementById('indice-temas');
  try {
    const respuesta = await fetch('data/temas.json');
    const datos = await respuesta.json();
    const temas = [...(datos.temas || [])].sort((a, b) => b.fecha.localeCompare(a.fecha));

    if (temas.length === 0) {
      contenedor.innerHTML = '<p class="vacio">Todavía no hay temas publicados. Vuelve pronto.</p>';
      return;
    }

    const cabecera = document.createElement('div');
    cabecera.className = 'indice__cabecera';
    cabecera.innerHTML = '<span>Fecha</span><span>Tema</span>';
    contenedor.appendChild(cabecera);

    temas.forEach(tema => {
      const fila = document.createElement('a');
      fila.className = 'tema-fila';
      fila.href = `tema.html?id=${encodeURIComponent(tema.id)}`;

      const fecha = document.createElement('span');
      fecha.className = 'tema-fila__fecha';
      fecha.textContent = formatearFecha(tema.fecha);

      const cuerpo = document.createElement('div');
      const titulo = document.createElement('p');
      titulo.className = 'tema-fila__titulo';
      titulo.textContent = tema.titulo;
      const descripcion = document.createElement('p');
      descripcion.className = 'tema-fila__descripcion';
      descripcion.textContent = tema.descripcion || '';

      const meta = document.createElement('p');
      meta.className = 'tema-fila__meta';
      const nMateriales = (tema.materiales || []).length;
      const nActividades = (tema.actividades || []).length;
      meta.textContent = `${nMateriales} material(es) · ${nActividades} actividad(es)`;

      cuerpo.appendChild(titulo);
      cuerpo.appendChild(descripcion);
      cuerpo.appendChild(meta);

      fila.appendChild(fecha);
      fila.appendChild(cuerpo);
      contenedor.appendChild(fila);
    });
  } catch (error) {
    contenedor.innerHTML = '<p class="vacio">No se ha podido cargar el listado de temas. Si estás probando el sitio en tu ordenador, recuerda abrirlo con un servidor local (ver README).</p>';
    console.error(error);
  }
}

function formatearFecha(iso) {
  const [anio, mes, dia] = iso.split('-');
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${dia} ${meses[parseInt(mes, 10) - 1]}`;
}

cargarIndice();
