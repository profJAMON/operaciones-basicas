/* Pinta la barra lateral (Temario), compartida entre index.html y
   tema.html. Recorre data/curso.json y, para cada sesion, carga
   data/unidades/<unidad>/<id>.json solo para obtener su titulo.
   idActivo: id de la sesion que se esta viendo ahora mismo (o null
   en la portada), para marcarla como activa en la lista. */

async function cargarBarraLateral(idActivo) {
    const contenedor = document.getElementById('indice-temas');
    if (!contenedor) return;

  try {
        const curso = await (await fetch('data/curso.json')).json();
        const unidades = curso.unidades || [];

      if (unidades.length === 0) {
              contenedor.innerHTML = '<p class="vacio">Todavia no hay unidades publicadas.</p>';
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

          const bloque = document.createElement('div');
              bloque.className = 'unidad-nav';

          const titulo = document.createElement('p');
              titulo.className = 'unidad-nav__titulo';
              titulo.textContent = unidad.titulo;
              bloque.appendChild(titulo);

          const lista = document.createElement('ul');
              lista.className = 'sesiones-nav';

          sesiones.forEach(sesion => {
                    if (!sesion) return;
                    const item = document.createElement('li');
                    const enlace = document.createElement('a');
                    enlace.href = `tema.html?id=${encodeURIComponent(sesion.id)}`;
                    enlace.textContent = sesion.titulo;
                    enlace.className = 'sesion-nav-link';
                    if (sesion.id === idActivo) enlace.classList.add('activo');
                    item.appendChild(enlace);
                    lista.appendChild(item);
          });

          bloque.appendChild(lista);
              contenedor.appendChild(bloque);
      }
  } catch (error) {
        contenedor.innerHTML = '<p class="vacio">No se ha podido cargar el temario.</p>';
        console.error(error);
  }
}
