import React from "react";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import PopupWithForm from "./PopupWithForm";
import EditProfilePopup from "./EditPropfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import Register from "./Register.jsx";
import Login from "./Login.jsx";
import InfoToolTip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";
import { api } from "../utils/Api";
import * as auth from "../utils/Auth";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(
    false
  );
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(
    false
  );
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isSpinnerLoading, setIsSpinnerLoading] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isAuthPopupOpen, setIsAuthPopupOpen] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState({
    email: "",
  });
  const [isSignedUp, setIsSignedUp] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const userEmail = userInfo.email;

  const history = useHistory();

  React.useEffect(() => {
    tokenCheck();
  }, []);

  function handleRegister({ password, email }) {
    auth
      .register(password, email)
      .then((data) => {
        setUserInfo({
          email: data.data.email,
        });
        setIsSignedUp(true);
        setIsAuthPopupOpen(!isAuthPopupOpen);
        history.push("/sign-in");
      })
      .catch((err) => {
        console.log(err)
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
          localStorage.setItem("jwt", data.token);
        }
        setIsLoggedIn(true);
        setUserInfo({
          email: email,
        });
        history.push("/");
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

  function tokenCheck() {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth
        .getContent(jwt)
        .then((res) => {
          if (res.data.email) {
            setUserInfo({
              email: res.data.email,
            })
            setIsLoggedIn(true);
            history.push("/");
          };
        })
        .catch((err) => console.error(err));
    }
  }

  function handleLogOut() {
    localStorage.removeItem("jwt");
    setUserInfo({
      email: '',
    });
    setIsLoggedIn(false);
  }

  React.useEffect(() => {
    setIsSpinnerLoading(true);
    api
      .getAppInfo("users/me", "cards")
      .then((data) => {
        const [userData, cardsArray] = data;
        setCards(cardsArray);
        setCurrentUser(userData);
      })
      .catch((err) => console.log(`Error ${err}`))
      .finally(() => {
        setIsSpinnerLoading(false);
      });
  }, []);

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
    api
      .delete("cards", id)
      .then(() => {
        const newCards = cards.filter((c) => {
          return c._id !== id;
        });
        setCards(newCards);
      })
      .catch((err) => console.log(`Error ${err}`));
  }

  function handleCardLike(card) {
    // Проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    if (!isLiked) {
      // Отправляем запрос в API и получаем обновлённые данные карточки
      api
        .put("cards/likes", card._id)
        .then((newCard) => {
          // Формируем новый массив на основе имеющегося
          const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
          // Обновляем стейт
          setCards(newCards);
        })
        .catch((err) => console.log(`Error ${err}`));
    } else {
      api
        .delete("cards/likes", card._id)
        .then((newCard) => {
          // Формируем новый массив на основе имеющегося
          const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
          // Обновляем стейт
          setCards(newCards);
        })
        .catch((err) => console.log(`Error ${err}`));
    }
  }

  function handleUpdateUser({ name, about }) {
    api
      .updateInfo("users/me", {
        name,
        about,
      })
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => console.log(`Error ${err}`));
  }

  function handleUpdateAvatar({ avatar }) {
    api
      .updateAvatar("users/me/avatar", {
        avatar,
      })
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => console.log(`Error ${err}`));
  }

  function handleAddPlace({ name, link }) {
    api
      .addCard("cards", {
        name,
        link,
      })
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
              title={"Выйти"}
              link={"sign-in"}
              userData={userEmail}
              onLogOut={handleLogOut}
            />
          </Route>
          <Route path="/sign-up">
            <Header isLoggedIn={isLoggedIn} title={"Войти"} link={"sign-in"} />
          </Route>
          <Route path="/sign-in">
            <Header
              isLoggedIn={isLoggedIn}
              title={"Регистрация"}
              link={"sign-up"}
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
            onCardLike={handleCardLike}
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
          onUpdateUser={handleUpdateUser}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          isClose={isAddPlacePopupOpen}
          onAddPlace={handleAddPlace}
        />
        <PopupWithForm name={"confirm-card-del"} title={"Вы уверены?"} />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          isClose={isEditAvatarPopupOpen}
          onCardClick={handleCardClick}
          onUpdateAvatar={handleUpdateAvatar}
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
