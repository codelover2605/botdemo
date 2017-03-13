var request = require('request') 

class CricketScore{
    
    constructor(apiKey){
        this.apiKey = apiKey
    }
    
    
    getCricketScore(matchId, callback){
        
        var options = {  
            url: 'http://cricapi.com/api/cricketScore?unique_id=' + matchId,
            method: 'GET',
            headers: {
                'apikey': this.apiKey
            }
        }
        
        request(options, function(error, response, body){

                if(error || response.statusCode != 200){
                    var data = 'Unable to fetch the Score. Please try again later'
                    return callback(data)
                }
                    
                else{
                    return callback(body)
                }    
        })    
    }
    
     parseJsonResponse (response) {
        var score = ''
        
        var data = JSON.parse(response)
        
        var inningsRequirement = 'summary: ' + data['innings-requirement'] + '\n'
        var type = 'type: ' + data['type'] + '\n'
        var dateTime = 'dateTime (GMT): ' + data['dateTimeGMT'] + '\n'
        var team1 = 'Team1: ' + data['team-1'] + '\n'
        var team2 = 'Team2: ' + data['team-2'] + '\n'
        var matchStarted = 'Match Started: ' + data['matchStarted'] + '\n' 
        score += inningsRequirement + type + dateTime + team1 + team2 + matchStarted + '\n\n'

        return score
    }
}

module.exports = CricketScore