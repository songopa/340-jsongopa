import bcrypt from 'bcrypt';
import { createUser, authenticateUser, getAllUsers } from '../models/users.js';
import { getVolunteerProjects } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

const userValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required.')
        .bail()
        .isLength({min: 3, max: 100}).withMessage('Name must be between 3 and 100 characters.'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required.')
        .bail()
        .isEmail().withMessage('Please provide a valid email address.') ,
    body('password')
        .trim()
        .notEmpty().withMessage('Password is required.')
        .bail()
        .isLength({min: 6}).withMessage('Password must be at least 6 characters long.'),
    body('confirmPassword')
        .trim()
        .notEmpty().withMessage('Please confirm your password.')
        .bail()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match.');
            }
            return true;
        })
];

const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required.')
        .bail()
        .isEmail().withMessage('Please provide a valid email address.') ,
    body('password')
        .trim()
        .notEmpty().withMessage('Password is required.')
];

const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
}

const processUserRegistrationForm = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        return res.redirect('/register');
    }

    const { name, email, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userId = await createUser(name, email, hashedPassword);

        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Registration failed. Please try again.');
        res.redirect('/register');
    }
}

const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
}

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);
        if (user) {
                req.session.user = user;
                req.flash('success', 'Login successful! Welcome, ' + user.name + '!');
                if (res.locals.NODE_ENV === 'development') {
                    console.log('User logged in:', user);
                }
                res.redirect('/dashboard');
            } else {
                req.flash('error', 'Invalid email or password. Please try again.');
                res.redirect('/login');
            }
    } catch (error) {
        console.error(error);
        req.flash('error', 'Login failed. Please try again.');
        res.redirect('/login');
    }
}

const processLogout = (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Unable to log out. Please try again.');
        }

        res.clearCookie('connect.sid');
        res.redirect('/');
    });
}

const showDashboard = async (req, res) => {
    const user = req.session.user;
    try {
        const volunteerProjects = await getVolunteerProjects(user.user_id);
        res.render('dashboard', {
            title: 'Dashboard',
            name: user.name,
            email: user.email,
            volunteerProjects
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

const showUsersPage = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.render('users', { title: 'Registered Users', users });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

const requireLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        req.flash('error', 'You must be logged in to view this page.');
        res.redirect('/login');
    }
}

const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to view this page.');
            return res.redirect('/login');
        }
        if (req.session.user.role_name === role) {
            next();
        } else {
            req.flash('error', 'You do not have permission to view this page.');
            res.redirect('/');
        }
    }
}

export { 
    showUserRegistrationForm, processUserRegistrationForm, showLoginForm, 
    processLoginForm, processLogout, requireLogin, showDashboard, 
    userValidation, loginValidation, requireRole, showUsersPage
};