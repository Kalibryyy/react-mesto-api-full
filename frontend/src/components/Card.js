import React from 'react';
import basketImage from '../images/element-trash.png';
import CurrentUserContext from '../contexts/CurrentUserContext';

function Card(props) {
  const currentUser = React.useContext(CurrentUserContext);

  function handleClick() {
    props.onCardClick(props.card);
  }

  function handleDeleteClick() {
    props.onCardDelete(props.card._id);
  }

  return (
        <>
            {props.card.owner._id === currentUser._id && <img src={basketImage} alt="иконка мусорной корзины" className="elements__basket" onClick={handleDeleteClick} />}
            <img src={props.card.link} alt={props.card.name} className="elements__image" onClick={handleClick} />
            <div className="elements__footer">
                <h2 className="elements__text">{props.card.name}</h2>
            </div>
        </>
  );
}

export default Card;
