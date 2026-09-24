import express from 'express';

import {showHomePage} from './controllers/indexController.js';
import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm
} from './controllers/projectController.js';
import {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation
} from './controllers/categoryController.js';
import {testErrorPage} from './controllers/errorController.js';
import { 
    showOrganizationsPage, 
    showOrganizationDetailsPage, 
    showOrganizationForm, 
    processOrganizationForm, 
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganization
 } from './controllers/organizationController.js';


const router = express.Router();

router.get('/', showHomePage);
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/project/:projectId/assign-categories', showAssignCategoriesForm);
router.post('/project/:projectId/assign-categories', processAssignCategoriesForm);
router.get('/new-project', showNewProjectForm);
router.post('/new-project', projectValidation, processNewProjectForm);
router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', projectValidation, processEditProjectForm);

router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);
router.get('/new-category', showNewCategoryForm);
router.post('/new-category', categoryValidation, processNewCategoryForm);
router.get('/edit-category/:id', showEditCategoryForm);
router.post('/edit-category/:id', categoryValidation, processEditCategoryForm);

router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/new-organization', showOrganizationForm);
router.post('/new-organization', organizationValidation, processOrganizationForm);
router.get('/edit-organization/:id', showEditOrganizationForm);
router.post('/edit-organization/:id', organizationValidation, processEditOrganization);

router.get('/error', testErrorPage);

export default router;