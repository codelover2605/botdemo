'use strict';

var bot = require('slackbots');
var request = require('request');
var CricketMatches = require('../lib/cricketmatches')

class CricBot extends bot{
    constructor(settings){
        super(settings);
        
        this.settings = settings
        this.settings.name = 'cricbot'
        this.cricapikey = settings.cricapikey
        this.user = null
        CricketMatches = new CricketMatches(this.cricapikey)
    }
    
    run() {
        this.on('start', this.onStart)
        this.on('message', this.onMessage)
    }
    
    onStart() {
        this.loadBotUser()
    }
    
    loadBotUser(){
        var self = this
        this.user = this.users.filter(function (user) {
        return user.name === self.name
        })[0]
    }
    
    getUserById(userid) {
        var self = this
        return this.users.filter(function (user) {
        return user.id === userid
        })[0]
    }
    
    onMessage(message) {
                
        var self = this
                
        if(self.isMentioningHi(message) && self.isChannelConversation(message) && !(self.isFromBot(message))) {            
            var channel = self.getChannelById(message.channel)
            self.postMessageToChannel(channel.name, self.getwelcomeMessage(message), {as_user: true})
        }
        
        if(self.isMentioningMatches(message) && self.isChannelConversation(message)) {
                CricketMatches.getCricketMatches(function(matches){
                var channel = self.getChannelById(message.channel)
                self.postMessageToChannel(channel.name, matches, {as_user: true})
            })
        }
         
    }
            
    isChannelConversation(message) {
        return typeof message.channel === 'string' && 
        message.channel[0] === 'C'
    }
    
    isMentioningMatches(message) {
        return message.text.toLowerCase().indexOf('matches') > -1
    }
    
    isMentioningHi(message) {
        return message.text.toLowerCase().indexOf('hi') > -1
    }
    
    isChatMessage(message){
        return message.type === 'message' && Boolean(message.text);
    }
    
    isFromBot(message){
        var user = this.getUserById(message.user)
        return user.name === this.settings.name
    }
    
    getChannelById(channelId) {
        return this.channels.filter(function (item) {
        return item.id === channelId
        })[0]
    }
    
    getwelcomeMessage(message) {      
        var user = this.getUserById(message.user)
        return 'Hello, Greetings ' + user.name
    }
    
}

module.exports = CricBot
