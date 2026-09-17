import db from "./db.js";

const getProjects = async () => {
    const query = `
    SELECT p.project_id,
           p.organization_id,
           o.name AS organization_name,
           p.title,
           p.description,
           p.location,
           p.project_date
    FROM public.projects AS p
    JOIN public.organizations AS o
        ON p.organization_id = o.organization_id;
    `;

    const result = await db.query(query);
    return result.rows;
}

const getProjectById = async (projectId) => {
    const query = `
    SELECT p.project_id,
           p.organization_id,
           o.name AS organization_name,
           p.title,
           p.description,
           p.location,
           p.project_date
    FROM public.projects AS p
    JOIN public.organizations AS o
        ON p.organization_id = o.organization_id
    WHERE p.project_id = $1;
    `;

    const result = await db.query(query, [projectId]);
    return result.rows[0];
}

const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          project_date
        FROM public.projects
        WHERE organization_id = $1
        ORDER BY project_date;
      `;

    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);
    return result.rows;
}

const getUpcomingProjects = async (number_of_projects) => {
    const query = `
        SELECT
          p.project_id,
          p.organization_id,
          p.title,
          p.description,
          p.location,
          p.project_date,
          o.name AS organization_name
        FROM public.projects AS p
        JOIN public.organizations AS o
          ON p.organization_id = o.organization_id
        WHERE p.project_date > CURRENT_DATE
        ORDER BY p.project_date
        LIMIT $1;
      `;

    const queryParams = [number_of_projects];
    const result = await db.query(query, queryParams);
    return result.rows;
};

const getProjectDetails = async (projectId) => {
    const query = `
        SELECT
          p.project_id,
          p.organization_id,
          o.name AS organization_name,
          p.title,
          p.description,
          p.location,
          p.project_date
        FROM public.projects AS p
        JOIN public.organizations AS o
          ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
      `;

    const queryParams = [projectId];
    const result = await db.query(query, queryParams);
    return result.rows[0];
};

const getProjectsByCategoryId = async (categoryId) => {
    
    //use a join to get the projects that belong to a specific category from the projects_categories table
    const query = `
        SELECT
          p.project_id,
          p.organization_id,
          o.name AS organization_name,
          p.title,
          p.description,
          p.location,
          p.project_date
        FROM public.projects AS p
        JOIN public.projects_categories AS pc
          ON p.project_id = pc.project_id
        JOIN public.categories AS c
          ON pc.category_id = c.category_id
        JOIN public.organizations AS o
          ON p.organization_id = o.organization_id
        WHERE c.category_id = $1;
      `;

    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);
    return result.rows;
};

const getProjectCategories = async (projectId) => {
    const query = `
        SELECT
          c.category_id,
          c.name
        FROM public.projects_categories AS pc
        JOIN public.categories AS c
          ON pc.category_id = c.category_id
        WHERE pc.project_id = $1;
      `;

    const queryParams = [projectId];
    const result = await db.query(query, queryParams);
    return result.rows;
};

export { getProjects, getProjectById, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails, getProjectsByCategoryId, getProjectCategories };