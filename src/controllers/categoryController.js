import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    getCategoriesByServiceProjectId,
    updateCategoryAssignments
} from '../models/categories.js';
import {getProjectsByCategoryId, getProjectDetails} from '../models/projects.js';
import {body, validationResult} from 'express-validator';

const categoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required.')
        .bail()
        .isLength({min: 3, max: 100}).withMessage('Category name must be between 3 and 100 characters.')
];

const showCategoriesPage = async (req, res) => {
    try {
        const categories = await getAllCategories();
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

const showAssignCategoriesForm = async (req, res) => {
    const {projectId} = req.params;

    try {
        const project = await getProjectDetails(projectId);
        const categories = await getAllCategories();
        const assignedCategories = await getCategoriesByServiceProjectId(projectId);

        if (!project) {
            return res.status(404).send('Project Not Found');
        }

        res.render('assign-categories', {
            title: 'Assign Categories to Project',
            project,
            categories,
            assignedCategories
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const processAssignCategoriesForm = async (req, res) => {
    const {projectId} = req.params;
    const selectedCategoryIds = Array.isArray(req.body.categoryIds)
        ? req.body.categoryIds
        : req.body.categoryIds
            ? [req.body.categoryIds]
            : [];

    await updateCategoryAssignments(projectId, selectedCategoryIds);
    req.flash('success', 'Project categories updated successfully!');
    res.redirect(`/project/${projectId}`);
};

const showNewCategoryForm = (req, res) => {
    res.render('new-category', {
        title: 'Add New Category'
    });
};

const processNewCategoryForm = async (req, res) => {
    const results = validationResult(req);

    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-category');
    }

    const categoryId = await createCategory(req.body.name);
    req.flash('success', 'Category created successfully!');
    res.redirect(`/category/${categoryId}`);
};

const showEditCategoryForm = async (req, res) => {
    const category = await getCategoryById(req.params.id);

    if (!category) {
        return res.status(404).render('errors/404', {title: 'Category Not Found'});
    }

    res.render('edit-category', {
        title: `Edit ${category.name}`,
        category
    });
};

const processEditCategoryForm = async (req, res) => {
    const results = validationResult(req);

    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect(`/edit-category/${req.params.id}`);
    }

    await updateCategory(req.params.id, req.body.name);
    req.flash('success', 'Category updated successfully!');
    res.redirect(`/category/${req.params.id}`);
};

export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation
};