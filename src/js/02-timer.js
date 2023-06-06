import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import '../css/timer.css';

const TIMER_DELAY = 1000;

const datetimePickerEl = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');
const timerEl = document.querySelector('.timer');
const refs = {
  days: timerEl.querySelector('[data-days]'),
  hours: timerEl.querySelector('[data-hours]'),
  minutes: timerEl.querySelector('[data-minutes]'),
  seconds: timerEl.querySelector('[data-seconds]'),
};

let selectedDate = null;
let timerIntervalId = null;

initializeFlatpickr();
startBtn.disabled = true;

startBtn.addEventListener('click', () => {
  startTimer(selectedDate);
  timerIntervalId = setInterval(() => startTimer(selectedDate), TIMER_DELAY);
  console.log(timerIntervalId);
});

function initializeFlatpickr() {
  const flatpickrOptions = {
    enableTime: true,
    time_24hr: true,
    defaultDate: Date.now(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      if (selectedDates[0].getTime() < Date.now()) {
        window.alert('Please choose a date in the future');
      } else {
        startBtn.disabled = false;
        selectedDate = selectedDates[0];
        return selectedDate;
      }
    },
  };
  flatpickr(datetimePickerEl, flatpickrOptions);
}

function startTimer(selectedDate) {
  const currentDate = Date.now();
  const delta = selectedDate - currentDate;
  startBtn.disabled = true;

  if (delta <= 0) {
    clearInterval(timerIntervalId);
    datetimePickerEl.disabled = false;
    return;
  }
  datetimePickerEl.disabled = true;
  const dataToDisplay = convertMs(delta);
  updateTimer(dataToDisplay);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, 0);
}

function updateTimer({ days, hours, minutes, seconds }) {
  refs.days.textContent = addLeadingZero(days);
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
}
