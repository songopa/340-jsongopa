import {getOrganizations} from '../models/organizations.js';

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

export {showOrganizationsPage};