import controller from './controller';

export function setup(router) {
    router
        .get('/',controller.getAll)
        .get('/:id', controller.get)
        .post('/', controller.create)
        .put('/:id', controller.update)
        .delete('/:id', controller.delete)
        // .post('/login/:id', controller.login)
}