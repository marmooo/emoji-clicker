const countPanel=document.getElementById("countPanel"),infoPanel=document.getElementById("infoPanel"),playPanel=document.getElementById("playPanel"),scorePanel=document.getElementById("scorePanel"),gameTime=60,categories=[...document.getElementById("courseOption").options].map(a=>a.value.toLowerCase()),originalLang=document.documentElement.lang,ttsLang=getTTSLang();let answer="Emoji Clicker",firstRun=!0;const problems={};let correctCount=0,englishVoices=[];loadVoices();const audioContext=new AudioContext,audioBufferCache={};loadAudio("end","mp3/end.mp3"),loadAudio("correct","mp3/correct3.mp3"),loadConfig();function loadConfig(){if(localStorage.getItem("darkMode")==1&&(document.documentElement.dataset.theme="dark"),originalLang=="ja")if(localStorage.getItem("furigana")==1){const a=document.getElementById("addFurigana");addFurigana(a),a.setAttribute("data-done",!0)}}function toggleDarkMode(){localStorage.getItem("darkMode")==1?(localStorage.setItem("darkMode",0),delete document.documentElement.dataset.theme):(localStorage.setItem("darkMode",1),document.documentElement.dataset.theme="dark")}function addFurigana(){if(originalLang!="ja")return;const a=document.getElementById("addFurigana");a.getAttribute("data-done")?(localStorage.setItem("furigana",0),location.reload()):(import("https://marmooo.github.io/yomico/yomico.min.js").then(a=>{a.yomico("/emoji-clicker/ja/index.yomi")}),localStorage.setItem("furigana",1),a.setAttribute("data-done",!0))}function changeLang(){const a=document.getElementById("lang"),b=a.options[a.selectedIndex].value;location.href=`/emoji-clicker/${b}/`}function getTTSLang(){switch(originalLang){case"en":return"en-US";case"ja":return"ja-JP"}}async function playAudio(b,c){const d=await loadAudio(b,audioBufferCache[b]),a=audioContext.createBufferSource();if(a.buffer=d,c){const b=audioContext.createGain();b.gain.value=c,b.connect(audioContext.destination),a.connect(b),a.start()}else a.connect(audioContext.destination),a.start()}async function loadAudio(a,c){if(audioBufferCache[a])return audioBufferCache[a];const d=await fetch(c),e=await d.arrayBuffer(),b=await audioContext.decodeAudioData(e);return audioBufferCache[a]=b,b}function unlockAudio(){audioContext.resume()}function loadVoices(){const a=new Promise(b=>{let a=speechSynthesis.getVoices();if(a.length!==0)b(a);else{let c=!1;speechSynthesis.addEventListener("voiceschanged",()=>{c=!0,a=speechSynthesis.getVoices(),b(a)}),setTimeout(()=>{c||document.getElementById("noTTS").classList.remove("d-none")},1e3)}}),b=["com.apple.speech.synthesis.voice.Bahh","com.apple.speech.synthesis.voice.Albert","com.apple.speech.synthesis.voice.Hysterical","com.apple.speech.synthesis.voice.Organ","com.apple.speech.synthesis.voice.Cellos","com.apple.speech.synthesis.voice.Zarvox","com.apple.speech.synthesis.voice.Bells","com.apple.speech.synthesis.voice.Trinoids","com.apple.speech.synthesis.voice.Boing","com.apple.speech.synthesis.voice.Whisper","com.apple.speech.synthesis.voice.Deranged","com.apple.speech.synthesis.voice.GoodNews","com.apple.speech.synthesis.voice.BadNews","com.apple.speech.synthesis.voice.Bubbles"];a.then(a=>{englishVoices=a.filter(a=>a.lang==ttsLang).filter(a=>!b.includes(a.voiceURI))})}function speak(b){speechSynthesis.cancel();const a=new SpeechSynthesisUtterance(b);return a.voice=englishVoices[Math.floor(Math.random()*englishVoices.length)],a.lang=ttsLang,speechSynthesis.speak(a),a}function getRandomInt(a,b){return a=Math.ceil(a),b=Math.floor(b),Math.floor(Math.random()*(b-a)+a)}function shuffle(a){for(let b=a.length;1<b;b--){const c=Math.floor(Math.random()*b);[a[c],a[b-1]]=[a[b-1],a[c]]}return a}function nextProblem(){const a=document.getElementById("choices"),c=[...a.children],d=document.getElementById("courseOption"),e=categories[d.selectedIndex],b=problems[e].slice();shuffle(b);const f=getRandomInt(0,c.length);c.forEach((c,d)=>{const e=b[d][1],g=b[d][0];c.querySelector(".emoji").textContent=g[getRandomInt(0,g.length)],c.querySelector(".text").textContent=e,d==f&&(answer=e,document.getElementById("answer").textContent=answer),c.onclick=()=>{const b=c.querySelector(".text"),d=b.textContent;answer==d?(playAudio("correct"),correctCount+=1,nextProblem()):(b.style.visibility="initial",a.style.pointerEvents="none",speak(d),setTimeout(()=>{a.style.pointerEvents="auto"},1e3))}}),document.getElementById("mode").textContent=="EASY"?showAllHints():hideAllHints(),firstRun?speak(answer):setTimeout(()=>{speak(answer)},500)}function catWalk(g,h,d){const c=document.getElementById("catsWalk"),e=c.offsetWidth,f=c.offsetHeight,a=document.createElement("span");a.setAttribute("role","button"),a.className="emoji",a.style.position="absolute",a.textContent=h;const b=128;a.style.top=getRandomInt(0,f-b)+"px",a.style.left=e-b+"px",a.addEventListener("click",()=>{speak(d),a.remove()},{once:!0}),c.appendChild(a);const i=setInterval(()=>{const c=parseInt(a.style.left)-1;c>-b?a.style.left=c+"px":(clearInterval(i),a.remove())},g)}function catsWalk(){setInterval(()=>{if(Math.random()>.995){const[a,b]=selectRandomEmoji();catWalk(getRandomInt(5,20),a,b)}},10)}let gameTimer;function startGameTimer(){clearInterval(gameTimer);const a=document.getElementById("time");initTime(),gameTimer=setInterval(()=>{const b=parseInt(a.textContent);b>0?a.textContent=b-1:(clearInterval(gameTimer),playAudio("end"),scoring())},1e3)}function initTime(){document.getElementById("time").textContent=gameTime}function selectRandomEmoji(){const d=categories[getRandomInt(0,categories.length)],a=problems[d],b=a[getRandomInt(0,a.length)],c=b[0],e=c[getRandomInt(0,c.length)],f=b[1];return[e,f]}function changeUIEmoji(){document.getElementById("counter-emoji").textContent=selectRandomEmoji()[0],document.getElementById("score-emoji").textContent=selectRandomEmoji()[0]}let countdownTimer;function countdown(){firstRun=!1,clearTimeout(countdownTimer),changeUIEmoji(),countPanel.classList.remove("d-none"),infoPanel.classList.add("d-none"),playPanel.classList.add("d-none"),scorePanel.classList.add("d-none");const a=document.getElementById("counter");a.textContent=3,countdownTimer=setInterval(()=>{const b=["skyblue","greenyellow","violet","tomato"];if(parseInt(a.textContent)>1){const c=parseInt(a.textContent)-1;a.style.backgroundColor=b[c],a.textContent=c}else firstRun=!1,clearTimeout(countdownTimer),countPanel.classList.add("d-none"),infoPanel.classList.remove("d-none"),playPanel.classList.remove("d-none"),document.getElementById("score").textContent=0,correctCount=0,nextProblem(),startGameTimer()},1e3)}function showAllHints(){const a=document.getElementById("choices");[...a.getElementsByClassName("text")].forEach(a=>{a.style.visibility="initial"})}function hideAllHints(){const a=document.getElementById("choices");[...a.getElementsByClassName("text")].forEach(a=>{a.style.visibility="hidden"})}function changeMode(){this.textContent=="EASY"?(this.textContent="HARD",hideAllHints()):(this.textContent="EASY",showAllHints())}function scoring(){playPanel.classList.add("d-none"),scorePanel.classList.remove("d-none"),document.getElementById("score").textContent=correctCount}function initVoices(){const a=[...document.getElementById("choices").children];a.forEach(a=>{a.onclick=()=>{const b=a.querySelector(".text").textContent;speak(b)}})}function initProblems(){fetch(`/emoji-clicker/data/${originalLang}.csv`).then(a=>a.text()).then(b=>{let a;b.trimEnd().split("\n").forEach(e=>{const[d,b,c,f]=e.split(",");if(b in problems===!1&&(problems[b]=[]),a==c){const a=problems[b],c=a[a.length-1];c[0].push(d)}else problems[b].push([[d],c]);a=c})})}initVoices(),initProblems(),catsWalk(),document.getElementById("toggleDarkMode").onclick=toggleDarkMode;const furiganaButton=document.getElementById("addFurigana");furiganaButton&&(furiganaButton.onclick=addFurigana),document.getElementById("restartButton").onclick=countdown,document.getElementById("startButton").onclick=countdown,document.getElementById("mode").onclick=changeMode,document.getElementById("voice").onclick=()=>{speak(answer)},document.getElementById("lang").onchange=changeLang,document.addEventListener("click",unlockAudio,{once:!0,useCapture:!0})