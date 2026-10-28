const dishes = [
  {name:"Truffle Mushroom Pasta",description:"พาสต้าเห็ดทรัฟเฟิลหอมละมุน ซอสเข้มข้นและพาร์เมซานชีส",price:289,image:"https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=700&q=85",alt:"พาสต้าเห็ดทรัฟเฟิล"},
  {name:"Garden Glow Salad",description:"ผักสดตามฤดูกาล น้ำสลัดซิตรัสรสสดชื่น",price:189,image:"https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=85",alt:"สลัดผักสด"},
  {name:"Black Angus Burger",description:"เนื้อแองกัสย่างฉ่ำ ชีสและซอสสูตรพิเศษ",price:259,image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=85",alt:"เบอร์เกอร์เนื้อ"},
  {name:"Salmon Donburi",description:"ข้าวญี่ปุ่นนุ่ม ๆ เสิร์ฟพร้อมแซลมอนและซอสโชยุ",price:239,image:"https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=700&q=85",alt:"ข้าวหน้าปลาแซลมอน"},
  {name:"Four Cheese Pizza",description:"พิซซ่าอบร้อน แป้งบางกรอบกับชีส 4 ชนิด",price:319,image:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=700&q=85",alt:"พิซซ่าหน้าชีส"},
  {name:"Midnight Chocolate Cake",description:"เค้กช็อกโกแลตเนื้อฉ่ำ รสเข้มข้นกำลังดี",price:149,image:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=85",alt:"เค้กช็อกโกแลต"}
];

const $ = (selector) => document.querySelector(selector);
const randomButton = $("#randomButton");
const favoriteStorageKey = "noir-table-favorites";
const messageStorageKey = "noir-table-messages";

function readStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function pickRandomDish() {
  const currentName = $("#featuredName").textContent;
  let choices = dishes.filter(dish => dish.name !== currentName);
  if (!choices.length) choices = dishes;
  const dish = choices[Math.floor(Math.random() * choices.length)];
  $("#featuredName").textContent = dish.name;
  $("#featuredDescription").textContent = dish.description;
  $("#featuredPrice").textContent = `฿${dish.price}`;
  const image = $("#featuredImage");
  image.src = dish.image;
  image.alt = dish.alt;
  $("#featuredPick").classList.remove("picked");
  void $("#featuredPick").offsetWidth;
  $("#featuredPick").classList.add("picked");
}

randomButton.addEventListener("click", pickRandomDish);

function updateFavoriteButtons() {
  const favorites = readStorage(favoriteStorageKey, []);
  document.querySelectorAll(".food-card").forEach(card => {
    const id = Number(card.dataset.id);
    const button = card.querySelector(".favorite-btn");
    const active = favorites.includes(id);
    button.setAttribute("aria-pressed", String(active));
    button.textContent = active ? "♥" : "♡";
  });
}

document.querySelectorAll(".favorite-btn").forEach(button => {
  button.addEventListener("click", () => {
    const card = button.closest(".food-card");
    const id = Number(card.dataset.id);
    let favorites = readStorage(favoriteStorageKey, []);
    favorites = favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id];
    localStorage.setItem(favoriteStorageKey, JSON.stringify(favorites));
    updateFavoriteButtons();
  });
});
updateFavoriteButtons();

$("#contactForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const entry = {
    name: $("#name").value.trim(),
    email: $("#email").value.trim(),
    message: $("#message").value.trim(),
    createdAt: new Date().toISOString()
  };
  if (!entry.name || !entry.email || !entry.message) return;
  const messages = readStorage(messageStorageKey, []);
  messages.push(entry);
  localStorage.setItem(messageStorageKey, JSON.stringify(messages));
  form.reset();
  $("#formStatus").textContent = "บันทึกข้อความเรียบร้อยแล้ว ✓";
});

const menuToggle = $("#menuToggle");
const navLinks = $("#navLinks");
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "ปิดเมนู" : "เปิดเมนู");
});
navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

$("#year").textContent = new Date().getFullYear();
