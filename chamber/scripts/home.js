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

  const icon = document.createElement("img");
  icon.src = `https://openweathermap.org/img/wn/${w.icon}@2x.png`;
  icon.alt = w.description;
  icon.width = 64;
  icon.height = 64;
  document.querySelector(".current").prepend(icon);
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

  const list = document.querySelector("#forecast");
  list.replaceChildren();
  [...byDay.values()].slice(0, 3).forEach(({ item, d }) => {
    const li = document.createElement("li");
    const day = document.createElement("strong");
    day.textContent = `${d.toLocaleDateString("en-NG", { weekday: "long" })}: `;
    li.append(day, `${Math.round(item.main.temp)}\u00B0C`);
    list.append(li);
  });
}

// ---- Spotlights ----
const levelName = m => {
  const l = String(m.membership ?? m.membershipLevel ?? m.level).toLowerCase();
  return l === "3" ? "gold" : l === "2" ? "silver" : l;
};

function buildCard(m) {
  const level = levelName(m);
  const card = document.createElement("article");
  card.className = `spot card level-${level === "gold" ? 3 : 2}`;

  const name = document.createElement("h3");
  name.textContent = m.name;

  const logo = document.createElement("img");
  logo.src = m.image ?? m.logo;
  logo.alt = `${m.name} logo`;
  logo.loading = "lazy";
  logo.width = 120;
  logo.height = 120;

  const phone = document.createElement("p");
  phone.textContent = m.phone;

  const address = document.createElement("p");
  address.textContent = m.address;

  const site = document.createElement("p");
  const link = document.createElement("a");
  link.href = m.website ?? m.url;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = "Visit website";
  site.append(link);

  const badge = document.createElement("span");
  badge.className = "badge";
  badge.textContent = `${level[0].toUpperCase()}${level.slice(1)} member`;

  card.append(name, logo, phone, address, site, badge);
  return card;
}

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

    container.replaceChildren(...eligible.slice(0, count).map(buildCard));
  } catch (err) {
    console.error(err);
    container.textContent = "Member spotlights are unavailable right now.";
  }
}

loadWeather();
loadSpotlights();
