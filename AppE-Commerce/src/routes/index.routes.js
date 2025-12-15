import express from 'express'


const ecommerceRouter = express.Router();

app.use(express.json());

ecommerceRouter.get('/', (req, res) =>{
    res.json({status : 'ok'});
});

export default ecommerceRouter;