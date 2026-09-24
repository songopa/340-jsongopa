import db from "./db.js";

const getAllCategories = async () => {
    const query = `
    SELECT category_id, name
    FROM public.categories
    ORDER BY name;
    `;

    const result = await db.query(query);
    return result.rows;
}

const getCategoryById = async (categoryId) => {
    const query = `
    SELECT category_id, name
    FROM public.categories
    WHERE category_id = $1;
    `;

    const result = await db.query(query, [categoryId]);
    return result.rows[0] ?? null;
}

const createCategory = async (name) => {
    const query = `
        INSERT INTO public.categories (name)
        VALUES ($1)
        RETURNING category_id;
    `;

    const result = await db.query(query, [name]);
    return result.rows[0].category_id;
};

const updateCategory = async (categoryId, name) => {
    const query = `
        UPDATE public.categories
        SET name = $1
        WHERE category_id = $2;
    `;

    await db.query(query, [name, categoryId]);
};

const getCategoriesByServiceProjectId = async (projectId) => {
    const query = `
        SELECT c.category_id, c.name
        FROM public.projects_categories AS pc
        JOIN public.categories AS c
            ON pc.category_id = c.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name;
    `;

    const result = await db.query(query, [projectId]);
    return result.rows;
};

const assignCategoryToProject = async (projectId, categoryId) => {
    const query = `
        INSERT INTO public.projects_categories (project_id, category_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [projectId, categoryId]);
};

const updateCategoryAssignments = async (projectId, categoryIds = []) => {
    await db.query(
        'DELETE FROM public.projects_categories WHERE project_id = $1;',
        [projectId]
    );

    for (const categoryId of categoryIds) {
        await assignCategoryToProject(projectId, categoryId);
    }
};

export {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    getCategoriesByServiceProjectId,
    updateCategoryAssignments
};