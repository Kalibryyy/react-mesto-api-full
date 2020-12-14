import React from 'react';
import PopupWithForm from './PopupWithForm';

function AddPlacePopup(props) {
    const placeLinkRef = React.useRef();
    const placeNameRef = React.useRef();

    function handleSubmit(e) {
        e.preventDefault();

        props.onAddPlace({
            name: placeNameRef.current.value,
            link: placeLinkRef.current.value
        });
    }

    return (
        <PopupWithForm name={'new-card'} title={'Новое место'} isOpen={props.isOpen} onClose={props.onClose} isClose={props.isClose} onSubmit={handleSubmit}>
            <input id="card-name-input" type="text" className="modal__input modal__input_type_name" name="name" placeholder="Название" minLength="1" maxLength="30" required ref={placeNameRef} />
            <span id="card-name-input-error"></span>
            <input id="card-occupation-input" type="url" className="modal__input modal__input_type_occupation" name="link" placeholder="Ссылка на картинку" required ref={placeLinkRef} />
            <span id="card-occupation-input-error"></span>
        </PopupWithForm>

    )
}

export default AddPlacePopup;