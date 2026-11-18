// ---- Settings ----
const API_KEY = "YOUR_OPENWEATHERMAP_KEY"; // paste your own key
const LAT = 6.4541;  // Lagos Island
const LON = 3.3947;
const MEMBERS_URL = "data/members.json";

// ---- Weather ----
async function loadWeather() {
  const base = "https://api.openweathermap.org/data/2.5";
  const params = `lat=${LAT}&lon=${LON}&units=metric&appid=${API_KEY}`;
  try {
    const [curRes, fcRes] = await Promise.all([
      fetch(`${base}/weather?${params}`),
      fetch(`${base}/forecast?${params}`)
    ]);
    if (!curRes.ok || !fcRes.ok) throw new Error("Weather request failed");
    displayCurrent(await curRes.json());
    displayForecast(await fcRes.json());
  } catch (err) {
    console.error(err);
    document.querySelector("#current-desc").textContent = "Weather is unavailable right now.";
  }
}

function displayCurrent(data) {
  const w = data.weather[0];
  document.querySelector("#current-temp").textContent = Math.round(data.main.temp);
  document.querySelector("#current-desc").textContent =
    w.description.replace(/\b\w/g, c => c.toUpperCase());
  const icon = document.querySelector("#weather-icon");
  icon.src = `https://openweathermap.org/img/wn/${w.icon}@2x.png`;
  icon.alt = w.description;
  icon.hidden = false;
}

function displayForecast(data) {
  // 3-hour steps: take the reading closest to noon for each of the next 3 days
  const today = new Date().toDateString();
  const byDay = new Map();
  for (const item of data.list) {
    const d = new Date(item.dt * 1000);
    if (d.toDateString() === today) continue;
    const key = d.toDateString();
    const gap = Math.abs(d.getHours() - 12);
    if (!byDay.has(key) || gap < byDay.get(key).gap) byDay.set(key, { item, gap, d });
  }
  const days = [...byDay.values()].slice(0, 3);
  document.querySelector("#forecast").innerHTML = days.map(({ item, d }) =>
    `<li><strong>${d.toLocaleDateString("en-NG", { weekday: "long" })}:</strong> ${Math.round(item.main.temp)}&deg;C</li>`
  ).join("");
}

// ---- Spotlights ----
const levelName = m => {
  const l = String(m.membership ?? m.membershipLevel ?? m.level).toLowerCase();
  return l === "3" ? "gold" : l === "2" ? "silver" : l;
};

async function loadSpotlights() {
  const container = document.querySelector("#spotlight-cards");
  try {
    const response = await fetch(MEMBERS_URL);
    if (!response.ok) throw new Error("Members request failed");
    const data = await response.json();
    const members = Array.isArray(data) ? data : data.members;

    const eligible = members.filter(m => ["gold", "silver"].includes(levelName(m)));
    for (let i = eligible.length - 1; i > 0; i--) {   // Fisher-Yates shuffle
      const j = Math.floor(Math.random() * (i + 1));
      [eligible[i], eligible[j]] = [eligible[j], eligible[i]];
    }
    const count = Math.min(eligible.length, Math.random() < 0.5 ? 2 : 3);

    container.innerHTML = eligible.slice(0, count).map(m => {
      const level = levelName(m);
      return `
      <article class="spot">
        <h3>${m.name}</h3>
        <img src="${m.image ?? m.logo}" alt="${m.name} logo" loading="lazy" width="120" height="120">
        <p>${m.phone}</p>
        <p>${m.address}</p>
        <p><a href="${m.website ?? m.url}" target="_blank" rel="noopener">Visit website</a></p>
        <span class="badge ${level}">${level[0].toUpperCase() + level.slice(1)} member</span>
      </article>`;
    }).join("");
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Member spotlights are unavailable right now.</p>";
  }
}

loadWeather();
loadSpotlights();
