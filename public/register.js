const $name = document.getElementById('name');
const $email = document.getElementById('email');
const $username = document.getElementById('username');
const $password = document.getElementById('password');
const $password2 = document.getElementById('password2');
const $sbt  = document.querySelector('form button');

let advanced = [$username, $password, $password2];
advanced.forEach((el) => {
    el.style.display = 'none';
})

$email.addEventListener('change', (e) => {
    advanced.forEach((el) => {
        el.style.display = 'block';
    })
})

$sbt.addEventListener('click', (e) => {
    console.log(e.target);
    let name, email, username, password;
    
    e.preventDefault();
    if(checkForXSS($name.value)) {
        setTimeout(() => {
            alert('Please Stop messin with us ;)');
        }, 3000);
    }else {
        name = $name.value;
        
        if(checkForXSS($email.value)) {
            setTimeout(() => {
                alert('Please Stop messin with us ;)');
            }, 3000);
        }else {
            email = $email.value;
            
            
            if(checkForXSS($username.value)) {
                setTimeout(() => {
                    alert('Please Stop messin with us ;)');
                }, 3000);
            }else {
                username = $username.value;
                
                
                if($password.value == $password2.value) {
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
                        
                    })
                    .catch((error) => {
                        console.log(error);
                        
                    });
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
        bubbles[i] = new Bubble(width, a, i, n);

    }
}


function checkForXSS(input) {
    return false;
}


