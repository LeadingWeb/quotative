const $back = document.querySelectorAll('.back');
const $quote = document.querySelector('form textarea');
const $sbt = document.querySelector('form button');
const $libary = document.getElementById('libary');
const $myquotes = document.getElementById('myquotes');
const $message = document.getElementById('message');

const $username = document.getElementById('hi');

let quotesLi = [];
let libaryLi = [];

let myQuotes, myLibary;

let quotePagesMax, libaryPagesMax;
let quoteActivePage = 0;
let libaryActivePage = 0;
const perPage = 10;







(async function loadMyQuotes() {
    const res = await fetch('/my-quotes');
    myQuotes = await res.json();
    quotesLi = [];
    $myquotes.innerHTML = '';
    quotePagesMax = Math.ceil(myQuotes.length / 10);
    
    if (myQuotes.length <= perPage) {
        quoteActivePage = 0;
        quotePagesMax = 1;
        for(let i = 0; i < myQuotes.length; i++) {
            drawQoute(myQuotes[i].quote);
            
        }
    } else {
        for(let i = 0; i < perPage+1; i++) {
            drawQoute(myQuotes[i].quote);
        }
        createMoreBtnQuotes();
    }
    
    
    
    console.log(quotesLi);
    
    console.log(myQuotes)
    
    
})();

(async function loadMyLibary() {
    const res = await fetch('/my-libary');
    myLibary = await res.json();
    $libary. innerHTML = '';
    libaryLi = [];
    libaryPagesMax = Math.ceil(myQuotes.length / 10);
    if(myLibary.length == 0) {
        
    }else if(myLibary.length <= 10 && myLibary.length > 0) {
        for(let i = 0; i < 10; i++) {
            quoteActivePage = 0;
            if(myLibary[i] != undefined && myLibary[i] != null) {
                drawLibary(await myLibary[i].quote, await myLibary[i].author);
            }
            
            
        }
    }else {
        for(let i = 0; i < 10; i++) {
            quoteActivePage = 0;
            drawLibary(await myLibary[i].quote, await myLibary[i].author);
            
        }
        createMoreBtnLibary();
    }
    
    
    
    console.log(myLibary);
    
    
})();


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

$back.forEach(back => {
    console.log(back)
    back.addEventListener('click', (e) => {
        
        startLoadingAnimation();
        
        window.location.replace("/");
    })
})

let XSSTries = 0;
$sbt.addEventListener('click', (e) => {
    e.preventDefault();
    const quote = $quote.value;
    console.log(quote);
    if(validateXSS(quote) != 0) {
        if(XSSTries > 5) {
            setTimeout(() => {
                
            }, XSSTries * 1000);
        }
        console.log('XSS!!')
        $message.textContent = 'Please write a valid message!';
        XSSTries++;
        $quote.value = '';
    }else if (!validateLength(quote, 6)) {
        $message.textContent = 'Pleas use at least 6 letters';
    } else {
        $message.textContent = '';
        const data = {quote};
        console.log(data);
        
        fetch("/post-quote", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log("Success:", data);
            
            async function loadMyQuotes() {
                const res = await fetch('/my-quotes');
                myQuotes = await res.json();
                
                for(let i = 0; i < myQuotes.length; i++) {
                    drawQoute(myQuotes[i].quote);
                }
                
                //console.log(quotesLi);
                
                //console.log(myQuotes);
                $quote.value = '';
                
                
                startLoadingAnimation();
            }
            
            
            
            loadMyQuotes();
        })
        .catch((error) => {
            console.error("Error:", error);
        });
        
        
    }
    
    
    
})

