import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import {testConnection} from './src/models/db.js';
import router from './src/routes.js';
import session from 'express-session';
import flash from './src/middlewares/flash.js';


// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/**
  * Configure Express middleware
  */

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    next();
});

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));

app.use(express.urlencoded({extended:true}));
app.use(express.json());

const SESSION_SECRET = process.env.SESSION_SECRET || 'default_session_secret';
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }
}));

/**
  * Middlewares
  */

app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    }
    next();
});
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    next();
});

app.use(flash);




/**
  * Routes
  */
app.use(router);



/**
 * Error Handling Middlewares
 */

app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {

    console.error('Error occurred:', err.message);
    console.error('Stack trace:', err.stack);

    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';

    const context = {
        title: status === 404 ? 'Page Not Found' : 'Internal Server Error',
        error: err.message,
        stack: err.stack
    };

    res.status(status).render(`errors/${template}`, context);
});




app.listen(PORT, async () => {
    try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
        console.error('Failed to start server due to database connection error:', error.message);
        process.exit(1); // Exit the process with an error code
    }
});