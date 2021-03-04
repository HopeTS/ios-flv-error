export {};
const express = require('express');
const path = require('path');
const chalk = require('chalk');

const publicPath = path.join(__dirname, '../../../public/');
const appRoute = path.join(publicPath, 'index.html');


// Router config
const router = new express.Router();

router.get('/*', (req: any, res: any) => {
    try {
        return res.sendFile(appRoute);

    } catch(e) {
        res.send();
        console.log(
            chalk.red('An error occured: '),
            '\n',
            `${e}`
        );
    }
});


module.exports = router;