const express = require('express');
const path = require('path');
const chalk = require('chalk');
const bodyParser = require('body-parser');

const publicPath = path.join(__dirname, '../../../public/');
const appRoute = path.join(publicPath, 'index.html');


// Router config
const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.get('/', (req: any, res: any) => {
    try {
        return res.sendFile(appRoute);
    } 
    
    catch(e) {
        console.log(chalk.red('An error occured: '), '\n', `${e}`);
        res.status(500).send();
    }
});

module.exports = router;