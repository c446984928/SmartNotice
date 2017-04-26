'use strict';
/**
 * Created by calvin_chen on 2017-4-25 15:46:07.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var triggerHistorySchema = new Schema({
        ip: String,

        userAgent: String,

        eventName: String,

        module: String,

        detail: String,

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

module.exports = mongoose.model('TriggerHistory', triggerHistorySchema);