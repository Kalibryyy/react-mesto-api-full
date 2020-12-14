import React from 'react';
import basketImage from '../images/element-trash.png';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Card(props) {
    const currentUser = React.useContext(CurrentUserContext);

    function handleClick() {
        props.onCardClick(props.card);
    } 

    function handleDeleteClick() {
        props.onCardDelete(props.card._id);
    }

    // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
    const isLiked = props.card.likes.some(i => i._id === currentUser._id);

    // Создаём переменную, которую после зададим в `className` для кнопки лайка
    const cardLikeButtonClassName = (`elements__like ${isLiked && 'elements__like_active'}`);  

    function handleLikeClick() {
        props.onCardLike(props.card);
    }

    return (
        <>
            {props.card.owner._id === currentUser._id && <img src={basketImage} alt="иконка мусорной корзины" className="elements__basket" onClick={handleDeleteClick} />}
            <img src={props.card.link} alt={props.card.name} className="elements__image" onClick={handleClick} />
            <div className="elements__footer">
                <h2 className="elements__text">{props.card.name}</h2>
                <div className="elements__like-container">
                    <button className={cardLikeButtonClassName} type="button" onClick={handleLikeClick}></button>
                    <div className="elements__likes-number">{props.card.likes.length}</div>
                </div>   
            </div>
        </>
    )       
}

export default Card;
