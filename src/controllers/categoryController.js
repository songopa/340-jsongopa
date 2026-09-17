import {getCategories, getCategoryById} from '../models/categories.js';
import {getProjectsByCategoryId} from '../models/projects.js';

const showCategoriesPage = async (req, res) => {
    try {
        const categories = await getCategories();
        const title = 'Categories';
        res.render('categories', { title, categories });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;
    try {
        const category = await getCategoryById(categoryId);
        const projects = await getProjectsByCategoryId(categoryId);
        const title = category.name;
        res.render('category', { title, category, projects });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

export { showCategoriesPage, showCategoryDetailsPage };