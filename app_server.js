// 네이버 Papago NMT API 예제
var express = require('express');

var app = express();
var client_id = 'dKOtBRuD3Lq5XXkoQS07';
var client_secret = 'Utv6o9mrTL';
var query = "현재 금 시세는 얼마인가요?";

/* WolframAplha Simple Test start [ --- */
app.get('/simpleWolf', function (req, res) {
    
  var resultStr;
  // WolframAlpha Call API
  var wolfram = require('wolfram').createClient("RUK6JE-56KU9Q7EX4");

  wolfram.query("What is the current price of gold", function(err, result) {
      if(err) throw err
      console.error("result", result);
      resultStr = result;

      //res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
      res.write(JSON.stringify(resultStr));
      res.end();
  });
});
/* WolframAplha Simple Test end --- ] */

/* Papago NMT Translate Simple Test start [ --- */
app.get('/papagoNMTTrans', function (req, res) {
  var api_url = 'https://openapi.naver.com/v1/papago/n2mt';
  var request = require('request');
  // Setting Options
  var options = {
      url: api_url,
      form: {'source':'ko', 'target':'en', 'text':query},
      headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
  };

  request.post(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
      res.end(body);
    } else {
      res.status(response.statusCode).end();
      console.log('error = ' + response.statusCode);
    }
  });
});
/* Papago NMT Translate Simple Test end --- ] */

app.get('/getMyKnowledgeInfo/:query', function (req, res) {

  res.writeHead(200, { 'Content-Type': 'text/html' });

  // papagoNMT Setting variables
  var papagoNMTStr;
  var papagoNMTJSON;

  // papagoNMT node.js file load
  var papagoQuery = require('./papagoNMTTrans.js');
  // papagoNMT Translation + wolframAlpha API Call
  var mypapagoQuery = papagoQuery.papagoNMTTranslation(req.params.query,function (response) {

    papagoNMTStr = JSON.stringify(response);
    papagoNMTJSON = JSON.parse(papagoNMTStr).message.result.translatedText;

    console.log('::: Original Text : ' + req.params.query);
    console.log('::: Traslated Text : ' + papagoNMTJSON);

    // wolframAlpha Setting variables
    var wolframStr;
    var wolframJSON;
    var htmlStr = '';

    // wolframAlpha node.js file load
    var wfQuery = require('./wolfQuery.js');
    var mywfQuery = wfQuery.queryWolframAlpha(papagoNMTJSON,function (response) {
      
      console.log('::: wolframAlpha Length : ' + response.length);
      console.log('wolframAlpha Str : ' + JSON.stringify(response[0].title));

      for ( var i=0 ; i < response.length; i++) {
        htmlStr += response[i].title + '<br>' + '<img src=\'' + response[i].subpods[0].image + '\'><br><br><br>';
      }
      
      res.write(htmlStr);
      res.end();

    });
  });
});

app.listen(3000, function () {
  console.log('::: MyKnowledgeUp Service App listening on port 3000!');
});