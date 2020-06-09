const $name = document.getElementById('name');
const $email = document.getElementById('email');
const $username = document.getElementById('username');
const $password = document.getElementById('password');
const $password2 = document.getElementById('password2');
const $sbt  = document.querySelector('form button');
const $message = document.getElementById('message');
let status = 0;

let advanced = [$username, $password, $password2];
advanced.forEach((el) => {
    el.style.display = 'none';
})

$email.addEventListener('focus', (e) => {
    advanced.forEach((el) => {
        el.style.display = 'block';
    })
})

$sbt.addEventListener('click', (e) => {
    
    let name, email, username, password;
    
    e.preventDefault();
    if(checkForXSS($name.value)) {
        setTimeout(() => {
        }, 3000);
    }else {
        name = $name.value;
        
        if(checkForXSS($email.value)) {
            setTimeout(() => {
            }, 3000);
        }else {
            email = $email.value;
            
            
            if(checkForXSS($username.value)) {
                setTimeout(() => {
                }, 3000);
            }else {
                username = $username.value;
                console.log(name, email, username, $password.value, $password2.value);
                
                
                if($password.value == $password2.value) {
                    if($name.value.length > 5 && $email.value.length > 5 && $username.value.length > 5 && $password.value.length > 5) {

                        password = $password.value;
                        
                    
                        startLoadingAnimation();
                        
                        const data = {name, email, username, password};
                        //console.log(data);
                        fetch('/register', {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(data),
                        })
                        .then((response) => response.json())
                        .then((data) => {
                            console.log("Success:", data);
                            if(data.value == 1) {
                                startLoadingAnimation();
                                status = 1
                            }else if(data.value == 0) {
                                status = 0;
                                
                            }
                            $message.textContent = data.msg;
                            
                        })
                        .catch((error) => {
                            console.log(error);
                            
                        });



                    }else {
                        
                        $message.textContent = 'Please use at least 6 letters!';
                    }

                    
                    
                }else {
                    
                    $message.textContent = "Your Passwords don't match";
                }
                
                
            }
            
            
        }
        
        
    }
    
    
    
    
})

function startLoadingAnimation() {
    let bubbles = [];
    let n = 100;
    for(let i =0; i < n; i++) {
        let width = 100 - i * i * 0.001;
        let a = 1 - i * 0.08;
        let what = function() {
            if(status == 1) {
                window.location.replace("/first-login");
            }
            
        }
        bubbles[i] = new Bubble(width, a, i, n, what);

    }
}


function checkForXSS(input) {
    const xss = validateXSS(input);
    console.log(xss);
    if(xss != 0) {
        $message.textContent = 'Please stop messing with us!';
        return true;
    } else return false;
}


