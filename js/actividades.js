/* ============================================================
   Motor de actividades interactivas.
   Cada función recibe un contenedor <div> y el objeto de datos
   de la actividad (tal y como aparece en data/temas.json) y
   pinta la actividad dentro de ese contenedor.

   Para añadir un nuevo tipo de actividad en el futuro:
   1. Escribe una función renderNombreDelTipo(contenedor, datos)
   2. Regístrala en el objeto RENDERERS al final del fichero
   ============================================================ */

function crearElemento(etiqueta, clase, texto) {
  const el = document.createElement(etiqueta);
  if (clase) el.className = clase;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

/* ---------- Quiz de opción múltiple ---------- */

function renderQuiz(contenedor, datos) {
  const wrapper = crearElemento('div');
  const preguntasEl = [];

  (datos.preguntas || []).forEach((preg, i) => {
    const bloque = crearElemento('div', 'pregunta');
    bloque.appendChild(crearElemento('p', 'pregunta__enunciado', `${i + 1}. ${preg.pregunta}`));

    const opcionesEl = crearElemento('div', 'opciones');
    const botones = [];
    const estadoPregunta = { acertada: null };

    preg.opciones.forEach((texto, idx) => {
      const boton = crearElemento('button', 'opcion', texto);
      boton.type = 'button';
      boton.addEventListener('click', () => {
        botones.forEach(b => b.disabled = true);
        estadoPregunta.acertada = idx === preg.correcta;
        if (idx === preg.correcta) {
          boton.classList.add('correcta');
        } else {
          boton.classList.add('incorrecta');
          botones[preg.correcta].classList.add('correcta');
        }
        actualizarResultado();
      });
      botones.push(boton);
      opcionesEl.appendChild(boton);
    });

    bloque.appendChild(opcionesEl);
    wrapper.appendChild(bloque);
    preguntasEl.push(estadoPregunta);
  });

  const resultado = crearElemento('p', 'quiz__resultado', '');
  wrapper.appendChild(resultado);

  function actualizarResultado() {
    const respondidas = preguntasEl.filter(p => p.acertada !== null);
    if (respondidas.length < preguntasEl.length) return;
    const aciertos = preguntasEl.filter(p => p.acertada).length;
    resultado.textContent = `Resultado: ${aciertos} de ${preguntasEl.length} correctas.`;
  }

  contenedor.appendChild(wrapper);
}

/* ---------- Relacionar por clics ---------- */

function renderRelacionar(contenedor, datos) {
  const wrapper = crearElemento('div', 'relacionar');
  const pares = datos.pares || [];

  const izquierda = pares.map((p, i) => ({ texto: p.izquierda, grupo: i }));
  const derecha = pares.map((p, i) => ({ texto: p.derecha, grupo: i }));
  derecha.sort(() => Math.random() - 0.5);

  const colIzq = crearElemento('div', 'relacionar__columna');
  const colDer = crearElemento('div', 'relacionar__columna');

  let seleccionActual = null;
  let aciertos = 0;

  const estado = crearElemento('p', 'relacionar__estado', `0 de ${pares.length} emparejados correctamente.`);

  function comprobar(fichaIzq, fichaDer) {
    const acierto = fichaIzq.dataset.grupo === fichaDer.dataset.grupo;
    if (acierto) {
      fichaIzq.classList.remove('seleccionada');
      fichaIzq.classList.add('emparejada-correcta');
      fichaDer.classList.add('emparejada-correcta');
      fichaIzq.disabled = true;
      fichaDer.disabled = true;
      aciertos++;
      estado.textContent = aciertos === pares.length
        ? `¡Completado! ${aciertos} de ${pares.length} emparejados correctamente.`
        : `${aciertos} de ${pares.length} emparejados correctamente.`;
    } else {
      [fichaIzq, fichaDer].forEach(f => {
        f.classList.remove('seleccionada');
        f.classList.add('emparejada-error');
        setTimeout(() => f.classList.remove('emparejada-error'), 500);
      });
    }
    seleccionActual = null;
  }

  izquierda.forEach(item => {
    const ficha = crearElemento('button', 'ficha', item.texto);
    ficha.type = 'button';
    ficha.dataset.grupo = item.grupo;
    ficha.dataset.lado = 'izq';
    ficha.addEventListener('click', () => {
      if (ficha.disabled) return;
      colIzq.querySelectorAll('.ficha').forEach(f => f.classList.remove('seleccionada'));
      ficha.classList.add('seleccionada');
      seleccionActual = ficha;
    });
    colIzq.appendChild(ficha);
  });

  derecha.forEach(item => {
    const ficha = crearElemento('button', 'ficha', item.texto);
    ficha.type = 'button';
    ficha.dataset.grupo = item.grupo;
    ficha.dataset.lado = 'der';
    ficha.addEventListener('click', () => {
      if (ficha.disabled || !seleccionActual) return;
      comprobar(seleccionActual, ficha);
    });
    colDer.appendChild(ficha);
  });

  wrapper.appendChild(colIzq);
  wrapper.appendChild(colDer);
  wrapper.appendChild(estado);
  contenedor.appendChild(wrapper);
}

const RENDERERS = {
  quiz: renderQuiz,
  relacionar: renderRelacionar,
};

function renderActividad(contenedor, actividad) {
  const render = RENDERERS[actividad.tipo];
  const caja = crearElemento('div', 'actividad');
  caja.appendChild(crearElemento('h3', 'actividad__titulo', actividad.titulo || ''));
  if (render) {
    render(caja, actividad);
  } else {
    caja.appendChild(crearElemento('p', null, `Tipo de actividad desconocido: "${actividad.tipo}".`));
  }
  contenedor.appendChild(caja);
}
