import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import PopupWithForm from '../components/PopupWithForm';

function EditProfilePopup(props) {
    const currentUser = React.useContext(CurrentUserContext);

    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');

    React.useEffect(() => {
        setName(currentUser.name);
        setDescription(currentUser.about);
      }, [currentUser]); 


    function handleNameChange(e) {
        setName(e.target.value);
    }

    function handleDescriptionChange(e) {
        setDescription(e.target.value);
    }

    function handleSubmit(e) {
        // Запрещаем браузеру переходить по адресу формы
        e.preventDefault();

        // Передаём значения управляемых компонентов во внешний обработчик
        props.onUpdateUser({
            name,
            about: description,
        });
    }

    return (
        <PopupWithForm name={'profile'} title={'Редактировать профиль'} isOpen={props.isOpen} onClose={props.onClose} isClose={props.isOpen} onSubmit={handleSubmit}>
            <input id="profile-name-input" type="text" className="modal__input modal__input_type_name" name="name" 
            placeholder="Елена Стрижакова" minLength="2" maxLength="40" required onChange={handleNameChange} value={name || ''} />
            <span id="profile-name-input-error"></span>
            <input id="profile-occupation-input" type="text" className="modal__input modal__input_type_occupation" name="link" 
            placeholder="Начинающий веб-разработчик и опытный моряк-путешественник" minLength="2" maxLength="200" required value={description || ''} 
            onChange={handleDescriptionChange} />
            <span id="profile-occupation-input-error"></span>
        </PopupWithForm>
    )
}

export default EditProfilePopup;