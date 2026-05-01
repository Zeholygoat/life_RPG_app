const input = document.getElementById("input");
const output = document.getElementById("output");
const sound = document.getElementById("typeSound");

const ui = {
  level: document.getElementById("level"),
  xp: document.getElementById("xp"),
  hp: document.getElementById("hp"),
  gold: document.getElementById("gold"),
  energy: document.getElementById("energy"),
  inventory: document.getElementById("inventory")
};

// ================= STATE =================
let state = {
  level: 1,
  xp: 0,
  hp: 100,
  gold: 50,
  energy: 100,
  inventory: []
};

// ================= UI UPDATE =================
function updateUI() {
  ui.level.textContent = state.level;
  ui.xp.textContent = state.xp;
  ui.hp.textContent = state.hp;
  ui.gold.textContent = state.gold;
  ui.energy.textContent = state.energy;

  ui.inventory.innerHTML = state.inventory.length
    ? state.inventory.map(i => "• " + i).join("<br>")
    : "Empty";
}

// ================= OUTPUT =================
function print(text) {
  const line = document.createElement("div");
  line.textContent = text;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

// ================= CORE SYSTEM =================
function addXP(amount) {
  state.xp += amount;

  if (state.xp >= state.level * 100) {
    state.level++;
    state.xp = 0;
    print("🔥 LEVEL UP → " + state.level);
  }

  updateUI();
}

function addGold(amount) {
  state.gold += amount;
  updateUI();
}

function damage(amount) {
  state.hp -= amount;
  if (state.hp <= 0) {
    state.hp = 100;
    state.gold = Math.max(0, state.gold - 20);
    print("☠ You died and respawned!");
  }
  updateUI();
}

// ================= COMMANDS =================
function process(cmd) {
  print("> " + cmd);

  let args = cmd.split(" ");
  let main = args[0];

  switch (main) {

    case "help":
      print("Commands: quest, fight, loot, shop, buy, heal, stats");
      break;

    case "quest":
      print("🧭 Quest completed!");
      addXP(20);
      addGold(10);
      break;

    case "fight":
      print("⚔ Fighting enemy...");
      Math.random() > 0.5
        ? (print("Victory!"), addXP(30), addGold(20))
        : (print("You got hit!"), damage(20));
      break;

    case "loot":
      let item = "Sword";
      state.inventory.push(item);
      print("🎒 Found: " + item);
      updateUI();
      break;

    case "shop":
      print("Shop: potion(20), sword(50)");
      break;

    case "buy":
      if (args[1] === "potion" && state.gold >= 20) {
        state.gold -= 20;
        state.inventory.push("Potion");
        print("Bought Potion");
      }
      updateUI();
      break;

    case "heal":
      state.hp = 100;
      print("💚 Healed");
      updateUI();
      break;

    case "stats":
      print(`LVL ${state.level} | XP ${state.xp} | HP ${state.hp} | GOLD ${state.gold}`);
      break;

    default:
      print("Unknown command. Type help.");
  }

  updateUI();
}

// ================= INPUT =================
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    process(input.value);
    input.value = "";
  }
});

input.addEventListener("keypress", () => {
  sound.currentTime = 0;
  sound.play();
});

// ================= INIT =================
print("🔥 Life RPG Terminal Loaded");
print("Type 'help' to start");
updateUI();
