const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const { body, validationResult} = require('express-validator');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const util = require('util');
const { error } = require('console');

dotenv.config();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));
app.set('view engine', 'ejs');


//session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
    }));


//db
const con = mysql.createConnection( {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});


con.connect( (err) => {
    if(err) throw err;
    console.log('Connected to MySQL database');
});

const query = util.promisify(con.query).bind(con);

//routes

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/dashboard', (req, res) => {

    const { username } = req.session;
    console.log(req.session);
    
    if(!req.session.username) {
        return res.send("You are not logged in");
    } else {
        res.render('dashboard');
    }
});


app.post('/signup', [
    body('name').trim().escape().notEmpty().isLength({ min: 3, max: 15 }).withMessage('Name should be max 15 characters long'),
    body('surname').trim().escape().notEmpty().isLength({ min: 4, max: 20 }).withMessage('Surname should be max 20 characters long'),
    body('gender').notEmpty().isIn(['male', 'female']).withMessage('Please select a valid gender'),
    body('username').trim().escape().notEmpty().isLength({ min: 5, max: 15 }).withMessage('Username should have min 5, max 15 characters'),
    body('email').trim().notEmpty().isEmail().withMessage('Invalid Email Address').normalizeEmail(),
    body('password').trim().escape().notEmpty().isLength({ min: 8 }).withMessage('Password should be at least 8 characters long')
        .matches('[0-9]').withMessage('Password should contain a number')
        .matches('[a-z]').withMessage('Password should contain a lowercase letter')
        .matches('[A-Z]').withMessage('Password should contain an uppercase letter')
        .matches(/[\W_]/).withMessage('Password should contain a special character'),
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('signup', { errors: errors.array() });
    }

    const { name, surname, gender, username, email, password } = req.body;
    const saltRounds = 10;

    try {
        // Check if the username or email already exists
        const existingUser = await query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);

        if (existingUser.length > 0) {
            return res.render('signup', { error: 'Username or email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert the new user into the database
        await query('INSERT INTO users (name, surname, gender, username, email, password) VALUES (?, ?, ?, ?, ?, ?)',
            [name, surname, gender, username, email, hashedPassword]);

        console.log('User registered successfully');
        res.redirect('/login');
    } catch (error) {
        console.error('Error registering user: ', error);
        res.status(500).send('Error registering user');
    }
});


app.post('/login', [
    body('username').trim().escape().notEmpty().withMessage('Username is required'),
    body('password').trim().notEmpty().withMessage('Password is required'),
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.render('login', { errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
        const user = await query('SELECT * FROM users WHERE username = ?', [username]);

        if (user.length === 0) {
            return res.render('login', { error: 'Invalid username or password' });
        }

        const hashedPassword = user[0].password;
        const passwordMatch = await bcrypt.compare(password, hashedPassword);

        if (passwordMatch) {
            req.session.user = user[0];

            // Render the dashboard view with the user object
            res.render('dashboard', { user: user[0] });
        } else {
            return res.render('login', { error: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error during login: ', error);
        res.status(500).send('Error during login');
    }
});




app.listen(port);
console.log(`The server is running on port ${port}`);