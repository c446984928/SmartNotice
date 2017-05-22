'use strict';
/**
 * Created by calvin_chen on 2017/4/26.
 */
const config = require('config').EMAIL;
const nodemailer = require('nodemailer');
const log = require('../utils/logger');
const _ = require('lodash');

const channelName = "EMAIL";
const channelDesc = "for send email notice";

module.exports = {
    name: channelName,
    desc: channelDesc,
    handler: function (options,triggerId) {
        let targetUser = options.targetUser;
        if (!targetUser || !targetUser.length) {
            return;
        }
        let module = options.module || '',
            eventName = options.eventName || '',
            detail = options.detail || '',
            template = options.template || '';

        let transporter = nodemailer.createTransport(config);

        let mailOptions = {
            from: module+ ' ' + "<no-reply@smart-notice.skyaid-service.trendmicro.org>", // sender address
            subject: module + '-' + eventName, // Subject line
            html: detail
        };

        let mailTasks = [];
        targetUser.forEach(function (user) {
            let option = _.cloneDeep(mailOptions);
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