function drawQoute(quote) {
    const $newQuoteLi = document.createElement('li');
    $newQuoteLi.textContent = quote;
    $newQuoteLi.className = 'quote';
    quotesLi.push($newQuoteLi);
    $myquotes.appendChild($newQuoteLi);
    
    
}
function drawLibary(quote, author) {
    if(quote != undefined && quote != null) {
        const $newQuoteLi = document.createElement('li');
        $newQuoteLi.innerHTML = `${quote} <br> <span id='author-libary'>${author}</span>`;
        $newQuoteLi.className = 'libary-li';
        libaryLi.push($newQuoteLi);
        $libary.appendChild($newQuoteLi);
        
    }
    
    
    
}
function createMoreBtnQuotes() {
    const $newBtnLi = document.createElement('li');
    $newBtnLi.innerHTML = `Next Page`;
    $newBtnLi.className = 'next-page';
    
    $myquotes.appendChild($newBtnLi);
    $newBtnLi.addEventListener('click', (e) => {
        $myquotes.innerHTML = '';
        quoteActivePage++;
        
        if(quoteActivePage >= quotePagesMax) {
            quoteActivePage = 0;
        }
        loadNextTenQuotes();
    })
}
function loadNextTenQuotes() {
    
    if(quoteActivePage == 0) {
        for(let i = 0; i < 10; i++) {
            
            
            drawQoute(myQuotes[i].quote);
            
            
        }
        createMoreBtnQuotes();
    }else if(quoteActivePage < quotePagesMax) {
        let start = (quoteActivePage * perPage) -1;
        let end = start + perPage +1;
        for(let i = start; i < end; i++) {
            if(myQuotes[i] == undefined)break;
            
            drawQoute( myQuotes[i].quote);
            
        }
        createMoreBtnQuotes();
    }else {
        let start = quoteActivePage * perPage -1;
        let end = myLibary.length;
        for(let i = start; i < end; i++) {
            
            drawLibary( myLibary[i].quote, myLibary[i].author);
            
        }
        createMoreBtnQuotes();
    }
    
}





function loadNextTenLibary() {
    if(libaryActivePage == 0) {
        for(let i = 0; i < 10; i++) {
            
            
            drawLibary(myLibary[i].quote, myLibary[i].author);
            
            
        }
        createMoreBtnLibary();
    }else if(libaryActivePage < libaryPagesMax) {
        let start = (libaryActivePage * perPage) -1;
        let end = start + perPage +1;
        for(let i = start; i < end; i++) {
            
            drawLibary( myLibary[i].quote,  myLibary[i].author);
            
        }
        createMoreBtnLibary();
    }else {
        let start = libaryPagesMax * perPage -1;
        let end = myLibary.length;
        for(let i = start; i < end; i++) {
            
            drawLibary( myLibary[i].quote, myLibary[i].author);
            
        }
        createMoreBtnLibary();
    }
    
    
}


function createMoreBtnLibary() {
    const $newBtnLi = document.createElement('li');
    $newBtnLi.innerHTML = `Next Page`;
    $newBtnLi.className = 'next-page';
    
    $libary.appendChild($newBtnLi);
    $newBtnLi.addEventListener('click', (e) => {
        $libary.innerHTML = '';
        libaryActivePage++;
        
        if(libaryActivePage > libaryPagesMax) {
            libaryActivePage = 0;
        }
        loadNextTenLibary();
    })
}


let logoutState = false;
let logoutEl;

//Logout
$username.addEventListener('click', (e) => {
    if (!logoutState) {
        startLogoutAnimation();
        logoutState = true;
    } else {
        $username.removeChild(logoutEl);
        logoutState = false;
    }
    
})

function startLogoutAnimation() {
    startLoadingAnimation();
    const $logout = document.createElement('div');
    const $msg = document.createElement('p');
    $msg.textContent = 'Do you want to Logout?';
    $msg.style.fontSize = '1rem';
    $msg.style.padding = '10px 0';
    const $btn = document.createElement('p');
    $btn.innerHTML = 'Logout';
    $btn.style.fontSize = '2rem';
    $btn.style.textAlign = 'center';
    $btn.style.padding = '20px 0';
    $logout.appendChild($msg); 
    $logout.appendChild($btn);
    $username.appendChild($logout);
    logoutEl = $logout;
    
    $btn.addEventListener('click', (e) => {
        deleteAllCookies(window);
        window.location.replace("/login");
        
    })
}