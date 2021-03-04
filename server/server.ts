export {};
const path = require('path');
const chalk = require('chalk');

const ProdDatabase = require('./database/ProdDatabase');
const RTMPServer = require('./rtmp/RTMPServer');
const HTTPServer = require('./http/HTTPServer');


/** Entry point object for Castamatch app */
class Server {

    // Backend 
    database: any;
    http_server: any;
    rtmp_server: any;

    // Environment variables
    env: string | undefined;
    secret: string | undefined;
    rootPath: string;
    publicPath: string;
    httpPath: string;
    rtmpPath: string;
    databasePath: string;
    sslPath: string;


    constructor() {

        // Environment variables
        this.env = process.env.NAME;
        this.rootPath = path.join(__dirname, '..');
        this.publicPath = path.join(__dirname, '../public');
        this.httpPath = path.join(__dirname, 'http');
        this.rtmpPath = path.join(__dirname, 'rtmp');
        this.databasePath = path.join(__dirname, 'database');
        this.sslPath = process.env.SSL_DIR || '';
        this.secret = '1234567890';

        // Server configuration
        this.configure_database();
        this.configure_http();
        this.configure_rtmp();
    }


    /** Handles Database */
    private configure_database() {
        console.log(chalk.blue('Initializing server database'));

        // Initialize database
        switch (this.env) {
            case 'https_production':
                this.database = new ProdDatabase;
                break;

            case 'http_production':
                this.database = new ProdDatabase;
                break;

            case 'development':
                this.database = new DevDatabase;
                break;

            default:
                this.database = new DevDatabase;
                break;
        }
    }


    /** Handles RTMP Server */
    private configure_rtmp() {
        console.log(chalk.blue('Initializing RTMP server'));

        switch (this.env) {
            case 'development':
                this.rtmp_server = new RTMPServer;
                break;

            default:
                this.rtmp_server = new RTMPServer;
                break;
        }

        return;
    }


    /** Handles HTTP/HTTPS Server */
    private configure_http() {
        console.log(chalk.blue('Initializing HTTP server'));
        
        this.http_server = new HTTPServer(
            this.env, 
            this.publicPath, 
            this.sslPath, 
            this.secret
        );

        return;
    }


    /** Runs database */
    private async run_database() {
        this.database.run();
        return;
    }


    /** Runs HTTP server */
    private async run_http() {
        this.http_server.run();
        return;
    }


    /** Runs RTMP server */
    private async run_rtmp() {
        this.rtmp_server.run();
        return;
    }


    /** Start server */
    public start() {
        this.run_database();
        this.run_http();
        this.run_rtmp();
    }
}


const castamatch = new Server();
castamatch.start();