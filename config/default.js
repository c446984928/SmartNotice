'use strict';
/**
 * Created by calvin_chen on 2017/2/23.
 */
//change here first

let config = {
    database: {
        // mongoUrl: 'mongodb://node1.mongo-rs0.service.consul,node2.mongo-rs0.service.consul,node3.mongo-rs0.service.consul/smart_notice?replicaSet=rs0&authSource=admin'
        mongoUrl: 'mongodb://127.0.0.1:27017/smart-notice'
    },

    // nodemailer config format
    EMAIL: {
        host: "10.64.1.85",
        port: 25
    }
};

module.exports = config;