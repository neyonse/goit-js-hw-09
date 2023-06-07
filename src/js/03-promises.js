import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

const form = document.querySelector('.form');

form.addEventListener('submit', onSubmit);

const options1 = {
  borderRadius: '8px',
  clickToClose: true,
  width: '200px',
};

const options2 = {
  position: 'right-bottom',
  borderRadius: '8px',
};

function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldResolve = Math.random() > 0.3;
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}

function onSubmit(evt) {
  evt.preventDefault();
  const { delay, step, amount } = evt.currentTarget.elements;
  let inputDelay = Number(delay.value);
  let inputStep = Number(step.value);
  let inputAmount = Number(amount.value);

  if (inputDelay < 0 || inputStep < 0 || inputAmount <= 0) {
    Notify.failure('Invalid input values', options1);

    if (inputDelay < 0) {
      highlightField(delay);
    }
    if (inputStep < 0) {
      highlightField(step);
    }
    if (inputAmount < 0) {
      highlightField(amount);
    }

    return;
  }

  for (let i = 1; i <= inputAmount; i += 1) {
    if (i >= 2) {
      inputDelay += inputStep;
    }

    Loading.circle('Creating a promises...', {
      backgroundColor: 'rgba(0,0,0,0.2)',
      messageColor: 'grey',
    });
    Loading.remove(inputDelay);

    createPromise(i, inputDelay)
      .then(({ position, delay }) => {
        Notify.success(
          `✅ Fulfilled promise ${position} in ${delay}ms`,
          options2
        );
      })
      .catch(({ position, delay }) => {
        Notify.failure(
          `❌ Rejected promise ${position} in ${delay}ms`,
          options2
        );
      });
  }
}

function highlightField(el) {
  el.style.backgroundColor = 'rgb(255, 125, 120)';
  setTimeout(() => {
    el.style.transition = 'background-color 1s';
    el.style.backgroundColor = 'transparent';
  }, 2000);
  el.style.transition = 'background-color 0s';
}
