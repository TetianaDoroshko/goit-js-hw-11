const axios = require('axios');

const BASE_URL_API = 'https://pixabay.com/api/';

export async function getImages(q, page) {
  const options = {
    params: {
      key: '28092869-c096b2e9e8db9cb91be15289b',
      q: q,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: page,
    },
  };

  try {
    const response = await axios.get(BASE_URL_API, options);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
