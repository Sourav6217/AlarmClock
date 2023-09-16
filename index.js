const currentTime = document.querySelector("#current-time");
const setHours = document.querySelector("#hours");
const setMinutes = document.querySelector("#minutes");
const setSeconds = document.querySelector("#seconds");
const setAmPm = document.querySelector("#am-pm");
const setAlarmButton = document.querySelector("#submitButton");
const alarmContainer = document.querySelector("#alarms-container");

// Adding Hours, Minutes, Seconds in DropDown Menu
window.addEventListener("DOMContentLoaded", (event) => {
  populateDropdown(1, 12, setHours);
  populateDropdown(0, 59, setMinutes);
  populateDropdown(0, 59, setSeconds);

  setInterval(updateCurrentTime, 1000);
  fetchAlarms();
});

// Event Listener added to Set Alarm Button
setAlarmButton.addEventListener("click", handleSetAlarm);

function populateDropdown(start, end, element) {
  for (let i = start; i <= end; i++) {
    const option = document.createElement("option");
    option.value = i < 10 ? "0" + i : i;
    option.innerHTML = i < 10 ? "0" + i : i;
    element.appendChild(option);
  }
}

function updateCurrentTime() {
  const time = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
  currentTime.innerHTML = time;
}

function handleSetAlarm(e) {
  e.preventDefault();
  const hourValue = setHours.value;
  const minuteValue = setMinutes.value;
  const secondValue = setSeconds.value;
  const amPmValue = setAmPm.value;

  const alarmTime = convertTo24HourFormat(hourValue, minuteValue, secondValue, amPmValue);
  setAlarm(alarmTime);
}

function convertTo24HourFormat(hour, minute, second, amPm) {
  return `${parseInt(hour)}:${minute}:${second} ${amPm}`;
}

function setAlarm(time, fetching = false) {
  const alarmInterval = setInterval(() => {
    if (time === getCurrentTime()) {
      alert("Alarm Ringing");
    }
    console.log("running");
  }, 500);

  addToDOM(time, alarmInterval);
  if (!fetching) {
    saveAlarm(time);
  }
}

function addToDOM(time, intervalId) {
  const alarm = document.createElement("div");
  alarm.classList.add("alarm", "mb", "d-flex");
  alarm.innerHTML = `
    <div class="time">${time}</div>
    <button class="btn delete-alarm" data-id=${intervalId}>Delete</button>
  `;
  const deleteButton = alarm.querySelector(".delete-alarm");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e, time, intervalId));

  alarmContainer.prepend(alarm);
}

function fetchAlarms() {
  const alarms = getAlarmsFromLocalStorage();
  alarms.forEach((time) => {
    setAlarm(time, true);
  });
}

function getAlarmsFromLocalStorage() {
  const alarms = JSON.parse(localStorage.getItem("alarms")) || [];
  return alarms;
}

function saveAlarm(time) {
  const alarms = getAlarmsFromLocalStorage();
  alarms.push(time);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}

function deleteAlarm(event, time, intervalId) {
  clearInterval(intervalId);
  const alarm = event.target.parentElement;
  deleteAlarmFromLocalStorage(time);
  alarm.remove();
}

function deleteAlarmFromLocalStorage(time) {
  const alarms = getAlarmsFromLocalStorage();
  const index = alarms.indexOf(time);
  if (index !== -1) {
    alarms.splice(index, 1);
    localStorage.setItem("alarms", JSON.stringify(alarms));
  }
}
