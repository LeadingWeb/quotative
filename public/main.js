

(function disableScroll() {
    document.body.style.overflow = 'hidden';
    document.querySelector('html').scrollTop = window.scrollY;
})();
document.querySelector('body').addEventListener('overflow', (e) => {
    console.log('scrollig' + e);
})