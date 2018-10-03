var express = require("express");
var app = express();
var PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')

app.use(bodyParser.urlencoded({exteneded: true}))
app.use(cookieParser())

app.set("view engine", "ejs")

var urlDataBase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com" 
}

// stores client urls entrys in DataBase
app.post("/urls", (req ,res) => {
let longUrl = req.body.longURL
const shortUrl = generateRandomString();
urlDataBase[shortUrl] = longUrl; 
res.redirect(`/urls/${shortUrl}`);
});

// redirects longs url
app.get("/u/:shortURL", (req, res) => {
    // let longURL = ...
    let longURL = urlDataBase[req.params.shortURL];
    console.log(longURL);
    res.redirect(longURL);
  });

app.get('/urls', (req, res) => {
    let templateVars = {urls: urlDataBase, username: req.cookies['username']}
    res.render("urls_index", templateVars)
});


app.get('/', (req, res) => {
    res.send('Hello!');
});

app.listen(PORT, () => {
 console.log(`Example app listening on port ${PORT} `);
});

app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n");
})

app.get('/urls.json', (req , res) => {
  res.json(urlDataBase);
});

app.get("/urls/new", (req, res) => {
    let templateVars = {username: req.cookies['username']}
    res.render("urls_new");
});
//intaking delete request and redirecting to home(/S)
app.post('/urls/:id/delete', (req, res) => {
    var shortUrl = req.params.id
    delete urlDataBase[shortUrl]
    res.redirect('/urls')
});

// req.parama.id = current adress in the adress bar.
app.post("/urls/:id" , (req, res) => {
let longUrl = req.body.longURL
urlDataBase[req.params.id] = longUrl; 
res.redirect('/urls')
})

// sets cookie the value submitted in the request body via the login form. 
app.post("/login", (req, res) => {
res.cookie('username', req.body.username) 
res.redirect('/urls');
})

app.get("/urls/:id", (req, res) => {
    var shortUrl = req.params.id;
    var longUrl = urlDataBase[shortUrl]
    let templateVars = { shortURL: shortUrl, longUrl: longUrl, username: req.cookies['username'] }
    res.render("urls_show", templateVars);
  });

  // as an endpoint
  app.post("/logout" , (req, res) => {
    let templateVars = {username: req.cookies['username'] }  
    res.clearCookie('username');  
    res.redirect('/urls');
  })

//function that generates random string for urlDatabaseKeys
  function generateRandomString() {
    let text = ""
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for(var i = 0; i < 6; i++) {
        text += characters.charAt(Math.floor(Math.random() * characters.length));
}
return text;
}