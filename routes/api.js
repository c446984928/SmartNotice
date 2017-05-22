const express = require('express');
const router = express.Router();
const eventModel = require('../models/event');
const triggerModel = require('../models/trigger');
const channels = require('../channels');
const log = require('../utils/logger');
const ebus = require('../helpers/eventBus');
const _ = require('lodash');

//############# EVENT
//get event
router.get('/event', function (req, res, next) {
    let paras = req.query || {};
    log.info('[get event]' + JSON.stringify(paras));
    let module = paras.module || '.*.*';
    let eventName = paras.eventName || '.*.*';
    let channelName = paras.channelName || '.*.*';
    let targetUser = paras.targetUser || '.*.*';
    let queryObject = {
        eventName: new RegExp(eventName, 'i'),
        module: new RegExp(module, 'i'),
        channelList: {
            $elemMatch: {channelName: new RegExp(channelName, 'i'), targetUser: {$in: [new RegExp(targetUser, 'i')]}}
        }
    };
    //fixbug no channelList event can't query out
    if (!paras.channelName && !paras.targetUser){
        queryObject = {
            eventName: new RegExp(eventName, 'i'),
            module: new RegExp(module, 'i')
        };
    }

    eventModel.find(queryObject)
        .then(function (events) {
            res.send(events);
        })
        .catch(function (err) {
            log.error('[get event]' + err.message, err.stack);
            res.status(500).send({error: err.message});
        });
});

//update & insert event
router.post('/event', function (req, res, next) {
    let event = req.body;
    if (!event.eventName || !event.module) {
        return res.status(400).send({error: 'check input'});
    }

    if ((event.channelList || []).length > 0) {
        let uniqueChannelList = _.uniqBy(event.channelList, x => x.channelName);
        if (uniqueChannelList.length < event.channelList.length){
            return res.status(400).send({error: 'reduplicate channel'});
        }
    }

    log.info('[post event]' + JSON.stringify(event));
    eventModel.findOneAndUpdate({eventName: event.eventName, module: event.module}, event, {upsert: true})
        .then(function (model) {
            res.send(model);
        })
        .catch(function (err) {
            log.error('[post event]' + err.message, err.stack);
            res.status(500).send({error: err.message});
        });
});

//delete event
router.delete('/event', function (req, res, next) {
    var event = req.query;
    if (!event.eventName || !event.module) {
        return res.status(400).send({error: 'check input'});
    }
    log.info('[delete event]' + JSON.stringify(event));
    eventModel.findOne({eventName: event.eventName, module: event.module}).remove().exec()
        .then(function () {
            res.send({});
        })
        .catch(function (err) {
            log.error('[delete event]' + err.message, err.stack);
            res.status(500).send({error: err.message});
        });
});

//############# CHANNEL
//get all available channel
router.get('/channel', function (req, res, next) {
    let channelList = [];
    for (let channel of channels){
        channelList.push({
            name: channel.name,
            desc: channel.desc
        })
    }
    res.send(channelList);
});

//update channel to a event
router.post('/channel', function (req, res, next) {
    let event = req.body;
    if (!event.eventName || !event.module || !event.channel) {
        return res.status(400).send({error: 'check input'});
    }
    log.info('[update channel]' + JSON.stringify(event));
    eventModel.findOne({eventName: event.eventName, module: event.module})
        .then(doc => {
            return doc.updateChannel(event.channel);
        })
        .then(doc => {
            res.send(doc)
        })
        .catch(err => {
            log.error('[update channel]' + err.message, err.stack);
            res.status(500).send({error: err.message});
        });
});

//remove channel from a event
router.delete('/channel', function (req, res, next) {
    let event = req.query;
    if (!event.eventName || !event.module || !event.channelName) {
        return res.status(400).send({error: 'check input'});
    }
    log.info('[delete channel]' + JSON.stringify(event));
    eventModel.findOne({eventName: event.eventName, module: event.module})
        .then(doc => {
            return doc.removeChannel(event.channelName);
        })
        .then(doc => {
            res.send(doc)
        })
        .catch(err => {
            log.error('[delete channel]' + err.message, err.stack);
            res.status(500).send({error: err.message});
        });
});

