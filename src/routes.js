import express from 'express';

import {showHomePage} from './controllers/indexController.js';
import {showProjectsPage} from './controllers/projectController.js';
import {showCategoriesPage} from './controllers/categoryController.js';
import {showOrganizationsPage} from './controllers/organizationController.js';
import {testErrorPage} from './controllers/errorController.js';

const router = express.Router();

router.get('/', showHomePage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);
router.get('/organizations', showOrganizationsPage);
router.get('/error', testErrorPage);

export default router;