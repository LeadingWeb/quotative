const $start = document.getElementById('start-app');


function startLoadingAnimation() {
    let bubbles = [];
    let n = 300;
    for(let i =0; i < n; i++) {
        let width = 100 - i * i * 0.001;
        let a = 1 - i * 0.08;
        let what = function() {
            if(status == 1) {
                
            }
            
        }
        bubbles[i] = new Bubble(width, a, i, n, what);

    }
}

$start.addEventListener('click', (e) => {

    startLoadingAnimation();
    
    window.location.replace("/app");
})