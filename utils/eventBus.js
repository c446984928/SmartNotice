'use strict';
var logger = require('./logger');
const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.on('uncaughtException', function (err) {
    logger.error('[eventBus uncaughtException]'+err.message, err.stack);
});

module.exports = emitter;