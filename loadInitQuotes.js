const monk  = require('monk');
const dbUrl = `localhost/inspire`;
const db = monk(dbUrl);


const dbNewQuotes = db.get('newQuotes');
const dbOldQuotes = db.get('oldQuotes');
const dbUsers = db.get('user');



function loadInitialQuotes() {
    const initQuotes = require('./quotes.json');
    initQuotes.forEach(quote => {
        dbNewQuotes.insert(quote).then(createdQuote => {
            console.log(createdQuote);
        });
    });
}