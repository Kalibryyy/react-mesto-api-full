import React from 'react';
import {
  Route, Switch, Redirect, useHistory,
} from 'react-router-dom';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import PopupWithForm from './PopupWithForm';
import EditProfilePopup from './EditPropfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import Register from './Register';
import Login from './Login';
import InfoToolTip from './InfoTooltip';
import ProtectedRoute from './ProtectedRoute';
import api from '../utils/Api';
import * as auth from '../utils/Auth';
import CurrentUserContext from '../contexts/CurrentUserContext';

function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(
    false,
  );
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(
    false,
  );
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isSpinnerLoading, setIsSpinnerLoading] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isAuthPopupOpen, setIsAuthPopupOpen] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState({
    email: '',
  });
  const [isSignedUp, setIsSignedUp] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const userEmail = userInfo.email;

  const history = useHistory();

  function tokenCheck() {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      auth
        .getContent(jwt)
        .then((res) => {
          if (res.email) {
            setUserInfo({
              email: res.email,
            });
            setIsLoggedIn(true);
            history.push('/');
          }
        })
        .catch((err) => console.error(err));
    }
  }

  React.useEffect(() => {
    tokenCheck();
  }, []);

  function handleRegister({ password, email }) {
    auth
      .register(password, email)
      .then((data) => {
        setUserInfo({
          email: data.email,
        });
        setIsSignedUp(true);
        setIsAuthPopupOpen(!isAuthPopupOpen);
        history.push('/sign-in');
      })
      .catch((err) => {
        console.log(err);
        if (err === 400) {
          setMessage('Некорректно заполнено одно из полей');
        }
        setIsSignedUp(false);
        setIsAuthPopupOpen(!isAuthPopupOpen);
      });
  }

  function handleLogin({ password, email }) {
    auth
      .authorize(password, email)
      .then((data) => {
        if (data.token) {
          localStorage.setItem('jwt', data.token);
        }
        setIsLoggedIn(true);
        setUserInfo({
          email,
        });
        history.push('/');
      })
      .catch((err) => {
        if (err === 400) {
          setMessage('Не передано одно из полей');
        } else if (err === 401) {
          setMessage('Пользователь с email не найден');
        }
        setIsSignedUp(false);
        setIsAuthPopupOpen(true);
      });
  }

  function handleLogOut() {
    localStorage.removeItem('jwt');
    setUserInfo({
      email: '',
    });
    setIsLoggedIn(false);
  }

  React.useEffect(() => {
    setIsSpinnerLoading(true);
    if (isLoggedIn) {
      const jwt = localStorage.getItem('jwt');
      api
        .getAppInfo('users/me', 'cards', jwt)
        .then((data) => {
          const [userData, cardsArray] = data;
          setCards(cardsArray);
          setCurrentUser(userData);
        })
        .catch((err) => console.log(`Error ${err}`))
        .finally(() => {
          setIsSpinnerLoading(false);
        });
    }
  }, [isLoggedIn]);

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(!isAddPlacePopupOpen);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsAuthPopupOpen(false);

    if (selectedCard.link) {
      setSelectedCard(!selectedCard.link);
    }
  }

  function handleCardDelete(id) {
    const jwt = localStorage.getItem('jwt');
    api
      .delete('cards', id, jwt)
      .then(() => {
        const newCards = cards.filter((c) => c._id !== id);
        setCards(newCards);
      })
      .catch((err) => console.log(`Error ${err}`));
  }

  function handleAddPlace({ name, link }) {
    const jwt = localStorage.getItem('jwt');
    api
      .addCard('cards', {
        name,
        link,
      }, jwt)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(`Error ${err}`));
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <header className="header">
          <Route exact path="/">
            <Header
              isLoggedIn={isLoggedIn}
              title={'Выйти'}
              link={'sign-in'}
              userData={userEmail}
              onLogOut={handleLogOut}
            />
          </Route>
          <Route path="/sign-up">
            <Header isLoggedIn={isLoggedIn} title={'Войти'} link={'sign-in'} />
          </Route>
          <Route path="/sign-in">
            <Header
              isLoggedIn={isLoggedIn}
              title={'Регистрация'}
              link={'sign-up'}
            />
          </Route>
        </header>
        <Switch>
          <Route path="/sign-up">
            <Register onFormSubmit={handleRegister} />
          </Route>
          <Route path="/sign-in">
            <Login onFormSubmit={handleLogin} tokenCheck={tokenCheck} />
          </Route>
          <ProtectedRoute
            exact
            path="/"
            isLoggedIn={isLoggedIn}
            onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onClose={closeAllPopups}
            onCardClick={handleCardClick}
            cards={cards}
            onCardDelete={handleCardDelete}
            isLoading={isSpinnerLoading}
            component={Main}
          />
          <Route exact path="/">
            {isLoggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
          </Route>
        </Switch>
        <Footer />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          isClose={isEditProfilePopupOpen}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          isClose={isAddPlacePopupOpen}
          onAddPlace={handleAddPlace}
        />
        <PopupWithForm name={'confirm-card-del'} title={'Вы уверены?'} />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          isClose={isEditAvatarPopupOpen}
          onCardClick={handleCardClick}
        />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        <InfoToolTip
          isOpen={isAuthPopupOpen}
          onClose={closeAllPopups}
          isSignedUp={isSignedUp}
          message={message}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
