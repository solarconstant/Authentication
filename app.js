require('dotenv').config();     //as early as possible, dotenv is to be configured
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
//const encrypt = require('mongoose-encryption');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public/'));
const md5 = require('md5');

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser:true, useUnifiedTopology:true});

const UserSchema = new mongoose.Schema(
{
    email: String,
    password: String
});

const secret = process.env.SECRET;
//UserSchema.plugin(encrypt, {secret: secret, encryptedFields: ['password']});        //field to be encrypted is password and mongoose-encryption uses a secret to do that
//mongoose-encrypt encrypts our encryptedFields on 'save'-ing them and then decrypts on 'find'-ing them.

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
            password: md5(password)     //turns this into an irreversible hash
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
    const password = md5(req.body.password);        //because the stored password is hash, to convert it back.

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