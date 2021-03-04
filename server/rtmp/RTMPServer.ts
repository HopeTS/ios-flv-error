export {};
const node_media_server = require('./nms/nms');


/** RTMP server object */
class RTMPServer {
    nms: any;

    constructor() {
        this.configure_node_media_server();
    }

    /** Initializes NodeMediaServer object */
    private configure_node_media_server() {
        this.nms = node_media_server();
        return;
    }

    /** Run RTMPServer */
    public run() {
        try {
            this.nms.run();
            return;
        }

        catch(e) {
            console.error(e);
            return;
        }
    }
}


module.exports = RTMPServer;