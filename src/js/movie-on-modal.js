import api from './api/api-service';
import renderMovieModal from './render-modal';
import { errorModal } from './components/notify';
import { gallery } from './references/refs';
import { load, save, remove } from './local-storage';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

gallery.addEventListener('click', clickOnMovieHandler);

// Click Handler Function
function clickOnMovieHandler(e) {
  e.preventDefault();

  if (e.target.nodeName !== 'IMG' && e.target.nodeName !== 'H2') {
    return;
  }

  let movieId = e.target.dataset.id;
  fetchById(movieId);
  textModalBtn(movieId);
}

function textModalBtn(id) {
  const btnQueue = document.querySelector('.btn__queue');
  const btnWatch = document.querySelector('.btn__watch');
  if (inList(id, 'watched')) {
    btnWatch.textContent = 'Added to watched';
    save('textBtnWatch', btnWatch.textContent);
  } else {
    btnWatch.textContent = 'Add to watched';
    save('textBtnWatch', btnWatch.textContent);
  }

  if (inList(id, 'queue')) {
    btnQueue.textContent = 'Added to queue';
    save('textBtnQueue', btnQueue.textContent);
  } else {
    btnQueue.textContent = 'Add to queue';
    save('textBtnQueue', btnQueue.textContent);
  }
}

// Outer fetch by ID
async function fetchById(id) {
  NProgress.start();

  try {
    const movieId = await api.getMovieById(id);

    renderMovieModal(movieId);

    const btnQueue = document.querySelector('.btn__queue');
    const btnWatch = document.querySelector('.btn__watch');

    btnQueue.addEventListener('click', addQueueList);
    btnWatch.addEventListener('click', addWatchList);
  } catch (error) {
    errorModal();
    console.error('Smth wrong with outer fetch by ID' + error);
  }

  function addWatchList() {
    const btnWatch = document.querySelector('.btn__watch');
    const btnQueue = document.querySelector('.btn__queue');
    let watchList = [];
    let localWatchListJson = load('watched');
    if (localWatchListJson) {
      watchList = [...localWatchListJson];
    }

    let queueList = [];
    let localQueueListJson = load('queue');
    if (localQueueListJson) {
      queueList = [...localQueueListJson];
    }
    let queueSet = new Set(queueList);
    if (queueSet.has(id)) {
      remove('queue');
      let index = queueList.indexOf(id);
      queueList.splice(index, 1);
      save('queue', queueList);
    }

    const watchSet = new Set(watchList);
    if (watchSet.has(id)) {
      // btnWatch.textContent = 'Added to watched';
      textModalBtn(id);
    } else {
      watchList.push(id);
      save('watched', watchList);

      // btnWatch.textContent = 'Added to watched';
      textModalBtn(id);
    }
  }

  function addQueueList() {
    const btnWatch = document.querySelector('.btn__watch');
    const btnQueue = document.querySelector('.btn__queue');
    let queueList = [];
    let localQueueListJson = load('queue');
    if (localQueueListJson) {
      queueList = [...localQueueListJson];
    }

    let watchList = [];
    let localWatchListJson = load('watched');
    if (localWatchListJson) {
      watchList = [...localWatchListJson];
    }
    let watchSet = new Set(watchList);
    if (watchSet.has(id)) {
      remove('watched');
      let index = watchList.indexOf(id);
      watchList.splice(index, 1);
      save('watched', watchList);
    }

    const queueSet = new Set(queueList);
    if (queueSet.has(id)) {
      // btnQueue.textContent = 'Added to queue';
      textModalBtn(id);
    } else {
      queueList.push(id);
      save('queue', queueList);
      // btnQueue.textContent = 'Added to queue';
      textModalBtn(id);
    }
  }

  async function textModalBtn(id) {
    const btnQueue = await document.querySelector('.btn__queue');
    const btnWatch = await document.querySelector('.btn__watch');
    if (inList(id, 'watched')) {
      btnWatch.textContent = 'Added to watched';
      save('textBtnWatch', btnWatch.textContent);
    } else {
      btnWatch.textContent = 'Add to watched';
      save('textBtnWatch', btnWatch.textContent);
    }

    if (inList(id, 'queue')) {
      btnQueue.textContent = 'Added to queue';
      save('textBtnQueue', btnQueue.textContent);
    } else {
      btnQueue.textContent = 'Add to queue';
      save('textBtnQueue', btnQueue.textContent);
    }
  }

  NProgress.done();
}

function inList(id, list) {
  let arrList = [];
  let localListJson = load(list);
  if (localListJson) {
    arrList = [...localListJson];
  }
  const listSet = new Set(arrList);
  return listSet.has(id);
}