//############# TARGET-USER
//add target user to a event/channel
router.post('/target-user', function (req, res, next) {
    let event = req.body;
    if (!event.eventName || !event.module || !event.targetUser || !event.channelName) {
        return res.status(400).send({error: 'check input'});
    }
    log.info('[add target-user]' + JSON.stringify(event));
    eventModel.findOne({eventName: event.eventName, module: event.module})
        .then(doc => {
            return doc.addTargetUser(event.channelName,event.targetUser);
        })
        .then(doc => {
            res.send(doc)
        })
        .catch(err => {
            log.error('[add target-user]' + err.message, err.stack);
            res.status(500).send({error: err.message});
        });
});

//remove target user from a event/channel
router.delete('/target-user', function (req, res, next) {
    let event = req.body;
    if (!event.eventName || !event.module || !event.targetUser || !event.channelName) {
        return res.status(400).send({error: 'check input'});
    }
    log.info('[delete target-user]' + JSON.stringify(event));
    eventModel.findOne({eventName: event.eventName, module: event.module})
        .then(doc => {
            return doc.removeTargetUser(event.channelName,event.targetUser);
        })
        .then(doc => {
            res.send(doc)
        })
        .catch(err => {
            log.error('[delete target-user]' + err.message, err.stack);
            res.status(500).send({error: err.message});
        });
});

//############# TRIGGER
//get trigger
router.get('/trigger',function (req, res, next) {
    let paras = req.query || {};
    log.info('[get trigger]' + JSON.stringify(paras));
    let module = paras.module || '.*.*';
    let eventName = paras.eventName || '.*.*';
    triggerModel.find({
            eventName: new RegExp(eventName, 'i'),
            module: new RegExp(module, 'i')
        }).sort({"createdAt":-1}).exec()
        .then(triggers => res.send(triggers))
        .catch(err => {
            log.error('[get event]' + err.message, err.stack);
            res.status(500).send({error: err.message});
        });
});

//trigger a notice
router.post('/trigger', function (req, res, next) {
    var ip = req.headers['x-forwarded-for'] || req.ip || req._remoteAddress || (req.connection && req.connection.remoteAddress) || '0.0.0.0';
    var userAgent = req.headers['user-agent'] || '';

    var paras = req.body || {};
    // log.info('[trigger]' + ip + userAgent + JSON.stringify(paras));
    var module = paras.module || '';
    var eventName = paras.eventName || '';
    var channelName = paras.channelName || '';
    var targetUser = paras.targetUser || '';
    var detail = paras.detail || '';

    triggerModel.create({
            ip: ip,
            userAgent: userAgent,
            eventName: eventName,
            module: module,
            detail: detail,
            results: []
        })
        .then(function (model) {
            var modelId = model._id.toString();

            if (module && eventName) {
                eventModel.findOne({eventName: new RegExp(eventName, 'i'), module: new RegExp(module, 'i')})
                    .then(function (event) {
                        if (!event) {
                            return res.status(400).send({error: 'check input'});
                        }
                        var channelList = event.channelList || [];
                        channelList.forEach(function (channel) {
                            if (channel.enable) {
                                ebus.emit('trigger-' + channel.channelName, {
                                    module: module,
                                    eventName: eventName,
                                    targetUser: _.uniq(channel.targetUser),
                                    detail: detail,
                                    template: channel.template
                                }, modelId)
                            }
                        });
                        res.send({});
                    })
                    .catch(function (err) {
                        log.error('[trigger]' + err.message, err.stack);
                        res.status(500).send({error: err.message});
                    })
            }
            else if (channelName && targetUser) {
                ebus.emit('trigger-' + channelName, {
                    targetUser: targetUser,
                    detail: detail
                }, modelId);
                res.send({});
            }
            else {
                return res.status(400).send({error: 'check input'});
            }
        });

});



module.exports = router;
