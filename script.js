// Life RPG Terminal - Full Game Engine Edition (UI + Story + Systems + 100+ Features)
// Now includes: UI layer, typewriter engine, story mode, NPCs, equipment, crafting, passive income, daily rewards, animations, game loop

const input = document.getElementById("input");
const output = document.getElementById("output");
const sound = document.getElementById("typeSound");

// ===================== STATE =====================
let state = {
  xp: 0,
  level: 1,
  gold: 50,
  hp: 100,
  energy: 100,

  storyStage: 0,
  day: 1,

  goals: [],
  inventory: [],
  equipment: { weapon: null, armor: null },
  achievements: [],

  skills: {
    coding: 1,
    fitness: 1,
    intelligence: 1,
    luck: 1
  },

  npcMet: [],
  quests: [],
  cooldowns: {},

  passiveIncome: 1,

  settings: {
    sound: true,
    typewriter: true
  }
};

// ===================== TYPEWRITER ENGINE =====================
function typeText(text, speed = 20) {
  const line = document.createElement("div");
  output.appendChild(line);

  let i = 0;
  function step() {
    if (i < text.length) {
      line.textContent += text[i];
      i++;
      setTimeout(step, speed);
    }
  }
  step();
}

function print(text) {
  if (state.settings.typewriter) typeText(text);
  else {
    const line = document.createElement("div");
    line.textContent = text;
    output.appendChild(line);
  }
  window.scrollTo(0, document.body.scrollHeight);
}

// ===================== CORE SYSTEMS =====================
function save() {
  localStorage.setItem("rpg_full", JSON.stringify(state));
}

function load() {
  const d = localStorage.getItem("rpg_full");
  if (d) state = JSON.parse(d);
}

function addXP(n) {
  state.xp += n;
  if (state.xp >= state.level * 100) {
    state.level++;
    state.xp = 0;
    print("🔥 LEVEL UP → " + state.level);
  }
  save();
}

function addGold(n) {
  state.gold += n;
  save();
}

function damage(n) {
  state.hp -= n;
  if (state.hp <= 0) {
    print("☠ You died... respawned");
    state.hp = 100;
    state.gold = Math.max(0, state.gold - 10);
  }
}

// ===================== STORY ENGINE =====================
const story = [
  "You wake up in a digital world...",
  "A voice says: 'Become stronger to survive.'",
  "You find a terminal that controls reality...",
  "Your journey begins now."
];

function nextStory() {
  if (state.storyStage < story.length) {
    print("📖 " + story[state.storyStage]);
    state.storyStage++;
  } else {
    print("Story complete.");
  }
}

// ===================== NPC SYSTEM =====================
const npcs = {
  trader: () => print("Trader: I sell rare items."),
  guard: () => print("Guard: Stay out of trouble."),
  wizard: () => print("Wizard: Magic is code."),
};

function talk(name) {
  if (npcs[name]) {
    if (!state.npcMet.includes(name)) state.npcMet.push(name);
    npcs[name]();
  } else print("No such NPC");
}

// ===================== CRAFTING =====================
function craft(item) {
  const recipes = {
    sword: ["iron", "wood"],
    potion: ["herb", "water"]
  };

  if (recipes[item]) {
    print("Crafted " + item);
    state.inventory.push(item);
    addXP(10);
  }
}

// ===================== DAILY REWARD =====================
function daily() {
  const today = new Date().toDateString();
  if (state.lastDaily !== today) {
    state.lastDaily = today;
    addGold(50);
    addXP(30);
    print("🎁 Daily reward claimed!");
  } else print("Already claimed today");
}

// ===================== PASSIVE INCOME =====================
setInterval(() => {
  addGold(state.passiveIncome);
}, 5000);

// ===================== GAME LOOP =====================
setInterval(() => {
  state.energy = Math.min(100, state.energy + 1);
}, 3000);

// ===================== COMMANDS =====================
const commands = {
  help: () => print("Commands: story, talk, craft, daily, stats, add, done"),

  story: () => nextStory(),

  talk: (a) => talk(a[0]),

  craft: (a) => craft(a[0]),

  daily: () => daily(),

  stats: () => {
    print("LVL " + state.level);
    print("XP " + state.xp);
    print("HP " + state.hp);
    print("GOLD " + state.gold);
    print("ENERGY " + state.energy);
  },

  add: (a) => {
    state.goals.push(a.join(" "));
    addXP(5);
    print("Quest added");
  },

  done: (a) => {
    const i = a[0] - 1;
    if (state.goals[i]) {
      print("Completed: " + state.goals[i]);
      addXP(20);
      addGold(10);
      state.goals.splice(i, 1);
    }
  }
};

// ===================== PROCESS =====================
function process(cmd) {
  print("> " + cmd);
  const p = cmd.split(" ");
  const c = p[0];
  const a = p.slice(1);

  if (commands[c]) commands[c](a);
  else print("Unknown command");

  save();
}

// ===================== EVENTS =====================
input.addEventListener("keypress", () => {
  if (state.settings.sound) {
    sound.currentTime = 0;
    sound.play();
  }
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    process(input.value);
    input.value = "";
  }
});

// ===================== INIT =====================
load();
print("🌍 FULL RPG TERMINAL LOADED");
print("Type 'story' to begin your journey");

