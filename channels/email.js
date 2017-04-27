'use strict';
/**
 * Created by calvin_chen on 2017/4/26.
 */

var config = require('config').EMAIL;
var nodemailer = require('nodemailer');
var log = require('../utils/logger');
var _ = require('lodash');

module.exports = {
    name: "EMAIL",
    desc: "for send email notice",
    handler: function (options) {
        var targetUser = options.targetUser;
        if (!targetUser) {
            return;
        }
        var module = options.module || '',
            eventName = options.eventName || '',
            detail = options.detail || '',
            template = options.template || '';

        var transporter = nodemailer.createTransport({
            host: "10.64.1.85",
            port: 25
        });

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
                            var ret = {};
                            ret[user] = [1,err];
                            resolve(ret);
                        }else {
                            var ret = {};
                            ret[user] = [0,info];
                            resolve(ret);
                        }
                    });
                })
            )
        });

        Promise.all(mailTasks)
            .then(function (results) {
                //todo emit 事件 存储通知结果
                log.info('[EMAIL results]'+JSON.stringify(_.merge.apply(this,results)));
            })
    }
};
