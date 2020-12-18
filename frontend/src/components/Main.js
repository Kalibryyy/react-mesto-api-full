import React from 'react';
import Card from './Card';
import CurrentUserContext from '../contexts/CurrentUserContext';

function Main(props) {
  const currentUser = React.useContext(CurrentUserContext);

  return (
        <main className="content">
        <section className="profile">
            <div className="profile__info">
                <button className="profile__avatar" onClick={props.onEditAvatar} type="button" style={{ backgroundImage: `url(${currentUser.avatar})` }}></button>
                <div className="profile__data" >
                    <div className="profile__wrap">
                        <h1 className="profile__name">{currentUser.name}</h1>
                        <button className="profile__edit-button hover" type="button" onClick={props.onEditProfile}></button>
                    </div>
                    <p className="profile__occupation">{currentUser.about}</p>
                </div>
            </div>
            <button className="profile__add-button hover" onClick={props.onAddPlace}>+</button>
        </section>
        <section className="elements">
            <ul className="elements__list">
                {props.cards.map((card) => (
                    <li className="elements__item" key={card._id}>
                        <Card card={card} onCardClick={props.onCardClick} userId={currentUser._id} onCardDelete={props.onCardDelete} onCardLike={props.onCardLike} />
                    </li>
                ))}
            </ul>
        </section>
        {props.isLoading && <div className="spinner"><i></i></div>}
        </main>
  );
}

export default Main;
