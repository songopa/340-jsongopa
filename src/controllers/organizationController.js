import {getOrganizations, getOrganization} from '../models/organizations.js';
import {getProjectsByOrganizationId} from '../models/projects.js';

const showOrganizationsPage = async (req, res) => {
    try {
        const organizations = await getOrganizations();
        const title = 'Our Partner Organizations';
        
        res.render('organizations', { title, organizations });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const showOrganizationDetailsPage = async (req, res) => {
    const organizationId = req.params.id;
    try {
        const organization = await getOrganization(organizationId);
        const projects = await getProjectsByOrganizationId(organizationId);
        const title = organization.name;
        res.render('organization', { title, organization, projects });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

export {showOrganizationsPage, showOrganizationDetailsPage};