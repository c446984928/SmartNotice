'use strict';
/**
 * Created by calvin_chen on 2017/4/26.
 */
var email = require('./email');
var ebus = require('../utils/eventBus');

const channels = [email];

var regHandler = function () {
   channels.forEach(function (channel) {
       ebus.on('trigger-'+channel.name,channel.handler);
   })
};

module.exports = {
    channels: channels,
    regHandler: regHandler
};