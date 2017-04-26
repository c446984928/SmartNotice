'use strict';
/**
 * Created by calvin_chen on 2017-4-25 15:32:29.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var eventSchema = new Schema({
        //todo 唯一索引
        eventName: String,

        module: String,

        desc: String,

        channelList: [
            {
                channelName: String,
                targetUser: Array,
                template: String,
                enable: {
                    type: Boolean,
                    default: true
                }
            }
        ]
    },
    {
        timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'}
    });

module.exports = mongoose.model('Event', eventSchema);