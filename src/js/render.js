const refs = {
  gallery: document.querySelector('.gallery'),
};

export function renderGallery(images) {
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
