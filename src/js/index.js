const axios = require('axios');
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox/dist/simple-lightbox.esm';
// import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const BASE_URL_API = 'https://pixabay.com/api/';

const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('.search-form__input'),
  btnSearch: document.querySelector('.search-form__btn'),
  gallery: document.querySelector('.gallery'),
  btnMore: document.querySelector('.load-more'),
};
let pagecounter = 1;
let searchQuery = '';

refs.form.addEventListener('submit', searchImages);

async function searchImages(event) {
  event.preventDefault();

  searchQuery = event.target.elements.searchQuery.value;
  pagecounter = 1;
  if (searchQuery === '') {
    Notify.warning('Enter a search query, please.');
    clearGallery();
    return;
  }
  try {
    const collection = await getImages(searchQuery, pagecounter);
    if (collection.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      clearGallery();
      return;
    }
    Notify.success(`Horray! We found ${collection.totalHits} images.`);
    console.log(collection);
    console.log(collection.hits);
    clearGallery();
    renderGallery(collection.hits);
    activeBtnMore();
    scroll();
  } catch (error) {
    console.log(error);
  }
}

function clearGallery() {
  refs.gallery.innerHTML = '';
  refs.btnMore.style.display = 'none';
}

async function getImages(q, page) {
  const options = {
    params: {
      key: '28092869-c096b2e9e8db9cb91be15289b',
      q: q,
      // q: 'dog',
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: page,
    },
  };
  try {
    const response = await axios.get(BASE_URL_API, options);
    console.log(response);
    console.log(response.data.hits.length);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

function renderGallery(images) {
  const markup = images
    .map(img => {
      return `
      <a href="${img.largeImageURL}" class="gallery-link">
      <div class="photo-card">
        <img src="${img.webformatURL}" alt="${img.tags}" loading="lazy" class="photo-card__img"/>
        <div class="info">
          <p class="info-item">
            <b>Likes</b><span>${img.likes}</span>
          </p>
          <p class="info-item">
            <b>Views</b><span>${img.views}</span>
          </p>
          <p class="info-item">
            <b>Comments</b><span>${img.comments}</span>
          </p>
          <p class="info-item">
            <b>Downloads</b><span>${img.downloads}</span>
          </p>
        </div>
      </div>
      </a>`;
    })
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  const lightbox = new SimpleLightbox('.gallery a');
}

function activeBtnMore() {
  refs.btnMore.style.display = 'block';
  refs.btnMore.addEventListener('click', loadMoreImages);
}

async function loadMoreImages() {
  pagecounter += 1;
  try {
    const collection = await getImages(searchQuery, pagecounter);
    const totalPages = Math.ceil(collection.totalHits / 40);
    renderGallery(collection.hits);
    scroll();

    if (pagecounter === totalPages) {
      Notify.info(`We're sorry, but you've reached the end of search results.`);
      refs.btnMore.style.display = 'none';
    }
  } catch (error) {
    console.log(error);
  }
}

function scroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
