const wrapper = document.querySelector(".wrapper");
let midpoint = Math.floor(screen.width / 2);
let CARDS = [];
let colors = [];
let currentLike = 0;
currentUser = 'Fabio';

const fonts = [
  "Montserrat, sans-serif",
  "Anton, sans-serif",
  "Dancing Script, cursive",
  "Lobster, cursive",
  "Quicksand, sans-serif",
];

function createCards(n) {
  let cards = [];
  for (let i = 0; i < n; i++) {
    cards[i] = { obj: document.createElement("div"), text: "", author: "" };

    cards[i].author = activeQuotes[i].author;
    cards[i].text = activeQuotes[i].text;
    cards[i].obj.className = "card";

    const quoteP = createQuoteP(activeQuotes[i]);
    cards[i].obj.appendChild(quoteP);
    const authorP = createAuthorP(activeQuotes[i]);
    cards[i].obj.appendChild(authorP);

    wrapper.appendChild(cards[i].obj);
  }
  return cards;
}

function createQuoteP(quote) {
  const quoteP = document.createElement("p");

  quoteP.style.fontSize = "2rem";
  quoteP.style.letterSpacing = "10px";
  const index = Math.floor(Math.random() * fonts.length);
  quoteP.style.fontFamily = fonts[index];

  quoteP.textContent = quote.text;
  return quoteP;
}
function createAuthorP(quote) {
  const authorP = document.createElement("p");

  authorP.style.letterSpacing = "0.7rem";
  authorP.textContent = quote.author;
  return authorP;
}

function deleteCurrentCard() {
  let element = CARDS[CARDS.length - 1].obj;
  console.log(element);

  CARDS.splice(CARDS.length - 1, 1);
  console.log(CARDS);
  element.remove();
  activeQuotes.splice(activeQuotes.length - 1, 1);
}


function swipe(event) {
  midpoint = Math.floor(screen.width / 2);
  let touch = event.targetTouches[0];
  let pX = touch.pageX;

  if (pX > midpoint) {
    CARDS[CARDS.length - 1].obj.style.animation = "swipe-right 0.5s";
    currentLike = 1;

    

  } else {

    CARDS[CARDS.length - 1].obj.style.animation = "swipe-left 0.5s";
    currentLike = 0;
    


  }
}

async function updateCards() {
  const div = document.createElement("div");
  div.className = "card";

  let newQuote = await pickRandomQuote();
  //console.log(newQuote);

  wrapper.prepend(div);

  let element = {
    obj: div,
    text: newQuote.text,
    author: newQuote.author,
  };

  const quoteP = createQuoteP(newQuote);
  div.appendChild(quoteP);
  const authorP = createAuthorP(newQuote);
  div.appendChild(authorP);

  activeQuotes.splice(0, 0, newQuote);
  CARDS.splice(0, 0, element);

  CARDS[CARDS.length - 1].obj.addEventListener("animationend", (e) => {
    let theQuote = CARDS[CARDS.length - 1].text;
    console.log(theQuote);
    sendSwipeData(theQuote);
    deleteCurrentCard();
    updateCards();
  });
}


function sendSwipeData(quote) {

    const data = {like: currentLike, user: currentUser , quote: quote};

    fetch("/swipe", {
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
        console.error("Error:", error);
      });
}