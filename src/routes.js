import express from 'express';


import {showHomePage} from './controllers/indexController.js';
import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm,
    volunteerForProject,
    removeProjectVolunteerSignup,
    removeProjectVolunteerFromDashboard
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
import { 
    showUserRegistrationForm, 
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    showDashboard,
    userValidation,
    loginValidation,
    requireRole,
    showUsersPage 
} from './controllers/userController.js';

const router = express.Router();

router.get('/', showHomePage);

router.get('/register', showUserRegistrationForm);
router.post('/register', userValidation, processUserRegistrationForm);

router.get('/login', showLoginForm);
router.post('/login', loginValidation, processLoginForm);
router.get('/logout', processLogout);

router.get('/dashboard', requireLogin, showDashboard);
router.get('/dashboard/project/:id/remove-volunteer', requireLogin, removeProjectVolunteerFromDashboard);

router.get('/users', requireRole('admin'), showUsersPage);

router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/project/:id/volunteer', requireLogin, volunteerForProject);
router.get('/project/:id/remove-volunteer', requireLogin, removeProjectVolunteerSignup);
router.get('/project/:projectId/assign-categories', requireRole('admin'), showAssignCategoriesForm);
router.post('/project/:projectId/assign-categories', requireRole('admin'), processAssignCategoriesForm);
router.get('/new-project', requireRole('admin'), showNewProjectForm);
router.post('/new-project', requireRole('admin'), projectValidation, processNewProjectForm);
router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);
router.post('/edit-project/:id', requireRole('admin'), projectValidation, processEditProjectForm);

router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);
router.get('/new-category', requireRole('admin'), showNewCategoryForm);
router.post('/new-category', requireRole('admin'), categoryValidation, processNewCategoryForm);
router.get('/edit-category/:id', requireRole('admin'), showEditCategoryForm);
router.post('/edit-category/:id', requireRole('admin'), categoryValidation, processEditCategoryForm);

router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/new-organization', requireRole('admin'), showOrganizationForm);
router.post('/new-organization', requireRole('admin'), organizationValidation, processOrganizationForm);
router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganization);

router.get('/error', testErrorPage);

export default router;