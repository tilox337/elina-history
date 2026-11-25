const main = document.querySelector("main"),
  nav = document.querySelector("nav"),
  menu = document.querySelector(".menu");
const questions = [
  [
    "Когда была принята Декларация о государственном суверенитете БССР?",
    ["27 июля 1990 года", "25 августа 1991 года", "15 марта 1994 года"],
    0,
    "Декларация принята 27 июля 1990 года. Конституционный статус она получила 25 августа 1991 года.",
  ],
  [
    "Что произошло 19 сентября 1991 года?",
    [
      "Создано СНГ",
      "Утверждено название «Республика Беларусь»",
      "Принята Конституция",
    ],
    1,
    "19 сентября 1991 года было утверждено новое название государства.",
  ],
  [
    "Кто подписал Беловежское соглашение?",
    [
      "Беларусь, Россия и Украина",
      "Все 15 союзных республик",
      "Беларусь, Польша и Литва",
    ],
    0,
    "8 декабря 1991 года соглашение подписали представители Беларуси, России и Украины.",
  ],
  [
    "Что стало одной из причин экономического спада?",
    [
      "Расширение общего союзного рынка",
      "Разрыв производственных связей",
      "Отсутствие промышленности в БССР",
    ],
    1,
    "Белорусская промышленность зависела от общесоюзных поставок и рынков. Нарушение этих связей осложнило производство.",
  ],
  [
    "Как инфляция влияет на покупательную способность денег?",
    ["Повышает её", "Не меняет её", "Снижает её"],
    2,
    "При росте общего уровня цен на ту же сумму денег можно купить меньше товаров и услуг.",
  ],
  [
    "Какое событие относится к 15 марта 1994 года?",
    [
      "Принятие Конституции Республики Беларусь",
      "Введение расчётных билетов",
      "Подписание Беловежского соглашения",
    ],
    0,
    "Конституция принята 15 марта 1994 года. Первые президентские выборы состоялись позднее, летом 1994 года.",
  ],
];
function render() {
  const id = location.hash.slice(1) || "home";
  if (
    !document.getElementById(id) ||
    !["home", "theory", "practice", "quiz", "about", "sources"].includes(id)
  ) {
    document.getElementById(id)?.scrollIntoView();
    return;
  }
  main.replaceChildren(document.getElementById(id).content.cloneNode(true));
  document.querySelectorAll("nav a").forEach((a) => {
    a.classList.toggle("active", a.hash === "#" + id);
    if (a.hash === "#" + id) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  nav.classList.remove("open");
  menu.setAttribute("aria-expanded", "false");
  window.scrollTo(0, 0);
  document.title =
    {
      home: "Распад СССР",
      theory: "Теория",
      practice: "Практика",
      quiz: "Проверь себя",
      about: "О создателе",
      sources: "Источники",
    }[id] + " · Беларусь, 1990–1994";
  if (id === "practice") {
    const t = document.querySelector("textarea");
    try {
      t.value = localStorage.getItem("history-note") || "";
      t.addEventListener("input", () => {
        try {
          localStorage.setItem("history-note", t.value);
        } catch {}
      });
    } catch {}
  }
  if (id === "quiz") buildQuiz();
}
function buildQuiz() {
  const f = document.querySelector("#test");
  questions.forEach((q, i) => {
    const field = document.createElement("fieldset");
    field.innerHTML =
      `<legend>${i + 1}. ${q[0]}</legend>` +
      q[1]
        .map(
          (o, j) =>
            `<label><input type="radio" name="q${i}" value="${j}" required><span>${o}</span></label>`,
        )
        .join("");
    f.append(field);
  });
  f.insertAdjacentHTML(
    "beforeend",
    '<button class="button" type="submit">Проверить ответы</button> <button class="button" type="reset">Начать заново</button>',
  );
  f.addEventListener("submit", (e) => {
    e.preventDefault();
    let score = 0;
    f.querySelectorAll(".feedback").forEach((x) => x.remove());
    questions.forEach((q, i) => {
      const ok = Number(new FormData(f).get("q" + i)) === q[2];
      if (ok) score++;
      const p = document.createElement("div");
      p.className = "feedback" + (ok ? "" : " wrong");
      p.textContent =
        (ok ? "Верно. " : "Правильный ответ: " + q[1][q[2]] + ". ") + q[3];
      f.querySelectorAll("fieldset")[i].append(p);
    });
    document.querySelector("#result").innerHTML =
      `<div class="result-box"><h2>Ваш результат: ${score} из ${questions.length}</h2><p>${score === 6 ? "Отлично! Вы усвоили основные события и понятия." : "Разберите пояснения и вернитесь к теории, чтобы закрепить материал."}</p><a href="#theory">Повторить теорию</a></div>`;
    document.querySelector("#result").scrollIntoView({ behavior: "smooth" });
  });
  f.addEventListener("reset", () => {
    f.querySelectorAll(".feedback").forEach((x) => x.remove());
    document.querySelector("#result").replaceChildren();
  });
}
menu.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menu.setAttribute("aria-expanded", String(open));
  menu.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
});
addEventListener("hashchange", render);
render();
