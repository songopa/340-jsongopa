import express from 'express';

import {showHomePage} from './controllers/indexController.js';
import {showProjectsPage, showProjectDetailsPage} from './controllers/projectController.js';
import {showCategoriesPage, showCategoryDetailsPage} from './controllers/categoryController.js';
import {showOrganizationsPage, showOrganizationDetailsPage} from './controllers/organizationController.js';
import {testErrorPage} from './controllers/errorController.js';

const router = express.Router();

router.get('/', showHomePage);
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

router.get('/error', testErrorPage);

export default router;