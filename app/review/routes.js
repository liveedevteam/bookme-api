import controller from './controller';

export function setup(router) {
    router
        .get('/', controller.getAll)
        .get('/:id', controller.get)
        .post('/', controller.create)
        .put('/:id', controller.update)
        .put('/reply/:id', controller.updateReply)
        .delete('/:id', controller.delete)
}