/* ==========================================================
   MISIÓN YUPAY — mini-juegos
   <div class="game" data-game="tendencia|numeros"></div>
   ========================================================== */
(() => {
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const shuffle = arr => arr.map(v => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(v => v[1]);
  const fmt = n => Number.isInteger(n) ? String(n) : n.toFixed(1).replace(".", ",");
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const lcm = (a, b) => a / gcd(a, b) * b;
  const isPrime = n => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
  const divisors = n => { let c = 0; for (let i = 1; i <= n; i++) if (n % i === 0) c++; return c; };

  /* Genera 3 distractores numéricos distintos de la respuesta */
  function options(answer, spread = 4, min = 0) {
    const set = new Set([fmt(answer)]);
    let guard = 0;
    while (set.size < 4 && guard++ < 100) {
      let d = answer + rnd(-spread, spread) * (Number.isInteger(answer) ? 1 : 0.5);
      if (d < min) continue;
      set.add(fmt(d));
    }
    return shuffle([...set]);
  }

  const GENERATORS = {
    /* Medidas de tendencia central: media, mediana, moda */
    tendencia() {
      const tipo = ["media", "mediana", "moda"][rnd(0, 2)];
      const n = [5, 6, 7][rnd(0, 2)];
      let datos;
      if (tipo === "moda") {
        const m = rnd(2, 15);
        datos = [m, m, m];
        while (datos.length < n) { const v = rnd(1, 18); if (datos.filter(x => x === v).length < 1 && v !== m) datos.push(v); }
        datos = shuffle(datos);
        return { datos, q: "¿Cuál es la MODA? (el dato que más se repite)", answer: fmt(m), opts: options(m, 5, 1),
          why: `${m} aparece 3 veces, más que cualquier otro dato.` };
      }
      if (tipo === "media") {
        do { datos = Array.from({ length: n }, () => rnd(2, 20)); } while (datos.reduce((a, b) => a + b) % n !== 0);
        const s = datos.reduce((a, b) => a + b);
        const media = s / n;
        return { datos, q: "¿Cuál es la MEDIA aritmética (promedio)?", answer: fmt(media), opts: options(media, 4, 0),
          why: `Suma = ${s}; ${s} ÷ ${n} = ${fmt(media)}.` };
      }
      datos = Array.from({ length: n }, () => rnd(1, 25));
      const ord = [...datos].sort((a, b) => a - b);
      const med = n % 2 ? ord[(n - 1) / 2] : (ord[n / 2 - 1] + ord[n / 2]) / 2;
      return { datos, q: "¿Cuál es la MEDIANA? (ordena primero los datos)", answer: fmt(med), opts: options(med, 4, 0),
        why: `Ordenados: ${ord.join(", ")} → el centro es ${fmt(med)}.` };
    },

    /* Números primos, MCM, MCD y divisibilidad */
    numeros() {
      const tipo = rnd(0, 4);
      if (tipo === 0) {
        const pool = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53];
        const p = pool[rnd(0, pool.length - 1)];
        const comps = shuffle([4, 6, 8, 9, 10, 12, 14, 15, 21, 25, 27, 33, 35, 39, 49, 51, 57]).slice(0, 3);
        return { datos: [], q: "¿Cuál de estos números es PRIMO?", answer: String(p), opts: shuffle([p, ...comps].map(String)),
          why: `${p} solo es divisible entre 1 y ${p}.` };
      }
      if (tipo === 1) {
        let a, b;
        do { a = rnd(2, 15); b = rnd(2, 15); } while (a === b);
        const m = lcm(a, b);
        const set = new Set([m]);
        [a * b * 2, m + a, m + b, Math.abs(m - a), m * 2, gcd(a, b) + a].forEach(v => { if (set.size < 4 && v > 1) set.add(v); });
        return { datos: [a, b], q: `¿Cuál es el MCM de ${a} y ${b}?`, answer: String(m), opts: shuffle([...set].map(String)),
          why: `El menor número que es múltiplo de ${a} y de ${b} es ${m}.` };
      }
      if (tipo === 2) {
        const g = rnd(2, 9), a = g * rnd(2, 7), b = g * rnd(2, 7);
        const d = gcd(a, b);
        return { datos: [a, b], q: `¿Cuál es el MCD de ${a} y ${b}?`, answer: String(d), opts: options(d, 3, 1),
          why: `El mayor número que divide a ${a} y a ${b} es ${d}.` };
      }
      if (tipo === 3) {
        const k = [2, 3, 5, 9][rnd(0, 3)];
        const ok = k * rnd(11, 60);
        const bad = new Set();
        while (bad.size < 3) { const v = rnd(20, 400); if (v % k) bad.add(v); }
        const reglas = { 2: "termina en cifra par", 3: "la suma de sus cifras es múltiplo de 3", 5: "termina en 0 o 5", 9: "la suma de sus cifras es múltiplo de 9" };
        return { datos: [], q: `¿Cuál es divisible entre ${k}?`, answer: String(ok), opts: shuffle([ok, ...bad].map(String)),
          why: `${ok} ${reglas[k]}.` };
      }
      const n = [12, 18, 20, 24, 28, 30, 36, 40, 45, 48][rnd(0, 9)];
      const d = divisors(n);
      return { datos: [n], q: `¿Cuántos divisores tiene ${n}?`, answer: String(d), opts: options(d, 3, 2),
        why: `Divisores de ${n}: ${Array.from({ length: n }, (_, i) => i + 1).filter(i => n % i === 0).join(", ")}.` };
    },
  };

  const TITLES = {
    tendencia: ["📊 Reto de la Moda, Media y Mediana", "Responde 8 preguntas con datos al azar. ¡Cada respuesta correcta es un nudo en tu quipu!"],
    numeros: ["🔢 Misión Kits: el juego de los números", "Primos, MCM, MCD y divisibilidad. 8 retos para la Quipucamayoc más veloz."],
  };
  const ROUNDS = 8;

  document.querySelectorAll(".game[data-game]").forEach(root => {
    const kind = root.dataset.game;
    const gen = GENERATORS[kind];
    if (!gen) return;
    const [title, desc] = TITLES[kind];
    const bestKey = "best:" + kind;
    let round = 0, score = 0;

    function start() {
      const best = window.YupayStore ? window.YupayStore.get(bestKey, 0) : 0;
      root.innerHTML = `<h4>${title}</h4><div class="start"><p>${desc}</p>
        ${best ? `<p>🏅 Tu mejor puntaje: <b>${best}/${ROUNDS}</b></p>` : ""}
        <button class="btn small" type="button">¡Jugar! ⚡</button></div>`;
      root.querySelector("button").addEventListener("click", () => { round = 0; score = 0; next(); });
    }

    function next() {
      if (round >= ROUNDS) return finish();
      round++;
      const r = gen();
      root.innerHTML = `<h4>${title}</h4>
        <div class="hud"><span>Pregunta ${round}/${ROUNDS}</span><span>🧶 Nudos: ${score}</span></div>
        ${r.datos.length > 2 ? `<div class="datos" aria-label="Datos">${r.datos.map(d => `<span>${d}</span>`).join("")}</div>` : ""}
        <p class="pregunta">${r.q}</p>
        <div class="opciones">${r.opts.map(o => `<button type="button">${o}</button>`).join("")}</div>
        <p class="feedback" aria-live="polite"></p>`;
      const fb = root.querySelector(".feedback");
      root.querySelectorAll(".opciones button").forEach(b => b.addEventListener("click", () => {
        const ok = b.textContent === r.answer;
        root.querySelectorAll(".opciones button").forEach(x => {
          x.disabled = true;
          if (x.textContent === r.answer) x.classList.add("ok");
        });
        if (!ok) b.classList.add("bad"); else score++;
        fb.innerHTML = (ok ? "✅ ¡Correcto! " : "💪 ¡Casi! ") + r.why;
        setTimeout(next, ok ? 1500 : 2600);
      }));
    }

    function finish() {
      const store = window.YupayStore;
      const best = store ? store.get(bestKey, 0) : 0;
      if (store && score > best) store.set(bestKey, score);
      const msg = score === ROUNDS ? "🏆 ¡Perfecto! Eres Maestra de los Números."
        : score >= ROUNDS * 0.6 ? "🌟 ¡Muy bien! Sigue practicando."
        : "🛠️ Equivocarse es parte del entrenamiento. ¡Inténtalo otra vez!";
      root.innerHTML = `<h4>${title}</h4><div class="start">
        <p style="font-size:2.4rem;margin:0">${score}/${ROUNDS}</p><p>${msg}</p>
        <button class="btn small" type="button">Jugar de nuevo 🔁</button></div>`;
      root.querySelector("button").addEventListener("click", () => { round = 0; score = 0; next(); });
      if (score >= ROUNDS * 0.6 && window.YupayBurst) window.YupayBurst();
    }

    start();
  });
})();
