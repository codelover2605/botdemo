'use strict';

var bot = require('slackbots');
var request = require('request');
var emoji = require('node-emoji')
var CricketMatches = require('../lib/cricketmatches')
var CricketScore = require('../lib/cricketscore')

class CricBot extends bot{
    constructor(settings){
        super(settings);
        
        this.settings = settings
        this.settings.name = 'cricbot'
        this.cricapikey = settings.cricapikey
        this.user = null
        CricketMatches = new CricketMatches(this.cricapikey)
        CricketScore = new CricketScore(this.cricapikey)
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
            self.postMsg(message, self.getwelcomeMessage(message))
        }
        
        if(self.isAskingMyAbilities(message) && !(self.isFromBot(message))){
            self.postMsg(message, self.getPurposeMessage())
        }
        
        if(self.isMentioningScore(message) && !(self.isFromBot(message))) {
            
            var getTeams = message.text.split('v')
            var team1 = getTeams[0].split(':')[1]
            var team2 = getTeams[1]
            
            CricketMatches.getMatchId(this.trim(team1), this.trim(team2), function(id){
                
                CricketScore.getCricketScore(id, function(response){
                    var score = CricketScore.parseJsonResponse(response)
                    self.postMsg(message, score)
                })   
            })   
        }
        
        if(self.isMentioningMatches(message) && !(self.isFromBot(message))) {
            
            CricketMatches.getCricketMatches(function(response){
                var matches = CricketMatches.parseJsonResponse(response) 
                self.postMsg(message, matches)
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
    
    isMentioningScore(message) {
        return message.text.toLowerCase().indexOf('scores') > -1 ||
            message.text.toLowerCase().indexOf('score') > -1
    }
    
    isMentioningHi(message) {
        return message.text.toLowerCase().indexOf('hi') > -1
    }
    
    isAskingMyAbilities(message) {
        return message.text.toLowerCase().indexOf('purpose') > -1 || 
            message.text.toLowerCase().indexOf('can') > -1 ||
            message.text.toLowerCase().indexOf('who') > -1 
    }
    
    isChatMessage(message){
        return message.type === 'message' && Boolean(message.text);
    }
    
    isFromBot(message){
        var user = this.getUserById(message.user)
        return user.name === this.settings.name
    }
    
    isBotMentioned(message){
        
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
        var message = "My name is " + this.settings.name + cricEmoji + ".\n I can fetch you matches and scores. \n Just type 'matches' to get upcoming matches.\n Type 'score: <Team1> v <Team2>' to get scores"
        return message
    }
    
    trim(string){
        return string.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
    }
    
    postMsg(userMessage, messageTorespond){
        if(this.isChannelConversation(userMessage)){
            this.postMsgToChannel(userMessage, messageTorespond)
        }
        
        else if(this.isChatMessage(userMessage)){
            this.postMsgToUser(userMessage, messageTorespond)
        }
    }
    
    postMsgToChannel(userMessage, messageToRespond) {
        var channel = this.getChannelById(userMessage.channel)
        this.postMessageToChannel(channel.name, messageToRespond, {as_user: true})
    }
    
    postMsgToUser(userMessage, messageToRespond){
        var user = this.getUserById(userMessage.user)
        this.postMessageToUser(user.name, messageToRespond, {as_user: true})
    }
    
}

module.exports = CricBot
