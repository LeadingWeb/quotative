let quotes;
const numberOfCards = 4;
let activeQuotes = [];




function pickRandomQuote() {
    let index = Math.floor(Math.random() * quotes.length);
    return quotes[index];
}

(async function loadQuotes() {
    const res = await fetch('./assets/quotes.json');
    quotes = await res.json();

    buddha_quotes = quotes.filter(function (item) {
        return item.author === "Buddha";
    });
    

    for (let i = 0; i < numberOfCards; i++) {
        activeQuotes.push(pickRandomQuote());
    }
    console.log(activeQuotes)
    CARDS = createCards(numberOfCards);

    CARDS[CARDS.length - 1].obj.addEventListener('animationend', (e) => {
    
        deleteCurrentCard();
        updateCards();
    })

})();

