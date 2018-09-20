import controller from './controller';

export function setup(router) {
    router
        .get('/',controller.getAll)
        .get('/:id', controller.get)
        .post('/', controller.create)
        .put('/job/:id', controller.updateByJob)
        .put('/employ/:id', controller.updateByEmploy)
        .delete('/:id', controller.delete)
        .get('/get-u-id/:id', controller.getByUId)
        .put('/add-date-u-id/:id', controller.AddByUId)
        .put('/update-u-id/:id', controller.updateByUId)
        .post('/checked-date/:id', controller.checkedDate)
}