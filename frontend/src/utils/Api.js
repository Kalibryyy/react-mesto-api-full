class Api {
  constructor(options) {
    this._url = options.baseUrl;
    this.headers = options.headers;
  }

  _getInitialCards(path, jwt) {
    return fetch(`${this._url}/${path}`, {
      headers: {
        ...this.headers,
        'Authorization': `Bearer ${jwt}`,
      }
      })
      .then(this.checkStatus);
  }

  getUserInfo(path, jwt) {
    return fetch(`${this._url}/${path}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      }
      })
      .then(this.checkStatus);
  }

  getAppInfo(userDataPath, cardsDataPath, jwt) {
    return Promise.all([this.getUserInfo(userDataPath, jwt), this._getInitialCards(cardsDataPath, jwt)]);
  }

  updateInfo(path, {name, about}, jwt) {
    return fetch(`${this._url}/${path}`, {
        method: "PATCH",
        headers: {
          ...this.headers,
          'Authorization': `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          name: name,
          about: about
        })
      })
      .then(this.checkStatus);
  }

  put(path, id) {
    return fetch(`${this._url}/${path}/${id}`, {
        method: "PUT",
        headers: this.headers
      })
      .then(this.checkStatus);
  }

  delete(path, id, jwt) {
    return fetch(`${this._url}/${path}/${id}`, {
      method: "DELETE",
      headers: {
        ...this.headers,
        'Authorization': `Bearer ${jwt}`,
      },
    })
      .then(this.checkStatus)
      .then(res => res);
  }

    updateAvatar(path, { avatar }) {
      return fetch(`${this._url}/${path}`, {
        method: "PATCH",
        headers: this.headers,
        body: JSON.stringify({
          avatar: avatar
        })
      })
        .then(this.checkStatus);
    }

  addCard(path, { name, link }, jwt) {
    return fetch(`${this._url}/${path}`, {
        method: "POST",
        headers: {
          ...this.headers,
          'Authorization': `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          name: name,
          link: link
        })
      })
      .then(this.checkStatus);
  }

  checkStatus(res) {
    return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
  }
}

export const api = new Api({
  baseUrl: `${window.location.protocol}${process.env.REACT_APP_API_URL || '//localhost:3000'}`,
  headers: {
    'Content-Type': 'application/json',
  }
});