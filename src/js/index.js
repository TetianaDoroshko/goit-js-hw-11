import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox/dist/simple-lightbox.esm';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const throttle = require('lodash.throttle');

import { getImages } from './request-to-api.js';
import { renderGallery } from './render.js';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  btnMore: document.querySelector('.load-more'),
};
let pagecounter = 1;
let searchQuery = '';
let totalPages = null;

refs.form.addEventListener('submit', searchImages);

async function searchImages(event) {
  event.preventDefault();

  searchQuery = event.target.elements.searchQuery.value;
  pagecounter = 1;
  totalPages = null;

  clearGallery();

  if (searchQuery === '') {
    Notify.warning('Enter a search query, please.');
    return;
  }
  try {
    const collection = await getImages(searchQuery, pagecounter);
    if (collection.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    Notify.success(`Horray! We found ${collection.totalHits} images.`);

    renderGallery(collection.hits);

    totalPages = Math.ceil(collection.totalHits / 40);
    if (totalPages > 1) {
      window.addEventListener('scroll', throttle(infinityScroll, 400));
    }
  } catch (error) {
    console.log(error);
  }
}

function infinityScroll() {
  const endOfPage = document.documentElement.getBoundingClientRect().bottom;
  const bottomOfWindow = document.documentElement.clientHeight;
  if (endOfPage <= bottomOfWindow + 600) {
    if (pagecounter < totalPages) {
      loadMoreImages();
    }
  }
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

async function loadMoreImages() {
  pagecounter += 1;
  try {
    const collection = await getImages(searchQuery, pagecounter);
    renderGallery(collection.hits);

    if (pagecounter === totalPages) {
      Notify.info(`We're sorry, but you've reached the end of search results.`);
      window.removeEventListener('scroll', throttle(infinityScroll, 400));
      return;
    }
  } catch (error) {
    console.log(error);
  }
}

// function scroll() {
//   const { height: cardHeight } = document
//     .querySelector('.gallery')
//     .firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
// }
