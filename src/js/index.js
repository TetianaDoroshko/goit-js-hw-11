const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('.search-form__input'),
  btnSearch: document.querySelector('.search-form__btn'),
};

refs.form.addEventListener('submit', submitHandler);

function submitHandler(event) {
  event.preventDefault();
  getImages();
}

function getImages() {}
