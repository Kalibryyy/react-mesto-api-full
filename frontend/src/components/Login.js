import React from 'react';

function Login(props) {
  const [formValues, setFormValues] = React.useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value, // объект меняется при каждом изменении, в setFormValues возвращаем этот новый объект, кот состоит из старых и нового перезаписанного поля
    });
  };

  function handleSubmit(e) {
    e.preventDefault();

    const { email, password } = formValues;

    // Передаю значения управляемых компонентов во внешний обработчик
    props.onFormSubmit({
      email,
      password,
    });
  }

  return (
    <div className="modal modal_opened modal_type_auth">
      <form className="form__container" onSubmit={handleSubmit}>
        <h2 className="modal__title modal__title_type_auth">Вход</h2>
        <input
          type="email"
          className="modal__input modal__input_type_auth"
          name="email"
          placeholder="Email"
          minLength="1"
          maxLength="30"
          required
          onChange={handleInputChange}
        />
        <input
          type="password"
          className="modal__input modal__input_type_auth"
          name="password"
          placeholder="Пароль"
          required
          onChange={handleInputChange}
        />
        <button type="submit" className="modal__btn modal__btn_type_auth">
          Войти
        </button>
      </form>
    </div>
  );
}

export default Login;
