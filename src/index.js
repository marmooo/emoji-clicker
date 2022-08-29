const countPanel = document.getElementById("countPanel");
const infoPanel = document.getElementById("infoPanel");
const playPanel = document.getElementById("playPanel");
const scorePanel = document.getElementById("scorePanel");
const gameTime = 60;
const categories = [...document.getElementById("courseOption").options].map(
  (x) => x.value.toLowerCase(),
);
const originalLang = document.documentElement.lang;
const ttsLang = getTTSLang();
let answer = "Emoji Clicker";
let firstRun = true;
const problems = {};
let correctCount = 0;
let englishVoices = [];
loadVoices();
let endAudio, correctAudio;
loadAudios();
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
loadConfig();

function loadConfig() {
  if (localStorage.getItem("darkMode") == 1) {
    document.documentElement.dataset.theme = "dark";
  }
  if (originalLang == "ja") {
    if (localStorage.getItem("furigana") == 1) {
      const obj = document.getElementById("addFurigana");
      addFurigana(obj);
      obj.setAttribute("data-done", true);
    }
  }
}

function toggleDarkMode() {
  if (localStorage.getItem("darkMode") == 1) {
    localStorage.setItem("darkMode", 0);
    delete document.documentElement.dataset.theme;
  } else {
    localStorage.setItem("darkMode", 1);
    document.documentElement.dataset.theme = "dark";
  }
}

function addFurigana() {
  if (originalLang != "ja") return;
  const obj = document.getElementById("addFurigana");
  if (obj.getAttribute("data-done")) {
    localStorage.setItem("furigana", 0);
    location.reload();
  } else {
    import("https://marmooo.github.io/yomico/yomico.min.js").then((module) => {
      module.yomico("/emoji-clicker/ja/index.yomi");
    });
    localStorage.setItem("furigana", 1);
    obj.setAttribute("data-done", true);
  }
}

function changeLang() {
  const langObj = document.getElementById("lang");
  const lang = langObj.options[langObj.selectedIndex].value;
  location.href = `/emoji-clicker/${lang}/`;
}

function getTTSLang() {
  switch (originalLang) {
    case "en":
      return "en-US";
    case "ja":
      return "ja-JP";
  }
}

function playAudio(audioBuffer, volume) {
  const audioSource = audioContext.createBufferSource();
  audioSource.buffer = audioBuffer;
  if (volume) {
    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume;
    gainNode.connect(audioContext.destination);
    audioSource.connect(gainNode);
    audioSource.start();
  } else {
    audioSource.connect(audioContext.destination);
    audioSource.start();
  }
}

function unlockAudio() {
  audioContext.resume();
}

function loadAudio(url) {
  return fetch(url)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => {
      return new Promise((resolve, reject) => {
        audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
          resolve(audioBuffer);
        }, (err) => {
          reject(err);
        });
      });
    });
}

function loadAudios() {
  promises = [
    loadAudio("/emoji-clicker/mp3/end.mp3"),
    loadAudio("/emoji-clicker/mp3/cat.mp3"),
    loadAudio("/emoji-clicker/mp3/correct3.mp3"),
  ];
  Promise.all(promises).then((audioBuffers) => {
    endAudio = audioBuffers[0];
    errorAudio = audioBuffers[1];
    correctAudio = audioBuffers[2];
  });
}

function loadVoices() {
  // https://stackoverflow.com/questions/21513706/
  const allVoicesObtained = new Promise((resolve) => {
    let voices = speechSynthesis.getVoices();
    if (voices.length !== 0) {
      resolve(voices);
    } else {
      let supported = false;
      speechSynthesis.addEventListener("voiceschanged", () => {
        supported = true;
        voices = speechSynthesis.getVoices();
        resolve(voices);
      });
      setTimeout(() => {
        if (!supported) {
          document.getElementById("noTTS").classList.remove("d-none");
        }
      }, 1000);
    }
  });
  allVoicesObtained.then((voices) => {
    englishVoices = voices.filter((voice) => voice.lang == ttsLang);
  });
}

function speak(text) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text);
  msg.voice = englishVoices[Math.floor(Math.random() * englishVoices.length)];
  msg.lang = ttsLang;
  speechSynthesis.speak(msg);
  return msg;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function shuffle(array) {
  for (let i = array.length; 1 < i; i--) {
    const k = Math.floor(Math.random() * i);
    [array[k], array[i - 1]] = [array[i - 1], array[k]];
  }
  return array;
}

function nextProblem() {
  const root = document.getElementById("choices");
  const choices = [...root.children];
  const course = document.getElementById("courseOption");
  const category = categories[course.selectedIndex];
  const p = problems[category].slice();
  shuffle(p);
  const pos = getRandomInt(0, choices.length);
  choices.forEach((choice, i) => {
    const text = p[i][1];
    const emojis = p[i][0];
    choice.querySelector(".emoji").textContent =
      emojis[getRandomInt(0, emojis.length)];
    choice.querySelector(".text").textContent = text;
    if (i == pos) {
      answer = text;
      document.getElementById("answer").textContent = answer;
    }
    choice.onclick = () => {
      const textObj = choice.querySelector(".text");
      const choiceText = textObj.textContent;
      if (answer == choiceText) {
        playAudio(correctAudio);
        correctCount += 1;
        nextProblem();
      } else {
        textObj.style.visibility = "initial";
        root.style.pointerEvents = "none";
        speak(choiceText);
        setTimeout(() => {
          root.style.pointerEvents = "auto";
        }, 1000);
      }
    };
  });
  if (document.getElementById("mode").textContent == "EASY") {
    showAllHints();
  } else {
    hideAllHints();
  }
  if (firstRun) {
    speak(answer);
  } else {
    setTimeout(() => {
      speak(answer);
    }, 500);
  }
}

