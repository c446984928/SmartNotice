'use strict';
/**
 * Created by calvin_chen on 2017/4/27.
 */
var ebus = require('./eventBus');
var channels = require('../channels');
var triggerModel = require('../models/trigger');
var log = require('../utils/logger');

//为组件化考虑，channel内部用process的事件，避免依赖ebus
process.on('notice-result',function (data) {
    var channelName = data.channelName,
        results = data.results,
        triggerId = data.triggerId;

    triggerModel.findOneAndUpdate({_id: triggerId},
            {$push: {
                    results: {
                        channelName: channelName,
                        results: results
                    }
                }
            }
        )
        .catch(function (err) {
            log.error('[notice-result]'+channelName+err.message,err.stack);
        })
});

var regChannelHandler = function () {
    channels.forEach(function (channel) {
        ebus.on('trigger-'+channel.name,channel.handler);
    })
};

module.exports = {
    regChannelHandler: regChannelHandler
};