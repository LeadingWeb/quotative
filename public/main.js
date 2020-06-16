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
    registerSW();
})

async function registerSW() {
    if('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('./sw.js');

        }
        catch(e) {
            console.log('SW registration failed');
        }
    }
}