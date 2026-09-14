import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import {testConnection} from './src/models/db.js';
import {getOrganizations} from './src/models/organizations.js';
import {getProjects} from './src/models/projects.js';
import {getCategories} from './src/models/categories.js';


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


/**
  * Routes
  */
app.get('/', (req, res) => {
    const title = 'Home';
    res.render('home', { title });
});

app.get('/organizations', async (req, res) => {
    const organizations = await getOrganizations();
    const title = 'Our Partner Organizations';
    
    res.render('organizations', { title, organizations });
});

app.get('/projects', async (req, res) => {
    const projects = await getProjects();
    const title = 'Service Projects';

    res.render('projects', { title, projects });
});

app.get('/categories', async (req, res) => {
    const categories = await getCategories();
    const title = 'Categories';
    res.render('categories', { title, categories });
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