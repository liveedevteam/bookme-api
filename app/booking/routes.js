import controller from './controller';

export function setup(router) {
    router
        .get('/',controller.getAll)
        .get('/:id', controller.get)
        .post('/', controller.create)
        .put('/:id', controller.update)
        .delete('/:id', controller.delete)
        .get('/get-u-id/:id', controller.getByUId)
        .post('/omise/:token', controller.omiseCreditCard)
        .post('/checked-norti-day', controller.checkedDay)
}