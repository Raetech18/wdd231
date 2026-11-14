const membersUrl = "data/members.json";
const container = document.querySelector("#members");
const gridBtn = document.querySelector("#grid-btn");
const listBtn = document.querySelector("#list-btn");

const levelNames = { 1: "Member", 2: "Silver", 3: "Gold" };

async function getMembers() {
  try {
    const response = await fetch(membersUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    displayMembers(data.members);
  } catch (error) {
    console.error("Could not load members:", error);
    container.innerHTML = "<p class=\"error\">Sorry, the member directory could not be loaded right now.</p>";
  }
}

function displayMembers(members) {
  container.innerHTML = "";
  members.forEach((m) => {
    const card = document.createElement("article");
    card.className = `card level-${m.membership}`;

    const img = document.createElement("img");
    img.src = `images/${m.image}`;
    img.alt = `${m.name} logo`;
    img.loading = "lazy";
    img.width = 300;
    img.height = 200;

    const body = document.createElement("div");
    body.className = "card-body";

    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = levelNames[m.membership] ?? "Member";

    const name = document.createElement("h2");
    name.textContent = m.name;

    const tagline = document.createElement("p");
    tagline.className = "tagline";
    tagline.textContent = m.tagline;

    const address = document.createElement("p");
    address.innerHTML = "<span class=\"label\">Address:</span> ";
    address.append(m.address);

    const phone = document.createElement("p");
    phone.innerHTML = "<span class=\"label\">Phone:</span> ";
    const tel = document.createElement("a");
    tel.href = `tel:${m.phone.replace(/[^\d+]/g, "")}`;
    tel.textContent = m.phone;
    phone.append(tel);

    const site = document.createElement("p");
    const link = document.createElement("a");
    link.href = m.website;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = m.website.replace(/^https?:\/\//, "");
    site.append(link);

    const desc = document.createElement("p");
    desc.className = "description";
    desc.textContent = `${m.description} (Est. ${m.founded})`;

    body.append(badge, name, tagline, address, phone, site, desc);
    card.append(img, body);
    container.append(card);
  });
}

function setView(view) {
  container.classList.toggle("grid", view === "grid");
  container.classList.toggle("list", view === "list");
  gridBtn.setAttribute("aria-pressed", String(view === "grid"));
  listBtn.setAttribute("aria-pressed", String(view === "list"));
}

gridBtn.addEventListener("click", () => setView("grid"));
listBtn.addEventListener("click", () => setView("list"));

getMembers();