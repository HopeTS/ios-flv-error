export {};
const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');

const homeRouter = require('./routers/home');
const wildcardRouter = require('./routers/wildcard');


/** HTTP / HTTPS server */
class HTTPServer {
    express: any;
    env: string | undefined;
    publicPath: string;
    sslPath: string;
    secret: string;
    
    constructor(
        env: string | undefined,
        publicPath: string,
        sslPath: string,
        secret: string
    ) {

        console.log('http server constructor')
        // Environment variables
        this.env = env;
        this.publicPath = publicPath;
        this.sslPath = sslPath;
        this.secret = secret;
        console.log('secret in constructor', secret)

        // Handle express configuration
        this.express = express();
        this.configure_express_https();

        this.configure_routers();
    }


    /** Handles express server configuration for https production environment */
    private configure_express_https() {

        // Express options
        this.express.use(express.static(this.publicPath));
        this.express.use(express.json());
        this.express.use(bodyParser.urlencoded({extended: true}));
        this.express.use(express.urlencoded({extended: true}));
        this.express.use(cookieParser(this.secret));
        this.express.use(session({
            secret: this.secret,
            resave: true,
            saveUnititialized: true
        }));
        this.express.use(cors({
            origin: 'https://castamatch.com',
            credentials: true
        }))

        // Passport
        this.express.use(passport.initialize());
        this.express.use(passport.session());
        require('./auth/passport')(passport);        
    }

    /** Attach routes to server */
    private configure_routers() {
        try {
            this.express.use(homeRouter);
            this.express.use(wildcardRouter);
        }

        catch(e) {
            console.error(e);
            return;
        }
    }

    /** Run server in development environment */
    private async run_development() {
        console.log(chalk.blue('Launching development HTTP server'));

        http.createServer(this.express).listen(3000, () => {
            console.log(chalk.underline.green(
                'Development HTTP server has connected.'
            ));
        });
    }

    /** Run server in HTTPS production environment */
    private async run_https() {
        console.log(chalk.blue('Launching production HTTPS server'));

        // HTTPS cert config
        const httpsOptions = {
            key: fs.readFileSync(`${this.sslPath}privkey.pem`, 'utf8'),
            cert: fs.readFileSync(`${this.sslPath}cert.pem`, 'utf8'),
            ca: fs.readFileSync(`${this.sslPath}chain.pem`, 'utf8')
        };

        // Run HTTPS server
        https.createServer(httpsOptions, this.express).listen(443, () => {
            console.log(chalk.underline.green(
                'Production HTTPS server has connected.'
            ));
        });

        // Run HTTP server
        http.createServer(this.express).listen(80, () => {
            console.log(chalk.underline.green(
                'Production HTTP server has connected.'
            ));
        });
    }


    /** Runs server */
    public async run() {
        switch (this.env) {
            case 'https_production':
                this.run_https();
                break;

            case 'development':
                this.run_development();
                break;

            default:
                this.run_development();
                break;
        }
    }
}

module.exports = HTTPServer;