function catWalk(freq, emoji, text) {
  const area = document.getElementById("catsWalk");
  const width = area.offsetWidth;
  const height = area.offsetHeight;
  const canvas = document.createElement("span");
  canvas.className = "emoji walker";
  canvas.style.position = "absolute";
  canvas.textContent = emoji;
  const size = 128;
  canvas.style.top = getRandomInt(0, height - size) + "px";
  canvas.style.left = width - size + "px";
  canvas.addEventListener("click", () => {
    speak(text);
    canvas.remove();
  }, { once: true });
  area.appendChild(canvas);
  const timer = setInterval(() => {
    const x = parseInt(canvas.style.left) - 1;
    if (x > -size) {
      canvas.style.left = x + "px";
    } else {
      clearInterval(timer);
      canvas.remove();
    }
  }, freq);
}

function catsWalk() {
  setInterval(() => {
    if (Math.random() > 0.995) {
      const [emoji, text] = selectRandomEmoji();
      catWalk(getRandomInt(5, 20), emoji, text);
    }
  }, 10);
}

let gameTimer;
function startGameTimer() {
  clearInterval(gameTimer);
  const timeNode = document.getElementById("time");
  initTime();
  gameTimer = setInterval(() => {
    const t = parseInt(timeNode.textContent);
    if (t > 0) {
      timeNode.textContent = t - 1;
    } else {
      clearInterval(gameTimer);
      playAudio(endAudio);
      scoring();
    }
  }, 1000);
}

function initTime() {
  document.getElementById("time").textContent = gameTime;
}

function selectRandomEmoji() {
  const category = categories[getRandomInt(0, categories.length)];
  const p = problems[category];
  const problem = p[getRandomInt(0, p.length)];
  const emojis = problem[0];
  const emoji = emojis[getRandomInt(0, emojis.length)];
  const text = problem[1];
  return [emoji, text];
}

function changeUIEmoji() {
  document.getElementById("counter-emoji").textContent = selectRandomEmoji()[0];
  document.getElementById("score-emoji").textContent = selectRandomEmoji()[0];
}

let countdownTimer;
function countdown() {
  firstRun = false;
  clearTimeout(countdownTimer);
  changeUIEmoji();
  countPanel.classList.remove("d-none");
  infoPanel.classList.add("d-none");
  playPanel.classList.add("d-none");
  scorePanel.classList.add("d-none");
  const counter = document.getElementById("counter");
  counter.textContent = 3;
  countdownTimer = setInterval(() => {
    const colors = ["skyblue", "greenyellow", "violet", "tomato"];
    if (parseInt(counter.textContent) > 1) {
      const t = parseInt(counter.textContent) - 1;
      counter.style.backgroundColor = colors[t];
      counter.textContent = t;
    } else {
      firstRun = false;
      clearTimeout(countdownTimer);
      countPanel.classList.add("d-none");
      infoPanel.classList.remove("d-none");
      playPanel.classList.remove("d-none");
      document.getElementById("score").textContent = 0;
      correctCount = 0;
      nextProblem();
      startGameTimer();
    }
  }, 1000);
}

function showAllHints() {
  const choices = document.getElementById("choices");
  [...choices.getElementsByClassName("text")].forEach((textObj) => {
    textObj.style.visibility = "initial";
  });
}

function hideAllHints() {
  const choices = document.getElementById("choices");
  [...choices.getElementsByClassName("text")].forEach((textObj) => {
    textObj.style.visibility = "hidden";
  });
}

function changeMode() {
  if (this.textContent == "EASY") {
    this.textContent = "HARD";
    hideAllHints();
  } else {
    this.textContent = "EASY";
    showAllHints();
  }
}

function scoring() {
  playPanel.classList.add("d-none");
  scorePanel.classList.remove("d-none");
  document.getElementById("score").textContent = correctCount;
}

function initVoices() {
  const choices = [...document.getElementById("choices").children];
  choices.forEach((choice) => {
    choice.onclick = () => {
      const choiceText = choice.querySelector(".text").textContent;
      speak(choiceText);
    };
  });
}

function initProblems() {
  fetch(`/emoji-clicker/data/${originalLang}.csv`)
    .then((response) => response.text())
    .then((tsv) => {
      let prevEn;
      tsv.trimEnd().split("\n").forEach((line) => {
        const [emoji, category, en, _] = line.split(",");
        if (category in problems === false) {
          problems[category] = [];
        }
        if (prevEn == en) {
          const p = problems[category];
          const last = p[p.length - 1];
          last[0].push(emoji);
        } else {
          problems[category].push([[emoji], en]);
        }
        prevEn = en;
      });
    });
}

initVoices();
initProblems();
catsWalk();

document.getElementById("toggleDarkMode").onclick = toggleDarkMode;
const furiganaButton = document.getElementById("addFurigana");
if (furiganaButton) furiganaButton.onclick = addFurigana;
document.getElementById("restartButton").onclick = countdown;
document.getElementById("startButton").onclick = countdown;
document.getElementById("mode").onclick = changeMode;
document.getElementById("voice").onclick = () => {
  speak(answer);
};
document.getElementById("lang").onchange = changeLang;
document.addEventListener("click", unlockAudio, {
  once: true,
  useCapture: true,
});
