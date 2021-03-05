export {};
const NodeMediaServer = require('node-media-server');
const config = require('../../config/media_server');


/** 
 * Configures NodeMediaServer 
 * 
 * @returns {*} NodeMediaServer instance
 */
function node_media_server() {

    // Initialize NodeMediaServer instance
    const nms = new NodeMediaServer(config);


    // preConnect hook
    nms.on('preConnect', (id: any, args: any) => {
        console.debug('[nms event on preConnect]', `id=${id} args=${JSON.stringify(args)}`);
    });
    

    // prePublish hook
    nms.on('prePublish', async (id: any, StreamPath: any, args: any) => {
        console.debug('[nms]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    
        // Get stream key
        let streamKey = get_stream_key_from_stream_path(StreamPath);

        if (streamKey != 'castamatch12345') {
            console.log('Invalid key');
            nms.getSession(id).reject();
        }

        else {
            console.log('Streaming!');
        }
    });

    return nms;
}



const get_stream_key_from_stream_path = (path: string) => {
    let parts = path.split('/');
    return parts[2];
};  


module.exports = node_media_server;