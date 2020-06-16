const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');


const mongoose = require('mongoose');

const url = config.mongoUrl;
const connect = mongoose.connect(url, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

connect.then(() => console.log('Connected correctly db to server'),
    err => console.log(err)
);

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = new mongoose.model('User', userSchema);

app.all('')

    .get('/', (req, res) => {
        res.render('home');
    })

    .get('/login', (req, res) => {
        res.render('login');
    })

    .get('/register', (req, res) => {
        res.render('register');
    })

    .post('/register', (req, res) => {
        const newUser = new User({
            email: req.body.username,
            password: req.body.password
        })

        newUser.save((err) => {
            if (err) {
                console.log(err);
            } else {
                res.render('movies');
            }
        })
    })

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, (err, locatedUser) => {
        if (err) {
            console.log(err);
        } else {
            if (locatedUser) {
                if (locatedUser.password === password) {
                    res.render('movies');
                }
            }
        }
    })
});


app.listen(3000), () => {
    console.log('Server started on port 3000');
};
