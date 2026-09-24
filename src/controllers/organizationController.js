import {
    getAllOrganizations,
    getOrganizationDetails,
    createOrganization,
    updateOrganization
} from '../models/organizations.js';
import {getProjectsByOrganizationId} from '../models/projects.js';
import {body, validationResult} from 'express-validator';


const organizationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Organization description is required')
        .isLength({ max: 500 })
        .withMessage('Organization description cannot exceed 500 characters'),
    body('contactEmail')
        .normalizeEmail()
        .notEmpty()
        .withMessage('Contact email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
];

const showOrganizationsPage = async (req, res) => {
    try {
        const organizations = await getAllOrganizations();
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
        const organization = await getOrganizationDetails(organizationId);
        const projects = await getProjectsByOrganizationId(organizationId);
        const title = organization.name;
        res.render('organization', { title, organization, projects });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const showOrganizationForm = (req, res) => {
    const title = 'Add New Organization';
    res.render('new-organization', { title });
}

const processOrganizationForm = async (req, res) => {
    // Handle validation errors
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new organization form
        return res.redirect('/new-organization');
    }

    const { name, description, contactEmail } = req.body;
    const logoFilename = 'placeholder-logo.png'; // Use the placeholder logo for all new organizations

    const organizationId = await createOrganization(name, description, contactEmail, logoFilename);

    req.flash('success', 'Organization created successfully!');
    res.redirect(`/organization/${organizationId}`);
};

const showEditOrganizationForm = async (req, res) => {
    const organization = await getOrganizationDetails(req.params.id);

    if (!organization) {
        return res.status(404).render('errors/404', {title: 'Organization Not Found'});
    }

    res.render('edit-organization', {
        title: `Edit ${organization.name}`,
        organization,
        errors: {}
    });
    
};

const processEditOrganization = async (req, res) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the edit organization form
        return res.redirect('/edit-organization/' + req.params.id);
    }

    const {name, description, contactEmail} = req.body;
    await updateOrganization(req.params.id, name, description, contactEmail);

    req.flash('success', 'Organization updated successfully!');
    res.redirect(`/organization/${req.params.id}`);
};

export {
    showOrganizationsPage, 
    showOrganizationDetailsPage, 
    showOrganizationForm, 
    processOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganization
};