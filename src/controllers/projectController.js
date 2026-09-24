import {
    getProjects,
    getUpcomingProjects,
    getProjectDetails,
    getProjectCategories,
    createProject,
    updateProject
} from '../models/projects.js';
import {getAllOrganizations} from '../models/organizations.js';
import {body, validationResult} from 'express-validator';

const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Project title is required.')
        .bail()
        .isLength({min: 3, max: 200}).withMessage('Project title must be between 3 and 200 characters.'),
    body('description')
        .trim()
        .notEmpty().withMessage('Project description is required.')
        .bail()
        .isLength({max: 999}).withMessage('Project description must be less than 1000 characters.'),
    body('location')
        .trim()
        .notEmpty().withMessage('Project location is required.')
        .bail()
        .isLength({max: 199}).withMessage('Project location must be less than 200 characters.'),
    body('date')
        .notEmpty().withMessage('Project date is required.')
        .bail()
        .isISO8601({strict: true}).withMessage('Project date must be a valid date.'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required.')
        .bail()
        .isInt().withMessage('Organization must be valid.')
        .toInt()
];

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res) => {

    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        const title = 'Upcoming Service Projects';
        res.render('projects', { title, projects });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;

    try {
        const project = await getProjectDetails(projectId);
        const categories = await getProjectCategories(projectId);
        const title = project.title;
        res.render('project', { title, project, categories });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const showNewProjectForm = async (req, res) => {
    try {
        const organizations = await getAllOrganizations();
        const title = 'Add New Service Project';
        res.render('new-project', {title, organizations});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const processNewProjectForm = async (req, res) => {
    const results = validationResult(req);

    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-project');
    }

    const {organizationId, title, description, location, date} = req.body;
    await createProject(title, description, location, date, organizationId);

    req.flash('success', 'Service project created successfully!');
    res.redirect('/projects');
};

const showEditProjectForm = async (req, res) => {
    try {
        const [project, organizations] = await Promise.all([
            getProjectDetails(req.params.id),
            getAllOrganizations()
        ]);

        if (!project) {
            return res.status(404).render('errors/404', {title: 'Project Not Found'});
        }

        res.render('edit-project', {
            title: `Edit ${project.title}`,
            project,
            organizations
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const processEditProjectForm = async (req, res) => {
    const results = validationResult(req);

    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect(`/edit-project/${req.params.id}`);
    }

    const {title, description, location, date, organizationId} = req.body;
    await updateProject(req.params.id, title, description, location, date, organizationId);

    req.flash('success', 'Service project updated successfully!');
    res.redirect(`/project/${req.params.id}`);
};

export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm
};