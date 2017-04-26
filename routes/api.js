var express = require('express');
var router = express.Router();
var eventModel = require('../models/event');
var log = require('../utils/logger');

//todo 权限考虑

//############# EVENT
//get event
router.get('/event', function (req, res, next) {
    //todo module eventName channelName targetUser
    var paras = req.query || {};
    log.info('[get event]' + JSON.stringify(paras));
    var module = paras.module || '.*.*';
    var eventName = paras.eventName || '.*.*';
    var channelName = paras.channelName || '.*.*';
    var targetUser = paras.targetUser || '.*.*';
    eventModel.find({
        eventName: new RegExp(eventName, 'i'),
        module: new RegExp(module, 'i'),
        channelList: {
            $elemMatch: {channelName: new RegExp(channelName, 'i'), targetUser: {$in: [new RegExp(targetUser, 'i')]}}
        }
    })
        .then(function (events) {
            res.send(events);
        })
        .catch(function (err) {
            log.error('[get event]' + err.message, err.stack);
            res.send([]);
        });
});

//update & insert event
router.post('/event', function (req, res, next) {
    var event = req.body;
    log.info('[post event]' + JSON.stringify(event));
    eventModel.create(event)
        .then(function (model) {
            res.send(model);
        })
        .catch(function (err) {
            log.error('[post event]' + err.message, err.stack);
            res.send({});
        });
});

//delete event
router.delete('/event', function (req, res, next) {
    res.send('respond with a resource');
});

//############# USER
//add target user to a event
router.post('/target-user', function (req, res, next) {
    //todo module eventName channelName targetUser
    res.send('respond with a resource');
});

//remove target user to a event
router.delete('/target-user', function (req, res, next) {
    //todo module eventName channelName targetUser
    res.send('respond with a resource');
});


//############# TRIGGER
//trigger-event
router.post('/trigger-event', function (req, res, next) {
    //todo module eventName detail
    res.send('respond with a resource');
});

//############# HISTORY


module.exports = router;
