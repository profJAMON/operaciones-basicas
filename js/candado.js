/* ============================================================
   Candado de acceso — pantalla de contraseña muy simple.

   IMPORTANTE: esto es solo un filtro disuasorio para que la web
   no aparezca abierta a cualquiera que pase por el enlace. NO es
   seguridad real: el sitio sigue publicado en una URL pública de
   GitHub Pages, y cualquier persona con conocimientos técnicos
   puede saltarse esto leyendo el código fuente. No lo uses para
   proteger información sensible.

   Para cambiar la contraseña:
   1. Abre la consola del navegador (F12) en cualquier página.
   2. Ejecuta:
        crypto.subtle.digest('SHA-256', new TextEncoder().encode('tu-nueva-contraseña'))
          .then(b => console.log(Array.from(new Uint8Array(b))
          .map(x => x.toString(16).padStart(2,'0')).join('')))
   3. Copia el texto largo que aparece y pégalo abajo en HASH_ESPERADO.
   ============================================================ */

(function () {
  const HASH_ESPERADO = 'dff13cf08c213d9b5434334963ad6bc93e4f5a1ff986c688d4654e43fbddddbf'; // contraseña provisional: operaciones2026
  const CLAVE_SESION = 'opbasicas_acceso_ok';

  if (sessionStorage.getItem(CLAVE_SESION) === '1') return;

  document.addEventListener('DOMContentLoaded', () => {
    document.body.style.overflow = 'hidden';

    const candado = document.createElement('div');
    candado.className = 'candado';
    candado.innerHTML = `
      <form class="candado__caja" id="candado-form">
        <p class="candado__etiqueta">Operaciones Básicas</p>
        <label class="candado__texto" for="candado-input">Introduce la contraseña para entrar</label>
        <input class="candado__input" type="password" id="candado-input" autocomplete="off" autofocus />
        <button type="submit" class="boton">Entrar</button>
        <p class="candado__error" id="candado-error" hidden>Contraseña incorrecta, inténtalo de nuevo.</p>
      </form>`;
    document.body.appendChild(candado);

    document.getElementById('candado-form').addEventListener('submit', async (evento) => {
      evento.preventDefault();
      const valor = document.getElementById('candado-input').value;
      const hash = await calcularHash(valor);
      if (hash === HASH_ESPERADO) {
        sessionStorage.setItem(CLAVE_SESION, '1');
        candado.remove();
        document.body.style.overflow = '';
      } else {
        document.getElementById('candado-error').hidden = false;
        document.getElementById('candado-input').value = '';
      }
    });
  });

  async function calcularHash(texto) {
    const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto));
    return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
})();
