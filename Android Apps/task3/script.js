// Common elements
const alarmSound = document.getElementById("alarmSound");

// === TONES ===
const tones = {
  tone1: "https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3",
  tone2: "https://assets.mixkit.co/active_storage/sfx/2030/2030-preview.mp3",
  tone3: "https://assets.mixkit.co/active_storage/sfx/2002/2002-preview.mp3"
};

// === TAB SWITCHING ===
const tabs = document.querySelectorAll(".tab-button");
const contents = document.querySelectorAll(".tab-content");
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    contents.forEach(c => c.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

// ========== ALARM CLOCK ==========
const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const alarmTimeInput = document.getElementById("alarmTime");
const amPmSelect = document.getElementById("amPm");
const toneSelect = document.getElementById("tone");
const setAlarmBtn = document.getElementById("setAlarmBtn");
const alarmsList = document.getElementById("alarmsList");

let alarms = [];
let isRinging = false;

setInterval(() => {
  const now = new Date();
  timeEl.textContent = formatTime(now);
  dateEl.textContent = now.toLocaleDateString();
  checkAlarms(now);
}, 1000);

function formatTime(date) {
  let h = date.getHours();
  const m = date.getMinutes().toString().padStart(2, "0");
  const s = date.getSeconds().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h.toString().padStart(2, "0")}:${m}:${s} ${ampm}`;
}

setAlarmBtn.onclick = () => {
  const time = alarmTimeInput.value;
  const ampm = amPmSelect.value;
  const tone = toneSelect.value;
  if (!time) return alert("Select a time!");
  alarms.push({ time, ampm, tone, active: true });
  renderAlarms();
  alarmTimeInput.value = "";
};

function renderAlarms() {
  alarmsList.innerHTML = "";
  alarms.forEach((a, i) => {
    const div = document.createElement("div");
    div.classList.add("alarm-item");
    div.innerHTML = `
      <span>${a.time} ${a.ampm}</span>
      <div>
        <button onclick="toggleAlarm(${i})">${a.active ? "On" : "Off"}</button>
        <button onclick="deleteAlarm(${i})">Delete</button>
      </div>`;
    alarmsList.appendChild(div);
  });
}

function toggleAlarm(i) {
  alarms[i].active = !alarms[i].active;
  renderAlarms();
}

function deleteAlarm(i) {
  alarms.splice(i, 1);
  renderAlarms();
}

function checkAlarms(now) {
  if (isRinging) return;
  const currentTime = formatTime(now).slice(0, 8);
  const currentAMPM = formatTime(now).slice(-2);
  alarms.forEach((a, i) => {
    if (a.active && currentTime === a.time + ":00" && a.ampm === currentAMPM) ringAlarm(i);
  });
}

function ringAlarm(i) {
  const a = alarms[i];
  isRinging = true;
  alarmSound.src = tones[a.tone];
  alarmSound.loop = true;
  alarmSound.play();
  alarmsList.innerHTML = `
    <div class="alarm-item ringing">
      <strong>⏰ Alarm ${a.time} ${a.ampm}</strong>
      <div>
        <button onclick="snoozeAlarm(${i})">Snooze</button>
        <button onclick="dismissAlarm(${i})">Dismiss</button>
      </div>
    </div>`;
}

function stopAlarm() {
  alarmSound.pause();
  alarmSound.currentTime = 0;
  isRinging = false;
}

function snoozeAlarm(i) {
  stopAlarm();
  const d = new Date();
  d.setMinutes(d.getMinutes() + 5);
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  alarms[i] = { time: `${h.toString().padStart(2, "0")}:${m}`, ampm, tone: alarms[i].tone, active: true };
  renderAlarms();
}

function dismissAlarm(i) {
  stopAlarm();
  alarms[i].active = false;
  renderAlarms();
}

// ========== TIMER ==========
let timerInterval;
let timerRemaining = 0;

const hoursInput = document.getElementById("hours");
const minutesInput = document.getElementById("minutes");
const secondsInput = document.getElementById("seconds");
const timerDisplay = document.getElementById("timerDisplay");

document.getElementById("startTimer").onclick = () => {
  if (!timerInterval) {
    const h = parseInt(hoursInput.value || 0);
    const m = parseInt(minutesInput.value || 0);
    const s = parseInt(secondsInput.value || 0);
    timerRemaining = h * 3600 + m * 60 + s;
    if (timerRemaining <= 0) return alert("Set a valid time!");
    startTimer();
  }
};

document.getElementById("pauseTimer").onclick = () => {
  clearInterval(timerInterval);
  timerInterval = null;
};

document.getElementById("resetTimer").onclick = () => {
  clearInterval(timerInterval);
  timerInterval = null;
  timerRemaining = 0;
  timerDisplay.textContent = "00:00:00";
};

function startTimer() {
  timerInterval = setInterval(() => {
    if (timerRemaining <= 0) {
      clearInterval(timerInterval);
      alarmSound.src = tones.tone1;
      alarmSound.loop = false;
      alarmSound.play();
      alert("⏲️ Timer finished!");
      timerInterval = null;
      return;
    }
    timerRemaining--;
    const h = Math.floor(timerRemaining / 3600);
    const m = Math.floor((timerRemaining % 3600) / 60);
    const s = timerRemaining % 60;
    timerDisplay.textContent = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, 1000);
}

// ========== STOPWATCH ==========
let stopwatchInterval;
let stopwatchTime = 0;
const stopwatchDisplay = document.getElementById("stopwatchDisplay");

document.getElementById("startStopwatch").onclick = () => {
  if (!stopwatchInterval) {
    stopwatchInterval = setInterval(() => {
      stopwatchTime++;
      const h = Math.floor(stopwatchTime / 3600);
      const m = Math.floor((stopwatchTime % 3600) / 60);
      const s = stopwatchTime % 60;
      stopwatchDisplay.textContent = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }, 1000);
  }
};

document.getElementById("pauseStopwatch").onclick = () => {
  clearInterval(stopwatchInterval);
  stopwatchInterval = null;
};

document.getElementById("resetStopwatch").onclick = () => {
  clearInterval(stopwatchInterval);
  stopwatchInterval = null;
  stopwatchTime = 0;
  stopwatchDisplay.textContent = "00:00:00";
};
