import controller from './controller';

export function setup(router) {
    router
        .get('/',controller.getAll)
        .get('/:id', controller.get)
        .post('/', controller.create)
        .put('/:id', controller.update)
        .delete('/:id', controller.delete)
        .get('/:id/professional', controller.getPro)
        .put('/profile-image/:id', controller.updateImage)
        .post('/add-favorite/:id', controller.addFav)
        .post('/delete-favorite/:id', controller.delFav)
        .get('/count-favorite/:id', controller.countFav)
        .put('/:id/document/update-bank-account', controller.updateBank)
        .put('/:id/document/update-id-card', controller.updateIdCard)
        .put('/:id/document/verify-bank', controller.verifyBank)
        .put('/:id/document/verify-card', controller.verifyIdCard)
        .put('/:id/update-fcm', controller.updateToken)
        .put('/:id/logout', controller.logOut)
}