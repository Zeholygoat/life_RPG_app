const input = document.getElementById("input");
const output = document.getElementById("output");
const sound = document.getElementById("typeSound");

let xp = 0;
let goals = [];

input.addEventListener("keypress", () => {
  sound.currentTime = 0;
  sound.play();
});

input.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    const command = input.value;
    process(command);
    input.value = "";
  }
});

function print(text) {
  const line = document.createElement("div");
  line.textContent = text;
  output.appendChild(line);
  window.scrollTo(0, document.body.scrollHeight);
}

function process(cmd) {
  print("> " + cmd);

  if (cmd.startsWith("add ")) {
    const goal = cmd.slice(4);
    goals.push(goal);
    print("Quest added: " + goal);
  }

  else if (cmd === "list") {
    goals.forEach((g, i) => print(i+1 + ". " + g));
  }

  else if (cmd.startsWith("done ")) {
    const index = parseInt(cmd.split(" ")[1]) - 1;
    if (goals[index]) {
      xp += 10;
      print("Completed: " + goals[index] + " | +10 XP");
    }
  }

  else if (cmd === "xp") {
    print("XP: " + xp);
  }

  else {
    print("Commands: add <goal>, list, done <num>, xp");
  }
}

print("Life RPG Terminal");
print("Built by Sam");
print("Type 'add learn JS'");
