const ErrorModules = require('../errors');
const jwt = Lib.getModules('jwt');
const Authentication = Lib.Model('Authentications');
const User = Lib.Model('Users');
const EmailSmsTemplate = Lib.Model('EmailSmsTemplate');
const logger = require('../library/logger');
const mongoose = require('mongoose');
const {ObjectId} = mongoose.Types;
const notificationServices=require('../services/notification.service')
const libary=require('../library/library')

/**
 * Required Info
 * resolve is a function, which will call the resolver after the middleware
 * root is the root of the graphql
 * args is the arguments passed to the resolvers. Add any extra data to the args from the middleware if any data needs to be passed to the resolver.
 * content: contains the req and res object
 * info: i don't know. Please write the usage of it if you know something
 */

module.exports = {
    getFcmTokens: async function ( userId, slug, lang,image = ""){
        const fcmTokenArray=[]
        if(userId){
            const findUser = await User.findOne({
                "_id": new ObjectId(userId)
            })
            let response = await EmailSmsTemplate.findOne({
                $or: [{ 'type': "Push"}, { 'type': "All" }],
                slug: slug,
                is_deleted: false,
                is_active: true
            });
            findUser.device_details.forEach(element => {
                // For only Mobile app
                // For both mobile app and web app
                if (element.device_type === 'web' && element.web_token && response.device_type.includes("web") && response.domains.includes(element.domain)) {
                    fcmTokenArray.push(element.web_token);
                } 
                if(element.device_type === 'android' && element.fcm_token && response.device_type.includes("android")){
                    fcmTokenArray.push(element.fcm_token);
                }
                if(element.device_type === 'ios' && element.fcm_token && response.device_type.includes("ios")){
                    fcmTokenArray.push(element.fcm_token);
                }
            });
            console.log(fcmTokenArray,`line 33 noti.helper`);
            const payload = {
                recipient:
                    {
                        fcmToken:fcmTokenArray,
                        user_id:userId
                    },
                    template:{
                        type:"Push",
                        slug:`${slug}`,
                        lang:`${lang}`,
                        image:`${image}`
                    },
  
                }
                console.log(payload,`line 50 noti.helper`)
            await notificationServices.notifyService(payload)
        }

    } 
    
}
