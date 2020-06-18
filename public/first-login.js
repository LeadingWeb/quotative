const $email = document.getElementById('email');
const $password = document.getElementById('password');

const $sbt  = document.querySelector('form button');
const $msg = document.getElementById('new-user-msg');





function startLoadingAnimation() {
    let bubbles = [];
    let n = 100;
    for(let i =0; i < n; i++) {
        let width = 100 - i * i * 0.001;
        let a = 1 - i * 0.08;
        let what = function() {

        }
        bubbles[i] = new Bubble(width, a, i, n, what);
        
    }
}
window.addEventListener('load', (e) => {
    startLoadingAnimation();
})


$sbt.addEventListener('click', (e) => {
    //console.log(e.target);
    e.preventDefault();
    let email = $email.value;
    let password = $password.value;

    
    
    //startLoadingAnimation();
    
    const data = {email, password};
    //console.log(data);
    fetch('/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((data) => {
        // console.log("Success:", data);
        if(data.value == 1) {
            // console.log(data.value)
            window.location.replace("/welcome");
        }else {
            $msg.innerHTML = data.msg;
        }
        
    })
    .catch((error) => {
        console.log(error);
        
    });
    
    
    
});
