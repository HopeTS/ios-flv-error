/** Create config object for node-media-server */
function construct_config() {
    let config = {};

    config.rtmp = {
        logType: 4,
        port: 1935,
        //chunk_size: 60000,
        //chunk_size: 2048,
        chunk_size: 30000,
        gop_cache: true,
        ping: 60,
        ping_timeout: 30
    };

    config.trans = {
        ffmpeg: process.env.FFMPEG_PATH,
        tasks: [
            {
                app: 'live',
                hls: true,
                hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
                dash: true,
                dashFlags: '[f=dash:window_size=3:extra_window_size=5]'
            }
        ]
    };

    config.api_url = 'http://localhost:8000/api/streams';
    
    config.auth = {
        api : true,
        api_user: 'admin',
        api_pass: '3r32rtes9798h!@$!@#fd'
    };

    config.http = {
        port: 8000,
        mediaroot: './server/rtmp/media',
        allow_origin: '*'
    }

    if (process.env.NAME === 'https_production') {
        config.https = {
            port: 8443,
            key: `${process.env.SSL_DIR}privkey.pem`,
            cert: `${process.env.SSL_DIR}cert.pem`,
        };
    }

    return config;
}



const nmsConfig = construct_config();


module.exports = nmsConfig;