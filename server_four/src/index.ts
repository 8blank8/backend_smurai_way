import express from 'express';

export const app = express();
const port = 3000;

const jsonBodyMidleware = express.json();
app.use(jsonBodyMidleware);

let db = {
    figures:[
        {id: 1, name: 'circle'},
        {id: 2, name: 'oval'},
        {id: 3, name: 'rectangle'},
        {id: 4, name: 'triangle'}
    ]
}

app.get('/figures', (req, res)=>{
    let figures = db.figures

    if(req.query.name){
        figures = figures.filter(item=> item.name.indexOf(req.query.name as string) > -1);
    }

    res.json(figures);

});

app.get('/figures/:id', (req, res)=>{
    const item = db.figures.find(item => item.id === +req.params.id);

    if(!item){
        res.sendStatus(404);
        return;
    }

    res.json(item);

});

app.delete('/figures/:id', (req, res)=>{
    db.figures = db.figures.filter(item => item.id !== +req.params.id);


    res.sendStatus(204);

});

app.post('/figures', (req, res)=>{

    if(!req.body.name){
        res.sendStatus(400);
        return;
    }

    const createdFigures = {
        id: +(new Date()),
        name: req.body.name
    }
    db.figures.push(createdFigures);

    res.status(201).json(createdFigures);
});

app.put('/figures/:id', (req, res)=>{
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