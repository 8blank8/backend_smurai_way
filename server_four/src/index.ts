import express, { Request, Response } from 'express';
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from './types';
import { FigureCreateModal } from './models/FigureCreateModel';
import { FigureUpdateModal } from './models/FigureUpdateModal';
import { FigureQueryModal } from './models/GetFigureQueryModal';
import { FigureApiModal } from './models/FigureApiModal';
import { FigureUriParamsIdModel } from './models/FigureUriParamsIdModae';

export const app = express();
const port = 3000;

const jsonBodyMidleware = express.json();
app.use(jsonBodyMidleware);

type FiguresType ={
    id: number,
    name: string,
    size: number
}

let db: {figures: FiguresType[]} = {
    figures:[
        {id: 1, name: 'circle', size: 10},
        {id: 2, name: 'oval', size: 10},
        {id: 3, name: 'rectangle', size: 10},
        {id: 4, name: 'triangle', size: 10}
    ]
}

const getFigureApiModel = (figures: FiguresType): FigureApiModal =>{
    return {
            id: figures.id,
            name: figures.name
    };
}

app.get('/figures', (req: RequestWithQuery<FigureQueryModal>, 
                    res: Response<FigureApiModal[]>)=>{
    let figures = db.figures

    if(req.query.name){
        figures = figures.filter(item=> item.name.indexOf(req.query.name) > -1);
    }

    res.json(figures.map(getFigureApiModel));

});

app.get('/figures/:id', (req: RequestWithParams<FigureUriParamsIdModel>, 
                         res: Response<FigureApiModal>)=>{
    const item = db.figures.find(item => item.id === +req.params.id);

    if(!item){
        res.sendStatus(404);
        return;
    }

    res.json(getFigureApiModel(item));

});

app.delete('/figures/:id', (req: RequestWithParams<FigureUriParamsIdModel>, res)=>{
    db.figures = db.figures.filter(item => item.id !== +req.params.id);


    res.sendStatus(204);

});

app.post('/figures', (req: RequestWithBody<FigureCreateModal>, 
                      res: Response<FigureApiModal>)=>{

    if(!req.body.name){
        res.sendStatus(400);
        return;
    }

    const createdFigures: FiguresType = {
        id: +(new Date()),
        name: req.body.name,
        size: 0
    }
    db.figures.push(createdFigures);

    res.status(201).json(getFigureApiModel(createdFigures));
});

app.put('/figures/:id', (req: RequestWithParamsAndBody<FigureUriParamsIdModel, FigureUpdateModal>, res)=>{
    if(!req.body.name){
        res.sendStatus(400);
        return;
    }

    const item = db.figures.find(item => item.id === +req.params.id);


    if(!item){
        res.sendStatus(404);
        return;
    }

    item.name = req.body.name;

    res.sendStatus(204);

});

app.delete('/__test__/delete', (req, res)=>{
    db.figures = [];
    res.sendStatus(204);
});

 
app.listen(port);