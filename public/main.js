const $avatar = document.getElementById('avatar');
const $username = document.getElementById('username');
const $name = document.getElementById('name');
let username, name;

(function disableScroll() {
    document.body.style.overflow = 'hidden';
    document.querySelector('html').scrollTop = window.scrollY;
})();
document.querySelector('body').addEventListener('overflow', (e) => {
    console.log('scrollig' + e);
})

window.addEventListener('load', (e) => {
    username = $username.textContent;
    name = $name.textContent;
    let firstL = username[0];
    $avatar.innerHTML = `<a href='/myprofile' id='avatar-p'>${username}.</a>`;
})