import {getCategories} from '../models/categories.js';

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

export { showCategoriesPage };