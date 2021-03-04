export {};
const NodeMediaServer = require('node-media-server');
const chalk = require('chalk');

const config = require('../../config/media_server');
const Business = require('../../database/schema/Schema').Business;
const Stream = require('../../database/schema/Schema').Stream;


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
    
        // Check for stream with matching key
        const streamObject = await Stream.findOne({key: streamKey},
            async function (err: any, doc: any) {
                if (err) throw err;
                if (!doc) {
                    console.log(
                        chalk.yellow('[nms] No stream with matching key', streamKey)
                    );
                    return nms.getSession(id).reject();
                }
                console.debug(chalk.blue('[nms] Stream with matching id found:'), doc._id)
                return doc;
            }
        );
    
        // Match streamObject id with upcoming stream
        const connectedBusiness = await Business.findOne(
            {'streams.upcoming': {"$in": [streamObject._id]}},
            async function(err: any, doc: any) {
                if (err) throw err;
                if (!doc) {
                    console.debug(chalk.yellow('[nms] Invalid business key', streamKey));
                    nms.getSession(id).reject();
                    return false;
                }
                console.debug(chalk.green(
                    `[nms] ${streamKey} is connected to business ${doc.email}`
                ));
    
                return doc;
    
            }
        );
    
        if (!connectedBusiness) {
            return console.log('[nms] connection terminating');
        }
    
        // Set stream from upcoming to current
        connectedBusiness.start_stream(streamObject._id);
    
        // TODO: Fix this for new database schema
        /* await Business.findOne({stream_key: stream_key}, (err: any, user: any) => {
            console.log('[nms] Ran the nms query');
            if (err) {
                return console.log(err);
            }
            if (!user) {
                console.log('[nms] Invalid business key ')
                return nms.getSession(id).reject();
            }
            return console.log(`[nms] ${stream_key} is connected to business ${user.email}`);
        }); */
    });
    

    // donePublish hook
    nms.on('donePublish', async (id: any, StreamPath: any, args: any) => {
        console.log('[nms]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    
        // Get stream key
        let streamKey = get_stream_key_from_stream_path(StreamPath);
    
        // Find stream with matching key
        const streamObject = await Stream.findOne({key: streamKey},
            async function (err: any, doc: any) {
                if (err) throw err;
                if (!doc) {
                    console.debug(
                        chalk.yellow('[nms] No stream with matching key', streamKey)
                    );
                    return nms.getSession(id).reject();
                }
                console.debug(chalk.blue('[nms] Stream with matching id found:'), doc._id)
                return doc;
            }
        );
    
        // Match streamObject id with current stream 
        const connectedBusiness = await Business.findOne(
            {'streams.current': {"$in": [streamObject._id]}},
            async function(err: any, doc: any) {
                if (err) throw err;
                if (!doc) {
                    return false;
                }
                console.debug(chalk.green(
                    `[nms] ${streamKey} is connected to business ${doc.email}`
                ));
                return doc;
            }
        );
    
        // Set stream from current to previous
        connectedBusiness.end_stream(streamObject._id);
    });

    return nms;
}



const get_stream_key_from_stream_path = (path: string) => {
    let parts = path.split('/');
    return parts[2];
};  


module.exports = node_media_server;