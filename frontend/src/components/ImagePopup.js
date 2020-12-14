import React from 'react'; 
import closeIcon from '../images/close-icon.svg';

function ImagePopup(props) {
    return (
        <div className={props.card.link ? `modal modal_type_picture modal_opened` : `modal modal_type_picture`}>
        <div className="modal__overlay modal__overlay_image"></div>
        <div className="modal__wrapper">
            <img src={props.card.link} alt={props.card.name} className="modal__picture-image" />
            <p className="modal__picture-text">{props.card.name}</p>
            <img src={closeIcon} alt="закрывающая иконка" className="modal__close hover" onClick={props.onClose} />
        </div>
    </div>
    )
}

export default ImagePopup;