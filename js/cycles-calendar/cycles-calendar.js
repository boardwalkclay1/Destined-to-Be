// js/cycles-calendar/cycles-calendar.js

// ---------- NUMEROLOGY HELPERS ----------

function reduceNum(n) {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = n.toString().split("").reduce((a, b) => a + Number(b), 0);
  }
  return n;
}

function calcLifePath(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const sum = d.getDate() + (d.getMonth() + 1) + d.getFullYear();
  return reduceNum(sum);
}

function calcPersonalYear(birthDateStr, year) {
  if (!birthDateStr) return null;
  const b = new Date(birthDateStr);
  const sum = b.getDate() + (b.getMonth() + 1) + year;
  return reduceNum(sum);
}

function calcPersonalMonth(birthDateStr, year, month) {
  const py = calcPersonalYear(birthDateStr, year);
  if (!py) return null;
  return reduceNum(py + month);
}

function calcPersonalDay(birthDateStr, dateObj) {
  const pm = calcPersonalMonth(birthDateStr, dateObj.getFullYear(), dateObj.getMonth() + 1);
  if (!pm) return null;
  return reduceNum(pm + dateObj.getDate());
}

function calcUniversalDay(dateObj) {
  const sum = dateObj.getDate() + (dateObj.getMonth() + 1) + dateObj.getFullYear();
  return reduceNum(sum);
}

// ---------- STORAGE ----------

const BIRTH_KEY = "cyclesBirthDate";

function saveBirthDate(dateStr) {
  localStorage.setItem(BIRTH_KEY, dateStr);
}

function loadBirthDate() {
  return localStorage.getItem(BIRTH_KEY) || "";
}

// ---------- CALENDAR RENDER ----------

let currentYear;
let currentMonth; // 0-based

function renderCalendar() {
  const grid = document.getElementById("calendar-grid");
  const label = document.getElementById("calendar-label");
  const birthDateStr = loadBirthDate();

  grid.innerHTML = "";

  const firstDay = new Date(currentYear, currentMonth, 1);
  const startWeekday = firstDay.getDay(); // 0-6
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const monthName = firstDay.toLocaleString("default", { month: "long" });
  label.textContent = `${monthName.toUpperCase()} ${currentYear}`;

  const today = new Date();
  const isSameMonth = today.getFullYear() === currentYear && today.getMonth() === currentMonth;

  const showPD = document.getElementById("show-personal-day").checked;
  const showPM = document.getElementById("show-personal-month").checked;
  const showPY = document.getElementById("show-personal-year").checked;
  const showUD = document.getElementById("show-universal-day").checked;

  // Empty cells before first day
  for (let i = 0; i < startWeekday; i++) {
    const empty = document.createElement("div");
    grid.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(currentYear, currentMonth, day);

    const cell = document.createElement("div");
    cell.className = "calendar-day";

    if (isSameMonth && day === today.getDate()) {
      cell.classList.add("calendar-day-today");
    }

    const header = document.createElement("div");
    header.className = "calendar-day-header";

    const num = document.createElement("div");
    num.className = "calendar-day-number";
    num.textContent = day;

    const weekday = document.createElement("div");
    weekday.className = "calendar-day-weekday";
    weekday.textContent = dateObj.toLocaleString("default", { weekday: "short" });

    header.appendChild(num);
    header.appendChild(weekday);

    const labels = document.createElement("div");
    labels.className = "calendar-day-labels";

    const py = calcPersonalYear(birthDateStr, currentYear);
    const pm = calcPersonalMonth(birthDateStr, currentYear, currentMonth + 1);
    const pd = calcPersonalDay(birthDateStr, dateObj);
    const ud = calcUniversalDay(dateObj);

    if (showPD && pd) {
      const pill = document.createElement("span");
      pill.className = "cycle-pill personal-day";
      pill.textContent = `PD ${pd}`;
      labels.appendChild(pill);
    }

    if (showPM && pm) {
      const pill = document.createElement("span");
      pill.className = "cycle-pill personal-month";
      pill.textContent = `PM ${pm}`;
      labels.appendChild(pill);
    }

    if (showPY && py) {
      const pill = document.createElement("span");
      pill.className = "cycle-pill personal-year";
      pill.textContent = `PY ${py}`;
      labels.appendChild(pill);
    }

    if (showUD && ud) {
      const pill = document.createElement("span");
      pill.className = "cycle-pill universal-day";
      pill.textContent = `UD ${ud}`;
      labels.appendChild(pill);
    }

    cell.appendChild(header);
    cell.appendChild(labels);

    cell.addEventListener("click", () => {
      renderDayDetails(dateObj, { py, pm, pd, ud, birthDateStr });
    });

    grid.appendChild(cell);
  }
}

// ---------- DAY DETAILS ----------

function renderDayDetails(dateObj, { py, pm, pd, ud, birthDateStr }) {
  const container = document.getElementById("day-details");
  const dateStr = dateObj.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const lp = calcLifePath(birthDateStr);

  container.innerHTML = `
    <p><strong>${dateStr}</strong></p>
    <p><strong>Personal Year:</strong> ${py || "N/A"}</p>
    <p><strong>Personal Month:</strong> ${pm || "N/A"}</p>
    <p><strong>Personal Day:</strong> ${pd || "N/A"}</p>
    <p><strong>Universal Day:</strong> ${ud || "N/A"}</p>
    <p><strong>Your Life Path:</strong> ${lp || "N/A"}</p>
    <p class="tip">
      Personal Day reflects your micro‑theme for this date. Personal Month and Year show the larger arc.
      Universal Day is the global backdrop everyone is moving through.
    </p>
  `;
}

// ---------- INIT ----------

document.addEventListener("DOMContentLoaded", () => {
  const savedBirth = loadBirthDate();
  const birthInput = document.getElementById("birth-date");
  if (savedBirth) birthInput.value = savedBirth;

  const now = new Date();
  currentYear = now.getFullYear();
  currentMonth = now.getMonth();

  document.getElementById("save-birth").addEventListener("click", () => {
    const val = birthInput.value;
    if (val) {
      saveBirthDate(val);
      renderCalendar();
    }
  });

  document.getElementById("prev-month").addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar();
  });

  document.getElementById("next-month").addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar();
  });

  document.getElementById("show-personal-day").addEventListener("change", renderCalendar);
  document.getElementById("show-personal-month").addEventListener("change", renderCalendar);
  document.getElementById("show-personal-year").addEventListener("change", renderCalendar);
  document.getElementById("show-universal-day").addEventListener("change", renderCalendar);

  renderCalendar();
});
