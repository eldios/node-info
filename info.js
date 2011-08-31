var appVersion = 0.1 ;


var jade = require('jade'),
    fs = require('fs'),
    express = require('express'),
    app = express.createServer();
 
// ### Middleware ###
app.configure(function(){
  app.use(express.logger('\x1b[33m:method\x1b[0m \x1b[32m:url\x1b[0m :response-time'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  // app.use(express.session({ secret: '.uber-secret-cookie-password.' , store: dbSessionStoreCustomVar }));
  app.use(express.session({ secret: '.uber-secret-cookie-password.' }));
  app.use(express.favicon(__dirname + '/pub/favicon.ico'));
  // app.use(express.basicAuth('lele', 'basicLele'));
  app.use(app.router);
  app.use(express.static(__dirname + '/pub'));
  app.set('views',__dirname + '/views');
  app.set('view engine','jade');
});
app.configure('production',function(){
  app.use(express.errorHandler());
});
app.configure('dev',function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

var parseData = function(){
  var npm = require('npm'),
      data={
        'platform' : process.platform , 
        'nodeVersion' : process.version ,
        'npmVersion' : npm.version,
        'memory' : function(){
          var procMemInfo = fs.readFileSync('/proc/meminfo').toString().split("\n") ,
              totalMem = parseInt(procMemInfo[0].replace(/\D+/g,'')) ,
              freeMem = parseInt(procMemInfo[1].replace(/\D+/g,'')) ,
              freeMemPerc = Math.round(freeMem/totalMem*100) ,
              usedMem = totalMem - freeMem , 
              usedMemPerc = Math.round(usedMem/totalMem*100) ,
              cachedMem = parseInt(procMemInfo[3].replace(/\D+/g,'')) , 
              cachedMemPerc = Math.round(cachedMem/totalMem*100) ;

          return {
            'total': totalMem , 
            'used' : usedMem , 'usedPerc' : usedMemPerc , 
            'free' : freeMem , 'freePerc' : freeMemPerc ,
            'cached' : cachedMem , 'cachedPerc' : cachedMemPerc 
          }; 
        }()
      };
  return data ;
};

// ### Routing ###
app.get('/',function(req,res){
  var data = parseData() ;
  res.render('root',{'title':'node-hq','data': data});
});

// ### Server final configs ###
var HTTPPort = process.env.PORT || "11639";
app.listen(Number(HTTPPort));
console.log("Listening on port " + HTTPPort);