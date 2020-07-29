const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public/'));

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser:true, useUnifiedTopology:true});

const UserSchema = {
    email: String,
    password: String
}

const User = mongoose.model("User",UserSchema);

app.get('/', (req, res) =>
{
    res.render('home');
});

app.get('/register', (req, res) =>
{
    res.render('register');
});

app.post('/register', (req, res) =>
{
    email = req.body.email;
    password = req.body.password;

    const newUser = new User(
        {
            email: email,
            password: password
        }
    )
    newUser.save((err) =>
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.redirect('/');
        }
    });
});

app.get('/login', (req, res) =>
{
    res.render('login');
});

app.post('/login', (req, res) => 
{
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email: email}, (err, found) =>
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            if(found)
            {
                if(found.password === password)
                {
                    res.render('hidden');
                }
                else
                {
                    console.log("Wrong password!")
                }
            }
            else
            {
                res.redirect('/register');
            }
        }
    })
});

app.listen(3000, () =>{
    console.log("Listening on port 3000.")
})