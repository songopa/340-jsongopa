import db from './db.js';

const getOrganizations = async () => {
    const query = `
    SELECT organization_id, name, description, contact_email, logo_filename
    FROM public.organizations;
    `;

    const result = await db.query(query);
    return result.rows;
}

const getOrganization = async (organizationId) => {
    const query = `
    SELECT organization_id, name, description, contact_email, logo_filename
    FROM public.organizations
    WHERE organization_id = $1;
    `;

    const result = await db.query(query, [organizationId]);
    return result.rows[0];
}

export {getOrganizations, getOrganization};