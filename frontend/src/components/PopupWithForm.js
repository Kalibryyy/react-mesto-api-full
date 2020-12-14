import React from 'react';
import closeIcon from '../images/close-icon.svg';

function PopupWithForm(props) {
    return (
        <div className={props.isOpen ? `modal modal_type_${props.name} modal_opened` : `modal modal_type_${props.name}`}> 
            <div className="modal__overlay"></div>
            <form className={`modal__container modal__container_type_${props.name}`} onSubmit={props.onSubmit}>
                <img src={closeIcon} alt="закрывающая иконка" className="modal__close hover" onClick={props.onClose} />
                <h2 className="modal__title">{props.title}</h2>
                {props.children}
                <button type="submit" className="modal__btn">
                    Сохранить
                </button>
            </form>
        </div>
    )
}

export default PopupWithForm;