const checkStatus = (res) => (res.ok ? res.json() : Promise.reject(new Error(`Ошибка: ${res.status}`)));

class Api {
  constructor(options) {
    this._url = options.baseUrl;
    this.headers = options.headers;
  }

  _getInitialCards(path, jwt) {
    return fetch(`${this._url}/${path}`, {
      headers: {
        ...this.headers,
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then(checkStatus);
  }

  getUserInfo(path, jwt) {
    return fetch(`${this._url}/${path}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then(checkStatus);
  }

  getAppInfo(userDataPath, cardsDataPath, jwt) {
    return Promise.all([this.getUserInfo(userDataPath, jwt), this._getInitialCards(cardsDataPath, jwt)]);
  }

  updateInfo(path, { name, about }, jwt) {
    return fetch(`${this._url}/${path}`, {
      method: 'PATCH',
      headers: {
        ...this.headers,
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        name,
        about,
      }),
    })
      .then(checkStatus);
  }

  updateAvatar(path, { avatar }, jwt) {
    return fetch(`${this._url}/${path}`, {
      method: 'PATCH',
      headers: {
        ...this.headers,
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        avatar,
      }),
    })
      .then(checkStatus);
  }

  delete(path, id, jwt) {
    return fetch(`${this._url}/${path}/${id}`, {
      method: 'DELETE',
      headers: {
        ...this.headers,
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then(checkStatus)
      .then((res) => res);
  }

  addCard(path, { name, link }, jwt) {
    return fetch(`${this._url}/${path}`, {
      method: 'POST',
      headers: {
        ...this.headers,
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        name,
        link,
      }),
    })
      .then(checkStatus);
  }

  changeLikeCardStatus(cardId, isLiked, jwt) {
    const method = isLiked ? 'PUT' : 'DELETE';
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method,
      headers: {
        ...this.headers,
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then(checkStatus);
  }
}

const api = new Api({
  baseUrl: `${window.location.protocol}${process.env.REACT_APP_API_URL || '//localhost:3000'}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
