'use strict';
/**
 * Created by calvin_chen on 2017/2/23.
 */
let config = {
    database: {
        mongoUrl: 'mongodb://node1.mongo-rs0.service.consul,node2.mongo-rs0.service.consul,node3.mongo-rs0.service.consul/smart_notice?replicaSet=rs0&authSource=admin'
    },

    EMAIL: {
        host: "10.204.16.7",
        port: 25
    }
};

module.exports = config;