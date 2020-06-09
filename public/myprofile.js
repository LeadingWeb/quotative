const $back = document.querySelectorAll('.back');
const $quote = document.querySelector('form textarea');
const $sbt = document.querySelector('form button');
const $libary = document.getElementById('libary');
const $myquotes = document.getElementById('myquotes');
const $message = document.getElementById('message');

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


$sbt.addEventListener('click', (e) => {
    e.preventDefault();
    const quote = $quote.value;
    if(validateXSS(quote)) {
        console.log('XSS!!')
        $message.textContent = 'Please wtrite a valid message';
    }else if (!validateLength(quote, 6)) {
        $message.textContent = 'Pleas use at least 6 letters';
    } else {
        $message.textContent = '';
        const data = {quote: quote};
    
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



/*
function loadNextTenLibary() {
    $libary.innerHTML = '';
    libaryLi = [];
    if(libaryActivePage < libaryPagesMax) {
        libaryActivePage++;
        
        let start = libaryActivePage * perPage;
        let max = start + perPage;
        for(let i = start; i < max +1; i++) {
            drawLibary(myLibary[i].quote, myLibary[i].author);
        }
        createMoreBtnLibary();
        
    } else {
        quoteActivePage = 0;
        let start = quoteActivePage * perPage;
        let max = start + perPage;
        for(let i = start; i < max +1; i++) {
            drawLibary(myLibary[i].quote, myLibary[i].author);
        }
        createMoreBtnLibary();
    }
}*/