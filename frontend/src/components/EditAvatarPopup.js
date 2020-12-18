import React from 'react';
import PopupWithForm from './PopupWithForm';

function EditAvatarPopup(props) {
  const avatarRef = React.useRef();

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
        <PopupWithForm name={'avatar'} title={'Обновить аватар'} isOpen={props.isOpen} onClose={props.onClose} isClose={props.isOpen} onSubmit={handleSubmit}>
            <input id="card-avatar-input" type="url" className="modal__input modal__input_type_occupation" name="link"
            placeholder="Ссылка на картинку" required ref={avatarRef} />
            <span id="card-avatar-input-error"></span>
        </PopupWithForm>
  );
}

export default EditAvatarPopup;
