import controller from './controller';

export function setup(router) {
    router
        .get('/',controller.getAll)
        .get('/:id', controller.get)
        .post('/', controller.create)
        .put('/:id', controller.update)
        .delete('/:id', controller.delete)
        .get('/categories/:cId', controller.getByCatId)
        .put('/:id/verify-recommend', controller.updateRecommend)
        .put('/:id/unverify-recommend', controller.unUpdateRecommend)
        .post('/filter', controller.getByFilter)
        .post('/smart-search', controller.smartSearch)
        .post('/date-search', controller.dateSearch)
}