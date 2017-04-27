'use strict';
/**
 * Created by calvin_chen on 2017/2/23.
 */
var config = {
    database: {
        // mongoUrl: 'mongodb://node0.mongo.skydns.local,node1.mongo.skydns.local,node2.mongo.skydns.local/app_server_dev?replicaSet=rs0&authSource=admin'
        mongoUrl: 'mongodb://127.0.0.1:27017/smart-notice'
    },

    EMAIL: {
        host: "10.64.1.85",
        port: 25
    }
};

module.exports = config;