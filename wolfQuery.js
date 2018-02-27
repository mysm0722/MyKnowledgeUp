var express = require('express');
var app = express();
// WolframAlpha API Call
var wolfram = require('wolfram').createClient("RUK6JE-56KU9Q7EX4");

module.exports = {
    queryWolframAlpha: function(queryStr,callback) {
        console.log('::: queryWolframAlpha() is called.');

        var resultStr;
        return wolfram.query(queryStr, function(err, result) {
            
            if(err) throw err
            console.error("result", result);
            resultStr = result;
    
            // retrun callback function
            return callback(resultStr) ;
        });
    }
}