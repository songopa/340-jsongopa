
const testErrorPage = (req, res, next) => {
    const err = new Error('Test error');
    err.status = 500;
    next(err);
}

export { testErrorPage };