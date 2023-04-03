import request from 'supertest';
import { app } from '../../src';

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
        await request(app)
            .post('/figures')
            .send({name: ''})
            .expect(400)
     });

     let createdFigure: any = null;
     it('создается 201', async ()=>{
        const createResponse = await request(app)
            .post('/figures')
            .send({name: 'asdafas'})
            .expect(201)

        createdFigure = createResponse.body;

        expect(createdFigure).toEqual({
            id: expect.any(Number),
            name: 'asdafas'
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
        .get('/figures')
        .expect(200, [createdFigure])
     });

     it('измененяется 204', async ()=>{

        await request(app)
            .put(`/figures/${createdFigure.id}`)
            .send({name: 'triangle'})
            .expect(204)

        await request(app)
        .get(`/figures/${createdFigure.id}`)
        .expect(200, {
            ...createdFigure,
            name: 'triangle'
        })
     });

});