/* Pinta la barra lateral (Temario), compartida entre index.html y
   tema.html. Cada unidad es un <details> desplegable; se abre sola
   la que contiene la sesión activa. Recorre data/curso.json y, para
   cada sesión, carga data/unidades/<unidad>/<id>.json solo para
   obtener su título.
   idActivo: id de la sesión que se está viendo ahora mismo (o null
   en la portada), para marcarla como activa y abrir su unidad. */

async function cargarBarraLateral(idActivo) {
  const contenedor = document.getElementById('indice-temas');
  if (!contenedor) return;

  try {
    const curso = await (await fetch('data/curso.json')).json();
    const unidades = curso.unidades || [];

    if (unidades.length === 0) {
      contenedor.innerHTML = '<p class="vacio">Todavía no hay unidades publicadas.</p>';
      return;
    }

    for (const unidad of unidades) {
      const idsSesiones = unidad.sesiones || [];

      const sesiones = await Promise.all(
        idsSesiones.map(id =>
          fetch(`data/unidades/${unidad.id}/${id}.json`)
            .then(r => r.ok ? r.json() : null)
            .catch(() => null)
        )
      );

      const contieneActiva = sesiones.some(s => s && s.id === idActivo);

      const detalles = document.createElement('details');
      detalles.className = 'unidad';
      if (contieneActiva) detalles.open = true;

      const resumen = document.createElement('summary');
      resumen.textContent = unidad.titulo;
      detalles.appendChild(resumen);

      sesiones.forEach(sesion => {
        if (!sesion) return;
        const enlace = document.createElement('a');
        enlace.href = `tema.html?id=${encodeURIComponent(sesion.id)}`;
        enlace.textContent = sesion.titulo;
        enlace.className = 'sesion';
        if (sesion.id === idActivo) enlace.classList.add('activa');
        detalles.appendChild(enlace);
      });

      contenedor.appendChild(detalles);
    }
  } catch (error) {
    contenedor.innerHTML = '<p class="vacio">No se ha podido cargar el temario.</p>';
    console.error(error);
  }
}
