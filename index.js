const express = require('express');

const app = express();
const PORT = 5000;

const monk  = require('monk');
const dbUrl = `localhost/inspire`;
const db = monk(dbUrl);

let currentlyLoggedIn = [];


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
    
    
    
    let cookieNames = Object.keys(req.cookies);
    console.log('COOKIE NAMES ON CLIENT: ',cookieNames);
    if (cookieNames == undefined || cookieNames.length == 0) {
        res.render('login');
    } else {
        
        dbCookies.find()
        .then(cookies => {
            //console.log('ALL COOKIES: ', cookies);
            
            
            let matches = [];
            
            for(let i = 0; i < cookieNames.length; i++) {
                for(let j = 0; j < cookies.length; j++) {
                    
                    if (cookies[j].cookie.username == cookieNames[i]) {
                        const data = {
                            username: cookies[j].cookie.username,
                            name: cookies[j].user.name,
                        }
                        matches.push(data);
                        
                    }
                }
            }
            let user;
            if(matches.length < 2) {
                //console.log('SUCCESS: ', matches[0]);
                name = matches[0];
                res.render('app', matches[0]);
            } else if (matches.length >= 2){
                console.log('SUCCESS: ', matches[matches.length - 1]);
                name = matches[matches.length - 1]
                res.render('app', matches[matches.length - 1]);
            } else {
                console.log('ERROR');
                res.render('login');
            }
            
        })
        
    }
    
    
    
    
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
    let theQuote = req.body.quote;
    let quoteAuthor = req.body.author;
    let like = Math.floor(req.body.like);
    console.log('QUOTE AUTHOR:   ', quoteAuthor);
    
    let cookieNames = Object.keys(req.cookies);
    //console.log('COOKIE NAMES ON CLIENT: ',cookieNames);
    if (cookieNames == undefined || cookieNames.length == 0) {
        res.render('login');
    } else {
        
        dbCookies.find()
        .then(cookies => {
            //console.log('ALL COOKIES: ', cookies);
            
            
            let matches = [];
            
            for(let i = 0; i < cookieNames.length; i++) {
                for(let j = 0; j < cookies.length; j++) {
                    
                    if (cookies[j].cookie.username == cookieNames[i]) {
                        const data = {
                            username: cookies[j].cookie.username,
                            name: cookies[j].user.name,
                        }
                        matches.push(data);
                        
                    }
                }
            }
            
            
            let user;
            if(matches.length < 2) {
                //console.log('SUCCESS: ', matches[0]);
                name = matches[0].username;
                
                dbUsers.find()
                .then(allUsers => {
                    const currentUser = allUsers.find(element => element.username == name);
                    //console.log(currentUser);
                    const user = currentUser.username;
                    const currentUserLikes = currentUser.likes;
                    //console.log(currentUserLikes);
                    
                    let likeObj = {
                        user: user,
                        like: like,
                        date: new Date(),
                        quote: theQuote,
                        author: quoteAuthor
                    };
                    let newUserLikes;
                    
                    if(currentUser.likes == null || currentUser.likes == undefined) {
                        
                        //console.log('currentUserLikes is undefined');
                        let arr = [];
                        for(let i = 0; i < 3; i++) {
                            arr[i] = [];
                            
                        }
                        
                        
                        
                        newUserLikes = arr;
                        //console.log(newUserLikes);
                        newUserLikes[like] = [likeObj];
                        //console.log('newUser Likes', newUserLikes, 'NewLikes length', newUserLikes.length);
                        
                    }else {
                        currentUserLikes[like].push(likeObj);
                        newUserLikes = currentUserLikes;
                        //console.log('newUser Likes', newUserLikes, 'NewLikes length', newUserLikes.length);
                    }
                    let newUser = {
                        name: currentUser.name,
                        email: currentUser.email,
                        username: currentUser.username,
                        password: currentUser.password,
                        likes: newUserLikes,
                        date: currentUser.date,
                        quotes: currentUser.quotes
                    };
                    
                    
                    
                    
                    
                    
                    
                    dbNewQuotes.find()
                    .then(allQuotes => {
                        let foundQuote = allQuotes.find((v) => {
                            return v.text == theQuote;
                        })
                        //console.log(foundQuote);
                        
                        
                        
                        let reQuote;
                        if(foundQuote.like == undefined) {
                            //console.log('undefined');
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
                                
                                dbUsers.findOneAndDelete({_id: currentUser._id}).then((doc) => {
                                    //console.log(doc);
                                    
                                    dbUsers
                                    .insert(newUser)
                                    .then(createdUser => {
                                        //console.log(createdUser);
                                        //res.send(createdUser);
                                        
                                        
                                        
                                        
                                        
                                    }).catch(err => console.log(err));
                                    
                                }).catch(err => console.log(err));
                                
                                
                                
                                
                                
                            })
                            
                        }).catch(err => console.log(err));
                        
                        
                    })
                    
                    
                    
                    
                    
                    
                })
                
            } else if (matches.length >= 2){
                //console.log('SUCCESS: ', matches[matches.length - 1]);
                name = matches[matches.length - 1].username;
                dbUsers.find()
                .then(allUsers => {
                    const currentUser = allUsers.find(element => element.username == name);
                    //console.log(currentUser);
                    const user = currentUser.username;
                    const currentUserLikes = currentUser.likes;
                    //console.log(currentUserLikes);
                    
                    let likeObj = {
                        user: user,
                        like: like,
                        date: new Date(),
                        quote: theQuote,
                        author: quoteAuthor
                    };
                    let newUserLikes;
                    
                    if(currentUser.likes == null || currentUser.likes == undefined) {
                        
                        //console.log('currentUserLikes is undefined');
                        let arr = [];
                        for(let i = 0; i < 3; i++) {
                            arr[i] = [];
                            
                        }
                        
                        
                        
                        newUserLikes = arr;
                        //console.log(newUserLikes);
                        newUserLikes[like] = [likeObj];
                        //console.log('newUser Likes', newUserLikes, 'NewLikes length', newUserLikes.length);
                        
                    }else {
                        currentUserLikes[like].push(likeObj);
                        newUserLikes = currentUserLikes;
                        //console.log('newUser Likes', newUserLikes, 'NewLikes length', newUserLikes.length);
                    }
                    let newUser = {
                        name: currentUser.name,
                        email: currentUser.email,
                        username: currentUser.username,
                        password: currentUser.password,
                        likes: newUserLikes,
                        date: currentUser.date,
                        quotes: currentUser.quotes
                    };
                    
                    
                    
                    
                    
                    
                    
                    dbNewQuotes.find()
                    .then(allQuotes => {
                        let foundQuote = allQuotes.find((v) => {
                            return v.text == theQuote;
                        })
                        //console.log(foundQuote);
                        
                        
                        
                        let reQuote;
                        if(foundQuote.like == undefined) {
                            //console.log('undefined');
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
                                
                                dbUsers.findOneAndDelete({_id: currentUser._id}).then((doc) => {
                                    //console.log(doc);
                                    
                                    dbUsers
                                    .insert(newUser)
                                    .then(createdUser => {
                                        //console.log(createdUser);
                                        //res.send(createdUser);
                                        
                                        
                                        
                                        
                                        
                                    }).catch(err => console.log(err));
                                    
                                }).catch(err => console.log(err));
                                
                                
                                
                                
                                
                            })
                            
                        }).catch(err => console.log(err));
                        
                        
                    })
                    
                    
                    
                    
                    
                    
                })
            } else {
                console.log('ERROR');
                res.render('login');
            }
            
        })
        
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
});




