import './style.css';
import './app.css';

import logo from './assets/images/logo-universal.png';

document.querySelector('#app').innerHTML = `
    <img id="logo" class="logo">
    <div class="result" id="result">ПРОЕКТ ИНИЦИАЛИЗИРОВАН, ЕБАТЬ!</div>
    <div class="input-box" id="input">
        <button class="btn" onclick="alert('Логики пока нет!')">Greet</button>
    </div>
`;
document.getElementById('logo').src = logo;