var express = require("express");
var app = express();
var PORT = 8080;
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session')
const bcrypt = require('bcryptjs');

app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']}))

app.set("view engine", "ejs")

var urlDataBase = {
    "b2xVn2": {
    url: "http://www.lighthouselabs.ca", 
    userId: 'userRandomID'
},
    "9sm5xK": {
    url:"http://www.google.com", 
    userId: 'user2RandomID', 
} 
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
urlDataBase[shortUrl] = {url: longUrl, userId: req.session.user_id }; 
res.redirect(`/urls/${shortUrl}`);
});

// redirects longs url
app.get("/u/:shortURL", (req, res) => {
    let longURL = urlDataBase[req.params.shortURL].url;
    console.log(longURL);
    res.redirect(longURL);
  });

app.get('/urls', (req, res) => {

    let templateVars = {urls: urlsForUser(req.session.user_id), username: req.session.user_id}
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
    let templateVars = {username: req.session.user_id}
    if (req.session.user_id) {
    res.render("urls_new", templateVars);
    } else {
      res.redirect("/login");  
    }
    
    
});

app.post('/urls/:id/delete', (req, res) => {
    var shortUrl = req.params.id
    if (req.session.user_id === urlDataBase[shortUrl].userId) {
    delete urlDataBase[shortUrl]  
    } else {
    res.redirect('/urls')
    }
});

app.get('/urls/:id/edit', (req, res) => {
    let templateVars = {username: req.session.user_id, 
    shortURL: req.params.id}
    if (req.session.user_id === urlDataBase[req.params.id].user_id) {
      res.render('urls_edit', templateVars)
    } else {
        res.redirect("/urls");
    }
})


app.post('/urls/:id/edit', (req,res) => {
    var shortURL = req.params.id;
    
    res.redirect("/urls")
})


// req.parama.id = current adress in the adress bar.
app.post("/urls/:id" , (req, res) => {
let longUrl = req.body.longURL
urlDataBase[shortUrl] =  {url: longUrl, userId: req.session.user_id} 
res.redirect('/urls')

})

// sets cookie the value submitted in the request body via the login form. 
app.post("/login", (req, res) => {
    let currentUserId;
    for (var property2 in users) {
     if (users[property2].email === req.body.email) {
         currentUserId = property2; 
        } 
    } 
    if (currentUserId === undefined) {
        res.status(403);
        res.send("Email cant be found!")
    } else {
        if(bcrypt.compareSync(req.body.password, users[currentUserId].password)){
            console.log("current user", currentUserId);
            console.log(users);
            req.session.user_id = currentUserId; 
            res.redirect('/') 
        } else {
            res.status(403)
            res.send("Password does not match ") 
        }
    }

}) 

app.get("/urls/:id", (req, res) => {

    var shortUrl = req.params.id;
    console.log(shortUrl);
    var longUrl = urlDataBase[shortUrl].url
    let templateVars = { shortURL: shortUrl, longUrl: longUrl, username: req.session.user_id }
    if(req.session.user_id && urlDataBase[shortUrl].userId === req.session.user_id) {
       res.render("urls_show", templateVars)
    } else {
        res.status(400);
        res.send('Please login')
    };
  });

  // as an endpoint
  app.post("/logout" , (req, res) => {
    let templateVars = {username: req.session.user_id }    
    req.session = null;
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
      users[randomString] = {id: randomString, email: req.body.email , password: bcrypt.hashSync(req.body.password, 10)}
      req.session.user_id = randomString; 
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


function urlsForUser(id) {
    var currentUrl = {}
    for(var shortUrl in urlDataBase) {
       if (urlDataBase[shortUrl].userId === id) {
            currentUrl[shortUrl] = {url: urlDataBase[shortUrl].url, userId: id} 
       }

    }

    return currentUrl; 

}



