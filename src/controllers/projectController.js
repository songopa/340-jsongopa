import {getProjects, getUpcomingProjects, getProjectDetails, getProjectCategories} from '../models/projects.js';

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

export { showProjectsPage, showProjectDetailsPage };