import controller from './controller_backup';

export function setup(router) {
    router
        .get('/',controller.getAll)
        .get('/:id', controller.get)
        .post('/', controller.create)
        .put('/:id', controller.update)
        .delete('/:id', controller.delete)
        .get('/get-u-id/:id', controller.getByUId)
        .post('/omise/:token', controller.omiseCreditCard)
}