import {getProjects} from '../models/projects.js';

const showProjectsPage = async (req, res) => {
    try {
        const projects = await getProjects();
        const title = 'Service Projects';
        res.render('projects', { title, projects });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

export { showProjectsPage };