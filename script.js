/*
=============================================
🔥 NEON ASCENSION: LIFE RPG TERMINAL (FULL GAME)
=============================================
A full browser RPG engine with:
- Combat system
- Inventory + Equipment
- Shops + Economy
- Quests + Story
- Skills + Leveling
- Enemies + Boss fights
- Save/Load system
- Random events
- UI HUD updates

Made by: Sadab Alif
=============================================
*/

const input = document.getElementById("input");
const output = document.getElementById("output");
const sound = document.getElementById("typeSound");

// ===================== AUDIO =====================
const SFX = {
  type: new Audio("sounds/type.mp3"),
  coin: new Audio("sounds/coin.mp3"),
  hit: new Audio("sounds/hit.mp3"),
  level: new Audio("sounds/levelup.mp3"),
  win: new Audio("sounds/win.mp3")
};

function play(s) {
  if (!SFX[s]) return;
  SFX[s].currentTime = 0;
  SFX[s].play();
}

// ===================== GAME STATE =====================
let state = {
  name: "Adventurer",
  level: 1,
  xp: 0,
  hp: 100,
  gold: 50,
  energy: 100,

  inventory: [],
  equipped: { weapon: null, armor: null },

  skills: {
    strength: 1,
    defense: 1,
    luck: 1
  },

  quests: [],
  completed: [],

  enemiesDefeated: 0,
  bossUnlocked: false,

  day: 1
};

// ===================== SAVE SYSTEM =====================
function save() {
  localStorage.setItem("NEON_RPG", JSON.stringify(state));
}

function load() {
  const data = localStorage.getItem("NEON_RPG");
  if (data) state = JSON.parse(data);
}

// ===================== UI =====================
function print(text) {
  const div = document.createElement("div");
  div.textContent = text;
  output.appendChild(div);
  output.scrollTop = output.scrollHeight;
}

function updateHUD() {
  print(`LVL:${state.level} XP:${state.xp} HP:${state.hp} GOLD:${state.gold}`);
}

// ===================== CORE SYSTEM =====================
function xpGain(n) {
  state.xp += n;

  if (state.xp >= state.level * 100) {
    state.level++;
    state.xp = 0;
    play("level");
    print("🔥 LEVEL UP! You are now level " + state.level);
  }

  save();
}

function damage(n) {
  state.hp -= n;
  play("hit");

  if (state.hp <= 0) {
    state.hp = 100;
    state.gold = Math.max(0, state.gold - 20);
    print("☠ You died and respawned...");
  }
}

function goldGain(n) {
  state.gold += n;
  play("coin");
  save();
}

// ===================== ENEMY SYSTEM =====================
function fight() {
  const enemy = Math.random() > 0.5 ? "Bandit" : "Glitch Beast";
  print("⚔ Encounter: " + enemy);

  const win = Math.random() + state.skills.strength * 0.1 > 0.5;

  if (win) {
    print("✔ You defeated " + enemy);
    xpGain(30);
    goldGain(20);
    state.enemiesDefeated++;
    play("win");

    if (state.enemiesDefeated >= 5) {
      state.bossUnlocked = true;
      print("👑 Boss unlocked: DIGITAL OVERLORD");
    }
  } else {
    print("❌ You were hit!");
    damage(20);
  }

  save();
}

// ===================== BOSS =====================
function bossFight() {
  if (!state.bossUnlocked) return print("Boss not unlocked yet.");

  print("👑 BOSS FIGHT: DIGITAL OVERLORD");

  const win = Math.random() > 0.7;

  if (win) {
    print("🏆 YOU DEFEATED THE FINAL BOSS!");
    xpGain(100);
    goldGain(200);
    play("win");
  } else {
    print("💀 Boss crushed you...");
    damage(50);
  }
}

// ===================== SHOP =====================
function shop(item) {
  const items = {
    sword: 50,
    armor: 70,
    potion: 20
  };

  if (state.gold >= items[item]) {
    state.gold -= items[item];
    state.inventory.push(item);
    print("🛒 Bought " + item);
    play("coin");
  } else {
    print("Not enough gold");
  }

  save();
}

// ===================== QUEST =====================
function quest() {
  const quests = [
    "Defeat 3 enemies",
    "Find treasure",
    "Train strength"
  ];

  const q = quests[Math.floor(Math.random() * quests.length)];
  state.quests.push(q);

  print("📜 Quest: " + q);
  xpGain(10);
  save();
}

// ===================== COMMAND SYSTEM =====================
function process(cmd) {
  print("> " + cmd);

  const p = cmd.split(" ");
  const c = p[0];
  const a = p.slice(1);

  switch (c) {

    case "help":
      print("fight, boss, shop, buy, quest, stats, heal");
      break;

    case "fight":
      fight();
      break;

    case "boss":
      bossFight();
      break;

    case "shop":
      print("Items: sword(50), armor(70), potion(20)");
      break;

    case "buy":
      shop(a[0]);
      break;

    case "quest":
      quest();
      break;

    case "stats":
      print(JSON.stringify(state, null, 2));
      break;

    case "heal":
      state.hp = 100;
      print("💚 Healed");
      break;

    default:
      print("Unknown command");
  }

  save();
  updateHUD();
}

// ===================== INPUT =====================
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    play("type");
    process(input.value);
    input.value = "";
  }
});

// ===================== INIT =====================
load();
print("=================================");
print("🔥 NEON ASCENSION RPG LOADED");
print("Made by Sadab Alif");
print("Type help to begin");
print("=================================");
updateHUD();
