import controller from './controller';

export function setup(router) {
    router
        .get('/',controller.getAll)
        .get('/:id', controller.get)
        .get('/get-u-id/:id', controller.getByUId)
        .get('/:uId/get-cat-id/:cId', controller.getByCatId)
        .post('/:id', controller.addFav)
        .post('/delete/:id', controller.delFav)
        // .put('/:id', controller.update)
        // .delete('/:id', controller.delete)
        // .post('/login/:id', controller.login)
}