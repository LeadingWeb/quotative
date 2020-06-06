let quotes;
const numberOfCards = 10;
let activeQuotes = [];




async function pickRandomQuote() {
    const res = await fetch('/get-one');
    const randomQuote = await res.json();
    return randomQuote;
}

(async function loadQuotes() {
    const res = await fetch('/get-ten');
    activeQuotes = await res.json();


    
    console.log(activeQuotes)
    CARDS = createCards(numberOfCards);

    CARDS[CARDS.length - 1].obj.addEventListener('animationend', (e) => {

        let theQuote = CARDS[CARDS.length - 1].text;
        console.log(theQuote);
        sendSwipeData(theQuote);
    
        deleteCurrentCard();
        updateCards();
    })

})();

