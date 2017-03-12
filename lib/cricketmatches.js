var request = require('request') 


class CricketMatches{
    
    constructor(apiKey){
        this.apiKey = apiKey
    }
    
    getCricketMatches(callback) {
                            
        var options = {  
            url: 'http://cricapi.com/api/matches/',
            method: 'GET',
            headers: {
                'apikey': this.apiKey //'P7L6U78REQMsT9ZEFLWsACPqqrC3'
            }
        }
        
            
        request(options, function(error, response, body){
                var matches = ''
                
                if(error || response.statusCode != 200){
                    var data = 'Unable to fetch the Matches data. Please try again later'
                    return callback(data)
                }
                    
                else{
                      var self = this
                      var data = JSON.parse(body) 
                      var data = data['matches']
        
                      for(var i = 0; i < data.length; i++){
                        var item = data[i];
                        var date = 'Match start date: ' + item['date'] + '\n'
                        var team1 = 'Team1: ' + item['team-1'] + '\n'
                        var team2 = 'Team2: ' + item['team-2'] + '\n'
                        var matchStarted = 'Match Started: ' + item['matchStarted'] + '\n'

                        matches += date + team1 + team2 + matchStarted + '\n\n'
                    }
                    
                    return callback(matches)
                }
                 
            })             
       }
    
    parseResponseBody(data) {
        var matches = ''
        
        var data = data['matches']
        
        for(var i = 0; i < data.length; i++){
            var item = data[i];
            
            var matchdate = 'Match start date: ' + item['date'] + '\n'
            var team1 = 'Team1: ' + item['team-1'] + '\n'
            var team2 = 'Team2: ' + item['team-2'] + '\n'
            var matchStarted = 'Match Started: ' + item['matchStarted'] + '\n' 
            matches += matchdate + team1 + team2 + matchStarted + '\n\n'
        }
        
        return matches
    }
}


module.exports = CricketMatches
