'use strict';
/**
 * Created by calvin_chen on 2017/4/27.
 */
const ebus = require('./eventBus');
const channels = require('../channels');
const triggerModel = require('../models/trigger');
const log = require('../utils/logger');

//为插件化考虑，channel内部用process的事件，避免依赖ebus
process.on('notice-result',function (data) {
    let channelName = data.channelName,
        results = data.results,
        triggerId = data.triggerId;

    triggerModel.findOneAndUpdate({_id: triggerId},{$push: {results: {channelName: channelName,results: results}}})
        .catch(err => {
            log.error('[notice-result]'+channelName+err.message,err.stack);
        })
});

let regChannelHandler = function () {
    channels.forEach(function (channel) {
        ebus.on('trigger-' + channel.name, channel.handler);
    })
};

module.exports = {
    regChannelHandler: regChannelHandler
};