app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    
    //console.log(req.body, 'REQ.BODY');
    
    
    
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
            
            
            
            let arr = [];
            for(let i = 0; i < 3; i++) {
                arr[i] = [];
                
            }
            
            
            
            let newUser = {
                name: validateData(req.body.name),
                email: validateData(req.body.email),
                username: validateData(req.body.username),
                password: validateData(req.body.password),
                likes: arr,
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
                                currentlyLoggedIn.push(createdCookie);
                                
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
                                currentlyLoggedIn.push(foundCookie);
                                
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
                                        currentlyLoggedIn.push(createdCookie);
                                        
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



app.get('/welcome', (req, res) => {
    console.log(req.cookies);    
    
    dbCookies.find()
    .then(cookies => {
        //console.log('ALL COOKIES: ', cookies);
        
        let cookieNames = Object.keys(req.cookies);
        console.log('COOKIE NAMES ON CLIENT: ',cookieNames);
        let matches = [];
        
        for(let i = 0; i < cookieNames.length; i++) {
            for(let j = 0; j < cookies.length; j++) {
                
                if (cookies[j].cookie.username == cookieNames[i]) {
                    const data = {
                        username: cookies[j].cookie.username,
                        name: cookies[j].user.name,
                    }
                    matches.push(data);
                    
                }
            }
        }
        let user;
        if(matches.length < 2) {
            console.log('SUCCESS: ', matches[0]);
            name = matches[0];
            res.render('welcome', matches[0]);
        } else if (matches.length >= 2){
            console.log('SUCCESS: ', matches[matches.length - 1]);
            name = matches[matches.length - 1]
            res.render('welcome', matches[matches.length - 1]);
        } else {
            console.log('ERROR');
            res.render('first-login');
        }
        
    })
    
})



app.get('/app', (req, res) => {
    
    
    let cookieNames = Object.keys(req.cookies);
    console.log('COOKIE NAMES ON CLIENT: ',cookieNames);
    if (cookieNames == undefined || cookieNames.length == 0) {
        res.render('login');
    } else {
        
        dbCookies.find()
        .then(cookies => {
            //console.log('ALL COOKIES: ', cookies);
            
            
            let matches = [];
            
            for(let i = 0; i < cookieNames.length; i++) {
                for(let j = 0; j < cookies.length; j++) {
                    
                    if (cookies[j].cookie.username == cookieNames[i]) {
                        const data = {
                            username: cookies[j].cookie.username,
                            name: cookies[j].user.name,
                        }
                        matches.push(data);
                        
                    }
                }
            }
            let user;
            if(matches.length < 2) {
                console.log('SUCCESS: ', matches[0]);
                name = matches[0];
                res.render('app', matches[0]);
            } else if (matches.length >= 2){
                console.log('SUCCESS: ', matches[matches.length - 1]);
                name = matches[matches.length - 1]
                res.render('app', matches[matches.length - 1]);
            } else {
                console.log('ERROR');
                res.render('login');
            }
            
        })
        
    }
    
    
    
    
    
    
    
    
})


app.get('/myprofile', (req, res) => {
    
    
    let cookieNames = Object.keys(req.cookies);
    console.log('COOKIE NAMES ON CLIENT: ',cookieNames);
    if (cookieNames == undefined || cookieNames.length == 0) {
        res.render('login');
    } else {
        
        dbCookies.find()
        .then(cookies => {
            //console.log('ALL COOKIES: ', cookies);
            
            
            let matches = [];
            
            for(let i = 0; i < cookieNames.length; i++) {
                for(let j = 0; j < cookies.length; j++) {
                    
                    if (cookies[j].cookie.username == cookieNames[i]) {
                        const data = {
                            username: cookies[j].cookie.username,
                            name: cookies[j].user.name,
                        }
                        matches.push(data);
                        
                    }
                }
            }
            let user;
            if(matches.length < 2) {
                console.log('SUCCESS: ', matches[0]);
                name = matches[0].username;
                
                dbUsers.find()
                .then(allUsers => {
                    const currentUser = allUsers.find(element => element.username == name);
                    res.render('myprofile', currentUser);
                })
                
            } else if (matches.length >= 2){
                console.log('SUCCESS: ', matches[matches.length - 1]);
                name = matches[matches.length - 1].username;
                dbUsers.find()
                .then(allUsers => {
                    const currentUser = allUsers.find(element => element.username == name);
                    res.render('myprofile', currentUser);
                })
            } else {
                console.log('ERROR');
                res.render('login');
            }
            
        })
        
    }
    
})




app.get('/my-quotes', (req, res) => {
    
    
    let cookieNames = Object.keys(req.cookies);
    console.log('COOKIE NAMES ON CLIENT: ',cookieNames);
    if (cookieNames == undefined || cookieNames.length == 0) {
        res.render('login');
    } else {
        
        dbCookies.find()
        .then(cookies => {
            //console.log('ALL COOKIES: ', cookies);
            
            
            let matches = [];
            
            for(let i = 0; i < cookieNames.length; i++) {
                for(let j = 0; j < cookies.length; j++) {
                    
                    if (cookies[j].cookie.username == cookieNames[i]) {
                        const data = {
                            username: cookies[j].cookie.username,
                            name: cookies[j].user.name,
                        }
                        matches.push(data);
                        
                    }
                }
            }
            let user;
            if(matches.length < 2) {
                console.log('SUCCESS: ', matches[0]);
                name = matches[0].username;
                
                dbUsers.find()
                .then(allUsers => {
                    const currentUser = allUsers.find(element => element.username == name);
                    
                    
                    res.json(currentUser.quotes);
                })
                
            } else if (matches.length >= 2){
                console.log('SUCCESS: ', matches[matches.length - 1]);
                name = matches[matches.length - 1].username;
                dbUsers.find()
                .then(allUsers => {
                    const currentUser = allUsers.find(element => element.username == name);
                    res.json(currentUser.quotes);
                })
            } else {
                console.log('ERROR');
                res.render('login');
            }
            
        })
        
    }
})






app.get('/my-libary', (req, res) => {
    
    
    let cookieNames = Object.keys(req.cookies);
    console.log('COOKIE NAMES ON CLIENT: ',cookieNames);
    if (cookieNames == undefined || cookieNames.length == 0) {
        res.render('login');
    } else {
        
        dbCookies.find()
        .then(cookies => {
            //console.log('ALL COOKIES: ', cookies);
            
            
            let matches = [];
            
            for(let i = 0; i < cookieNames.length; i++) {
                for(let j = 0; j < cookies.length; j++) {
                    
                    if (cookies[j].cookie.username == cookieNames[i]) {
                        const data = {
                            username: cookies[j].cookie.username,
                            name: cookies[j].user.name,
                        }
                        matches.push(data);
                        
                    }
                }
            }
            let user;
            if(matches.length < 2) {
                console.log('SUCCESS: ', matches[0]);
                name = matches[0].username;
                
                dbUsers.find()
                .then(allUsers => {
                    const currentUser = allUsers.find(element => element.username == name);
                    
                    const libary = currentUser.likes[2];
                    
                    res.json(libary);
                })
                
            } else if (matches.length >= 2){
                console.log('SUCCESS: ', matches[matches.length - 1]);
                name = matches[matches.length - 1].username;
                dbUsers.find()
                .then(allUsers => {
                    const currentUser = allUsers.find(element => element.username == name);
                    const libary = currentUser.likes[2];
                    
                    res.json(libary);
                })
            } else {
                console.log('ERROR');
                res.render('login');
            }
            
        })
        
    }
})















app.post('/post-quote', (req, res) => {
    let theQuote = req.body.quote;
    
    //console.log(like);
    
    let cookieNames = Object.keys(req.cookies);
    //console.log('COOKIE NAMES ON CLIENT: ',cookieNames);
    if (cookieNames == undefined || cookieNames.length == 0) {
        res.render('login');
    } else {
        
        dbCookies.find()
        .then(cookies => {
            //console.log('ALL COOKIES: ', cookies);
            
            
            let matches = [];
            
            for(let i = 0; i < cookieNames.length; i++) {
                for(let j = 0; j < cookies.length; j++) {
                    
                    if (cookies[j].cookie.username == cookieNames[i]) {
                        const data = {
                            username: cookies[j].cookie.username,
                            name: cookies[j].user.name,
                        }
                        matches.push(data);
                        
                    }
                }
            }
            
            
            let user;
            if(matches.length < 2) {
                console.log('SUCCESS: ', matches[0]);
                name = matches[0].username;
                
                dbUsers.find()
                .then(allUsers => {
                    const currentUser = allUsers.find(element => element.username == name);
                    //console.log(currentUser);
                    user = currentUser.username;
                    const currentUserQuotes = currentUser.quotes;
                    //console.log(currentUserLikes);
                    let arrLikes = [];
                    for(let i = 0; i < 3; i++) {
                        arrLikes[i] = [];
                        
                    }
                    
                    let quoteObj = {
                        author: user,
                        like: arrLikes,
                        date: new Date(),
                        quote: theQuote
                    };
                    let newUserQuotes;
                    
                    if(currentUser.quotes == null || currentUser.quotes == undefined) {
                        
                        //console.log('currentUserLikes is undefined');
                        let arr = [];
                        
                        
                        
                        newUserQuotes = arr;
                        //console.log(newUserLikes);
                        newUserQuotes.push(quoteObj);
                        //console.log('newUser Likes', newUserLikes, 'NewLikes length', newUserLikes.length);
                        
                    }else {
                        currentUserQuotes.push(quoteObj);
                        newUserQuotes = currentUserQuotes;
                        //console.log('newUser Likes', newUserLikes, 'NewLikes length', newUserLikes.length);
                    }
                    let newUser = {
                        name: currentUser.name,
                        email: currentUser.email,
                        username: currentUser.username,
                        password: currentUser.password,
                        likes: currentUser.likes,
                        date: currentUser.date,
                        quotes: newUserQuotes
                    };
                    
                    
                    
                    dbNewQuotes.insert(quoteObj)
                    .then(createdQoute => {
                        res.json(createdQoute);
                        
                        dbUsers.findOneAndDelete({_id: currentUser._id}).then((doc) => {
                            //console.log(doc);
                            
                            dbUsers
                            .insert(newUser)
                            .then(createdUser => {
                                console.log(createdUser);
                                //res.send(createdUser);
                                
                                
                                
                                
                                
                            }).catch(err => console.log(err));
                            
                        }).catch(err => console.log(err));
                        
                        
                    })
                    
                    
                    
                    
                })
                
            } else if (matches.length >= 2){
                //console.log('SUCCESS: ', matches[matches.length - 1]);
                name = matches[matches.length - 1].username;
                
                dbUsers.find()
                .then(allUsers => {
                    const currentUser = allUsers.find(element => element.username == name);
                    //console.log(currentUser);
                    user = currentUser.username;
                    const currentUserQuotes = currentUser.quotes;
                    //console.log(currentUserLikes);

                    let arrLikes = [];
                    for(let i = 0; i < 3; i++) {
                        arrLikes[i] = [];
                        
                    }
                    
                    let quoteObj = {
                        author: user,
                        like: arrLikes,
                        date: new Date(),
                        quote: theQuote
                    };
                    let newUserQuotes;
                    
                    if(currentUser.quotes == null || currentUser.quotes == undefined) {
                        
                        //console.log('currentUserLikes is undefined');
                        let arr = [];
                        
                        
                        
                        newUserQuotes = arr;
                        //console.log(newUserLikes);
                        newUserQuotes.push(quoteObj);
                        //console.log('newUser Likes', newUserLikes, 'NewLikes length', newUserLikes.length);
                        
                    }else {
                        currentUserQuotes.push(quoteObj);
                        newUserQuotes = currentUserQuotes;
                        //console.log('newUser Likes', newUserLikes, 'NewLikes length', newUserLikes.length);
                    }
                    let newUser = {
                        name: currentUser.name,
                        email: currentUser.email,
                        username: currentUser.username,
                        password: currentUser.password,
                        likes: currentUser.likes,
                        date: currentUser.date,
                        quotes: newUserQuotes
                    };
                    
                    
                    
                    dbNewQuotes.insert(quoteObj)
                    .then(createdQoute => {
                        res.json(createdQoute);
                        
                        dbUsers.findOneAndDelete({_id: currentUser._id}).then((doc) => {
                            //console.log(doc);
                            
                            dbUsers
                            .insert(newUser)
                            .then(createdUser => {
                                console.log(createdUser);
                                //res.send(createdUser);
                                
                                
                                
                                
                                
                            }).catch(err => console.log(err));
                            
                        }).catch(err => console.log(err));
                        
                        
                    })
                    
                    
                    
                    
                })
                
            } else {
                console.log('ERROR');
                res.render('login');
            }
            
        })
        
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
});




function validateData(data) {
    return data;
}

