const express = require('express');

const app = express();
const PORT = 5000;

const monk  = require('monk');
const dbUrl = `localhost/inspire`;
const db = monk(dbUrl);


const dbNewQuotes = db.get('newQuotes');
const dbOldQuotes = db.get('oldQuotes');
const dbUsers = db.get('user');
const dbCookies = db.get('cookies');

const bcrypt = require('bcryptjs');
const ejs = require('ejs');

const cookieParser = require('cookie-parser');


const server = app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`)
});


app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'ejs');






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

app.post('/swipe', (req, res) => {

    console.log(req.body);
    
    let theQuote = req.body.quote;
    let like = req.body.like;
    let user = req.body.user;
    dbNewQuotes.find()
        .then(allQuotes => {
            let foundQuote = allQuotes.find((v) => {
                return v.text == theQuote;
            })
            console.log(foundQuote);
            
            let likeObj = {
                user: user,
                like: like,
                date: new Date()
            };

            let reQuote;
            if(foundQuote.like == undefined) {
                console.log('undefined');
                reQuote = {
                    author: foundQuote.author,
                    text: foundQuote.text,
                    like: [likeObj]
                };

            }else {

                let oldLikes = foundQuote.like;
                oldLikes.push(likeObj);
                reQuote = {
                    author: foundQuote.author,
                    text: foundQuote.text,
                    like: oldLikes
                };
            }


            
            dbNewQuotes.findOneAndDelete({_id: foundQuote._id}).then((doc) => {
                //console.log(doc);
                
                dbNewQuotes
                .insert(reQuote)
                .then(createdQuote => {
                    //console.log(createdQuote);
                    res.send(createdQuote);
                })
                
            });
            

        })
});




app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {

    console.log(req.body, 'REQ.BODY');



    dbUsers.find()
        .then(allUsers => {
            console.log(allUsers, 'ALL USERS');
            const foundMail = allUsers.find(element => element.email == req.body.email);
            console.log(foundMail, 'FOUND MAIL');
            const foundUser = allUsers.find(element => element.username == req.body.username);
            console.log(foundUser, 'FOUND USER');

            

            if(foundMail != undefined || foundUser != undefined) {

                res.json({msg: 'Username or Email already exist!', value: 0});
            }else if (foundMail == undefined && foundUser == undefined) {


                let quotesBlueprint = (() => {
                    let arr = [];
                    for(let i = 0; i < 3; i++) {
                        arr[i] = [];
            
                    }
                    return arr;
                })
            
                
                let newUser = {
                    name: validateData(req.body.name),
                    email: validateData(req.body.email),
                    username: validateData(req.body.username),
                    password: validateData(req.body.password),
                    likes: quotesBlueprint(),
                    date: new Date(),
                    quotes: []
                };
            
            
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        newUser.password = hash;
                        console.log(newUser);
                        
                        dbUsers.insert(newUser)
                            .then(createdUser => {
                                console.log(createdUser)
                                res.json({msg: 'registration was succesfull', value: 1});
                            })
                    });
                })

            }
            
        })
    
    

})


app.get('/first-login', (req, res) => {
    res.render('first-login');
})

app.post('/first-login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    dbUsers.find()
        .then(allUsers => {
            const foundUser = allUsers.find(element => element.email == req.body.email);
            if (foundUser == undefined) {
                res.json({msg: 'There is no account for this email address, please <a href="/register"> register</a>', value: 0});
            } else {
                bcrypt.compare(password, foundUser.password, function(err, resu) {
                    console.log(resu);
                    if (err) {
                        console.log(err)
                    }
                    if(resu) {
                        //res.render('app');

                        
                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(foundUser.password, salt, (err, hash) => {


                                let newCookie = {
                                    username: foundUser.username,
                                    secret: hash
                                };

                                let obj = {
                                    cookie: newCookie,
                                    user: foundUser,
                                    sessions: []
                                };   

                                dbCookies.insert(obj)
                                    .then(createdCookie => {
                                        console.log(createdCookie);
                                        
                                        res.cookie(foundUser.username, `${newCookie.secret}`);

                                        console.log(`User ${foundUser.name} logged in`);

                                        res.json({msg: `Hi ${foundUser.name}`, value: 1});

                                    })
                            });
                        })

                        
                        
                    }else {
                        res.json({msg: `Wrong Password`, value: 0});
                    }
                });
            }

        })
})





app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    dbUsers.find()
        .then(allUsers => {
            const foundUser = allUsers.find(element => element.email == req.body.email);
            if (foundUser == undefined) {
                res.json({msg: 'There is no account for this email address, please <a href="/register"> register</a>', value: 0});
            } else {
                bcrypt.compare(password, foundUser.password, function(err, resu) {
                    console.log(resu);
                    if (err) {
                        console.log(err)
                    }
                    if(resu) {
                        //res.render('app');

                        console.log(req.cookies[`${foundUser.username}`]);
                        dbCookies.find()
                            .then(cookies => {
                                const foundCookie = cookies.find(element => element.cookie.secret == req.cookies[`${foundUser.username}`])

                                if (foundCookie != undefined) {
                                    
                                    let cookieNames = Object.keys(req.cookies);
                                    let cookieName = cookieNames.find(element => element == foundCookie.cookie.username);
                                    if(cookieName != undefined) {
                                        //Logged in via cookie

                                        console.log(`User ${foundUser.name} logged in`);

                                        res.json({msg: `Hi ${foundUser.name}`, value: 1});

                                    }
                                } else {

                                    bcrypt.genSalt(10, (err, salt) => {
                                        bcrypt.hash(foundUser.password, salt, (err, hash) => {
            
            
                                            let newCookie = {
                                                username: foundUser.username,
                                                secret: hash
                                            };

                                            let obj = {
                                                cookie: newCookie,
                                                user: foundUser,
                                                sessions: []
                                            };   

                                            dbCookies.insert(obj)
                                                .then(createdCookie => {
                                                    console.log(createdCookie);
                                                    
                                                    res.cookie(foundUser.username, `${newCookie.secret}`);

                                                    console.log(`User ${foundUser.name} logged in`);
            
                                                    res.json({msg: `Hi ${foundUser.name}`, value: 1});
            
                                                })
                                        });
                                    })

                                }
                            })

                        
                        

                        
                        
                    }else {
                        res.json({msg: `Wrong Password`, value: 0});
                    }
                });
            }

        })
})


app.get('/app', (req, res) => {
    res.render('app');
})
app.get('/welcome', (req, res) => {
    res.render('welcome');
})

function validateData(data) {
    return data;
}