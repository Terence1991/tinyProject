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

const users = { 
    "userRandomID": {
      id: "userRandomID", 
      email: "user@example.com", 
      password: "purple-monkey-dinosaur"
    },
   "user2RandomID": {
      id: "user2RandomID", 
      email: "user2@example.com", 
      password: "dishwasher-funk"
    }
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
    let templateVars = {urls: urlDataBase, username: req.cookies['user_id']}
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
    let templateVars = {username: req.cookies['user_id']}
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
    let currentUser;
    for (var property2 in users) {
     if (users[property2].email === req.body.email) {
         currentUser = property2; 
        } 
    
    } if (currentUser === undefined) {
        res.status(403);
        res.send("Email cant be found!")
        } else {
         if (users[currentUser].password !== req.body.password) {
            res.status(403)
            res.send("Password does not match ")  
        } else {
        res.cookie('user_id', currentUser); 
        res.redirect('/') 
        }
    } 



//  else if (users[property2].email === req.body.email && users[property2].password !== req.body.password) {
//     res.status(403)
//     res.send("Password does not match ")
// } else {
// res.cookie('user_id', property2); 
// res.redirect('/')

// res.status(403);
//      res.send("Email cant be found!");
// res.cookie('user_id', req.body.username) 
// res.redirect('/urls');
})

app.get("/urls/:id", (req, res) => {
    var shortUrl = req.params.id;
    var longUrl = urlDataBase[shortUrl]
    let templateVars = { shortURL: shortUrl, longUrl: longUrl, username: req.cookies['user_id'] }
    res.render("urls_show", templateVars);
  });

  // as an endpoint
  app.post("/logout" , (req, res) => {
    let templateVars = {username: req.cookies['user_id'] }  
    res.clearCookie('user_id');  
    res.redirect('/urls');
  })

  app.get('/register', (req, res) => {
      res.render('register');
  });

  app.get('/login', (req, res) => {
   res.render('login')
  });

  

  app.post('/register', (req, res) => {
      
      if(req.body.email === "" && req.body.password === "") {
        res.status(400);
        res.send('None shall pass');
        return;
      } 
      for(var properety2 in users) {
          if(users[properety2].email === req.body.email) {
            res.status(400);
            res.send('Email is in use');
            return;
          }

      }
      var randomString = generateRandomString();
      users[randomString] = {id: randomString, email: req.body.email , password: req.body.password}
      res.cookie('user_id', randomString);
      res.redirect('/urls');
  });

//function that generates random string for urlDatabaseKeys
  function generateRandomString() {
    let text = ""
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for(var i = 0; i < 6; i++) {
        text += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return text;
}