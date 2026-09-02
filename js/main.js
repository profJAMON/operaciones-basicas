/* Pinta el indice de unidades y sesiones en index.html.
   Lee data/curso.json (solo estructura) y luego un archivo por
   sesion en data/unidades/<unidad>/<id>.json (contenido completo). */

async function cargarIndice() {
     const contenedor = document.getElementById('indice-temas');
     try {
            const curso = await (await fetch('data/curso.json')).json();
            const unidades = curso.unidades || [];

       if (unidades.length === 0) {
                contenedor.innerHTML = '<p class="vacio">Todavia no hay unidades publicadas. Vuelve pronto.</p>';
                return;
       }

       for (let indiceUnidad = 0; indiceUnidad < unidades.length; indiceUnidad++) {
                const unidad = unidades[indiceUnidad];
                const bloque = document.createElement('section');
                bloque.className = 'unidad';

              const cabecera = document.createElement('div');
                cabecera.className = 'unidad__cabecera';
                const titulo = document.createElement('h2');
                titulo.className = 'unidad__titulo';
                titulo.textContent = `Unidad ${indiceUnidad + 1} - ${unidad.titulo}`;
                cabecera.appendChild(titulo);
                if (unidad.descripcion) {
                           const descripcion = document.createElement('p');
                           descripcion.className = 'unidad__descripcion';
                           descripcion.textContent = unidad.descripcion;
                           cabecera.appendChild(descripcion);
                }
                bloque.appendChild(cabecera);

              const idsSesiones = unidad.sesiones || [];
                if (idsSesiones.length === 0) {
                           const vacio = document.createElement('p');
                           vacio.className = 'vacio';
                           vacio.textContent = 'Todavia no hay sesiones publicadas en esta unidad.';
                           bloque.appendChild(vacio);
                           contenedor.appendChild(bloque);
                           continue;
                }

              const lista = document.createElement('div');
                lista.className = 'indice';
                const filaCabecera = document.createElement('div');
                filaCabecera.className = 'indice__cabecera';
                filaCabecera.innerHTML = '<span>Fecha</span><span>Sesion</span>';
                lista.appendChild(filaCabecera);
                bloque.appendChild(lista);
                contenedor.appendChild(bloque);

              // Cargamos cada sesion de la unidad (en paralelo) y las pintamos
              // en el mismo orden en que aparecen en curso.json.
              const sesiones = await Promise.all(
                         idsSesiones.map(id =>
                                      fetch(`data/unidades/${unidad.id}/${id}.json`)
                                                     .then(r => r.ok ? r.json() : null)
                                                     .catch(() => null)
                                                 )
                       );

              sesiones.forEach((sesion, i) => {
                         if (!sesion) {
                                      console.error(`No se ha podido cargar la sesion "${idsSesiones[i]}"`);
                                      return;
                         }
                         lista.appendChild(crearFilaSesion(sesion));
              });
       }
     } catch (error) {
            contenedor.innerHTML = '<p class="vacio">No se ha podido cargar el listado de unidades. Si estas probando el sitio en tu ordenador, recuerda abrirlo con un servidor local (ver README).</p>';
            console.error(error);
     }
}

function crearFilaSesion(sesion) {
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
     meta.textContent = `${nMateriales} material(es) - ${nActividades} actividad(es)`;

  cuerpo.appendChild(tituloSesion);
     cuerpo.appendChild(descripcionSesion);
     cuerpo.appendChild(meta);
     fila.appendChild(fecha);
     fila.appendChild(cuerpo);
     return fila;
}

function formatearFecha(iso) {
     const [anio, mes, dia] = iso.split('-');
     const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
     return `${dia} ${meses[parseInt(mes, 10) - 1]}`;
}

cargarIndice();
