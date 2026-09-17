import db from "./db.js";

const getCategories = async () => {
    const query = `
    SELECT category_id, name
    FROM public.categories;
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
    return result.rows[0];
}

export { getCategories, getCategoryById };