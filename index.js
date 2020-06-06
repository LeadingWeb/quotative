const express = require('express');

const app = express();
const PORT = 5000;

const monk  = require('monk');
const dbUrl = `localhost/inspire`;
const db = monk(dbUrl);

const dbNewQuotes = db.get('newQuotes');
const dbOldQuotes = db.get('oldQuotes');

const server = app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`)
});


function pickRandomQuotes(n) {
    
    let randomQuotes = [];

    dbNewQuotes.find().then(allQuotes => {
        
        for (let i = 0; i < n; i++) {
            let index = Math.floor(Math.random() * allQuotes.length);
            randomQuotes[i] = allQuotes[index];
        }
        console.log(randomQuotes);

        return randomQuotes;
    })
}




function loadInitialQuotes() {
    const initQuotes = require('./assets/quotes.json');
    initQuotes.forEach(quote => {
        dbNewQuotes.insert(quote).then(createdQuote => {
            console.log(createdQuote);
        });
    });
}






app.use(express.static('public'));




//Routes

app.get('/', (req, res) => {
    //res.send('hallo')
})

app.get('/get-ten/', (req, res) => {
    
    let randomQuotes = [];

    dbNewQuotes.find().then(allQuotes => {
        
        for (let i = 0; i < 10; i++) {
            let index = Math.floor(Math.random() * allQuotes.length);
            randomQuotes[i] = allQuotes[index];
        }
        res.send(randomQuotes);
    });
});

app.get('/get-one', (req, res) => {
    
    let randomQuote;

    dbNewQuotes.find().then(allQuotes => {
        
        let index = Math.floor(Math.random() * allQuotes.length);
        randomQuote = allQuotes[index];
        res.send(randomQuote);
    });
});