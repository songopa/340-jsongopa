import db from './db.js';

const getAllOrganizations = async () => {
    const query = `
    SELECT organization_id, name, description, contact_email, logo_filename
    FROM public.organizations;
    `;

    const result = await db.query(query);
    return result.rows;
}

const getOrganizationDetails = async (organizationId) => {
    const query = `
    SELECT organization_id, name, description, contact_email, logo_filename
    FROM public.organizations
    WHERE organization_id = $1;
    `;

    const result = await db.query(query, [organizationId]);
    return result.rows[0] ?? null;
}

const createOrganization = async (name, description, contactEmail, logoFilename) => {
    const query = `
    INSERT INTO public.organizations (name, description, contact_email, logo_filename)
    VALUES ($1, $2, $3, $4)
    RETURNING organization_id;
    `;

    const result = await db.query(query, [name, description, contactEmail, logoFilename]);
    return result.rows[0].organization_id;
}

const updateOrganization = async (organizationId, name, description, contactEmail) => {
    const query = `
    UPDATE public.organizations
    SET name = $1, description = $2, contact_email = $3
    WHERE organization_id = $4;
    `;

    await db.query(query, [name, description, contactEmail, organizationId]);
}

export {
    getAllOrganizations,
    getOrganizationDetails,
    createOrganization,
    updateOrganization
};