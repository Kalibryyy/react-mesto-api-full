import React from 'react';
import { Link } from 'react-router-dom';

function Header({
  isLoggedIn, title, link, userData, onLogOut,
}) {
  return (
    <>
        <div className="logo"></div>
        <div className="header__auth-title-wrapper">
            {isLoggedIn && <h2 className="header__auth-title">{userData}</h2>}
            <Link to={link} className={isLoggedIn ? 'header__auth-title header__auth-title_type_exit' : 'header__auth-title'} onClick={onLogOut}>{title}</Link>
        </div>
    </>
  );
}

export default Header;
