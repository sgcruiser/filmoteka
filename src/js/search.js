import api from './api/api-service';
import searchRender from './render-search';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import errorModal from './components/modal-error';
import { formRef, inputRef, headerWarning } from './references/refs';

// Listener
formRef.addEventListener('submit', searchingHandler);

// Searching function
function searchingHandler(event) {
  event.preventDefault();

  const inputedText = inputRef.value;

  console.log(inputedText.length);

  if (inputedText.length <= 1) {
    // Нужна обработка нескольких пробелов!
    return (headerWarning.textContent =
      'No matches found for your query. Enter the correct movie name.');
  }

  NProgress.start();
  headerWarning.textContent = '';
  movieSearcher(inputedText.trim());
  NProgress.done();
}

// Search fetch
async function movieSearcher(searchText) {
  try {
    const result = await api.fetchMovieSearcher(searchText);
    searchRender(result);
  } catch (error) {
    errorModal();
    console.error('Smth wrong with outer search fetch' + error);
  }
}
