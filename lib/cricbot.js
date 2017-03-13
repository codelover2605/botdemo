'use strict';

var bot = require('slackbots');
var request = require('request');
var emoji = require('node-emoji')
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
                
        if(self.isMentioningHi(message) && !(self.isFromBot(message))) {
            
            if(self.isChannelConversation(message)){
                var channel = self.getChannelById(message.channel)
                self.postMessageToChannel(channel.name, self.getwelcomeMessage(message), {as_user: true})
            }
            
            else if(self.isChatMessage(message)){
                var user = self.getUserById(message.user)
                self.postMessageToUser(user.name, self.getwelcomeMessage(message), {as_user: true})
            }
        }
        
        if(self.isAskingMyAbilities(message) && !(self.isFromBot(message))){
            
            if(self.isChannelConversation(message)){
                var channel = self.getChannelById(message.channel)
                self.postMessageToChannel(channel.name, self.getPurposeMessage(), {as_user: true})
            }
            
            else if(self.isChatMessage(message)){
                var user = self.getUserById(message.user)
                self.postMessageToUser(user.name, self.getPurposeMessage(), {as_user: true})
            }
        }
        
        if(self.isMentioningMatches(message) && !(self.isFromBot(message))) {
                CricketMatches.getCricketMatches(function(matches){
                    
                if(self.isChannelConversation(message)) {
                    var channel = self.getChannelById(message.channel)
                    self.postMessageToChannel(channel.name, matches, {as_user: true})
                }   
                    
                else if(self.isChatMessage(message)){
                    var user = self.getUserById(message.user)
                    self.postMessageToUser(user.name, matches, {as_user: true})
                }
                
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
    
    isAskingMyAbilities(message) {
        return message.text.toLowerCase().indexOf('purpose') > -1 || 
            message.text.toLowerCase().indexOf('what can you do') > -1 ||
            message.text.toLowerCase().indexOf('who') > -1 ||
            message.text.toLowerCase().indexOf('what is your super power') > -1
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
    
    getPurposeMessage() {
        var cricEmoji = emoji.get(':cricket_bat_and_ball:')
        var message = 'My name is ' + this.settings.name + cricEmoji + '. I can fetch you upcoming match details. Just type matches/upcoming matches'
        return message
    }
    
}

module.exports = CricBot
