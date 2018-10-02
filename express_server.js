var express = require("express");
var app = express();
var PORT = 8080;
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({exteneded: true}))

app.set("view engine", "ejs")

var urlDataBase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com" 
}

app.post("/urls", (req ,res) => {
console.log(req.body)
res.send('Ok');
});

app.get('/urls', (req, res) => {
    let templateVars = {urls: urlDataBase}
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
    res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
    var shortUrl = req.params.id;
    var longUrl = urlDataBase[shortUrl]
    let templateVars = { shortURL: shortUrl, longUrl: longUrl }
    res.render("urls_show", templateVars);
  });


  function generateRandomString() {
    let text = ""
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for(var i = 0; i < 6; i++) {
        text += characters.charAt(Math.floor(Math.random() * characters.length));
}
return text;
}