import request from 'supertest';
import { app } from '../../src';
import { FigureCreateModal } from '../../src/models/FigureCreateModel';
import { FigureUpdateModal } from '../../src/models/FigureUpdateModal';

describe('/figures',  ()=>{

    beforeAll(async ()=>{
        await request(app).delete('/__test__/delete');
    });

    it('получаем пустой массив 200', async ()=>{
       await request(app)
            .get('/figures')
            .expect(200, [])
    });

    it('не получаем элемент 200', async ()=>{
        await request(app)
             .get('/figures/1')
             .expect(404)
     });

     it('не создается 400', async ()=>{
        const data: FigureCreateModal = {name: ''};
        await request(app)
            .post('/figures')
            .send(data)
            .expect(400)
     });

     let createdFigure: any = null;
     it('создается 201', async ()=>{
        const data: FigureCreateModal = {name: 'asdafas'};
        const createResponse = await request(app)
            .post('/figures')
            .send(data)
            .expect(201)

        createdFigure = createResponse.body;

        expect(createdFigure).toEqual({
            id: expect.any(Number),
            name: data.name
        })

        await request(app)
        .get('/figures')
        .expect(200, [createdFigure])
     });

     it('не измененяется 400', async ()=>{
        await request(app)
            .put(`/figures/${createdFigure.id}`)
            .send({id: createdFigure.id, name: ''})
            .expect(400)

        await request(app)
        .get('/figures/' + createdFigure.id)
        .expect(200, createdFigure)
     });

     it('измененяется 204', async ()=>{
        const data: FigureUpdateModal = {name: 'triangle'};
        await request(app)
            .put(`/figures/${createdFigure.id}`)
            .send(data)
            .expect(204)

        await request(app)
        .get(`/figures/${createdFigure.id}`)
        .expect(200, {
            ...createdFigure,
            name:  data.name
        })
     });

});