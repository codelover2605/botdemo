var request = require('request') 

class CricketMatches{
    
    constructor(apiKey){
        this.apiKey = apiKey
    }
    
    getCricketMatches(callback) {
        var self = this   
        
        var options = {  
            url: 'http://cricapi.com/api/matches/',
            method: 'GET',
            headers: {
                'apikey': this.apiKey
            }
        }
        
        request(options, function(error, response, body){
                
                if(error || response.statusCode != 200){
                    var data = 'Unable to fetch the Matches data. Please try again later'
                    return callback(data)
                }
                    
                else{
                    return callback(body)
                }    
        })        
    } 
    
    
    getMatchId(team1, team2, callback){
        var self = this
        var matchId = -1
        self.getCricketMatches(function(response){
            
                var data = JSON.parse(response) 
                var matches = data['matches']
            
                for(var i=0; i < matches.length; i++){
                        
                    var item = matches[i]
                    var team = item['team-1']
                    
                    if(item['team-1'].toLowerCase() == team1.toLowerCase() && 
                       item['team-2'].toLowerCase() == team2.toLowerCase()){
                        
                        matchId = item['unique_id']
                        return callback(matchId)
                    }
                }
            })
        
            return matchId;
        }
    
    parseJsonResponse (response) {
        var matches = ''
        
        var data = JSON.parse(response) 
        var data = data['matches']
        
        for(var i = 0; i < data.length; i++){
            var item = data[i];
            
            var matchdate = 'Match start date: ' + item['date'] + '\n'
            var score = 'Score' + item['score'] + '\n'
            var team1 = 'Team1: ' + item['team-1'] + '\n'
            var team2 = 'Team2: ' + item['team-2'] + '\n'
            var matchStarted = 'Match Started: ' + item['matchStarted'] + '\n' 
            matches += matchdate + team1 + team2 + matchStarted + '\n\n'
        }
        
        return matches
    }
    
}


module.exports = CricketMatches
