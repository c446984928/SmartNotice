'use strict';
/**
 * Created by calvin_chen on 2017/4/26.
 */

var config = require('config').EMAIL;
var nodemailer = require('nodemailer');
var log = require('../utils/logger');
var _ = require('lodash');

var channelName = "EMAIL";
var channelDesc = "for send email notice";

module.exports = {
    name: channelName,
    desc: channelDesc,
    handler: function (options,triggerId) {
        var targetUser = options.targetUser;
        if (!targetUser) {
            return;
        }
        var module = options.module || '',
            eventName = options.eventName || '',
            detail = options.detail || '',
            template = options.template || '';

        var transporter = nodemailer.createTransport(config);

        var mailOptions = {
            from: '"SmartNotice" <no-reply@SmartNotice>', // sender address
            subject: (module || eventName) ? module + '-' + eventName : detail, // Subject line
            text: 'Module: '+(module||'unknown')+'\n' +'Event: '+ (eventName||'unknown') + '\n' + 'Detail: '+(detail||'unknown')
        };

        var mailTasks = [];
        targetUser.forEach(function (user) {
            var option = _.cloneDeep(mailOptions);
            option.to = user;
            mailTasks.push(
                new Promise(function (resolve, reject) {
                    transporter.sendMail(option,function (err,info) {
                        if (err){
                            resolve({
                                targetUser: user,
                                success: 0,
                                info: err
                            });
                        }else {
                            resolve({
                                targetUser: user,
                                success: 1,
                                info: info
                            });
                        }
                    });
                })
            )
        });

        Promise.all(mailTasks)
            .then(function (results) {
                process.emit('notice-result',{
                    channelName: channelName,
                    results: results,
                    triggerId: triggerId
                });
                log.info('[EMAIL results]'+JSON.stringify(results));
            })
    }
};
