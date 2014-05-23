Neosavvy.Services.factory('services.SocketService', ['$rootScope','services.GameService', 'constants.Configuration',
    function($rootScope, gameService, configuration){
    // We return this object to anything injecting our service
    var Service = {};

    // Create a new WebSocket.
    var socket = new WebSocket(configuration.wsDomain+":"+configuration.gamePort);

    socket.onopen = function(){
        console.log("Socket has been opened!");
        $rootScope.$broadcast('SocketOpen');
    };

    socket.onerror = function(error) {
        console.log('WebSocket Error: ' + error);
    };

    socket.onmessage = function(message) {
        listener(JSON.parse(message.data));
    };

    socket.onclose = function(event) {
        $rootScope.$broadcast('SocketClose');
    };

    var send  = function(message) {
        console.log('Sending request', message);
        socket.send(JSON.stringify(message));
    };

    var listener = function(data) {
        console.log(["yourPlayerIndex=", configuration.yourPlayerIndex, " received: ", data]);
        console.log("Type is "+data.type);
        if (data.type == "UpdateUI") {
            configuration.playerIds = [];
            for (var i = 0; i < data.playersInfo.length; i++) {
                configuration.playerIds.push(data.playersInfo[i].playerId);
            }
            gameService.setYourPlayerIndex(configuration.playerIds.indexOf(data.yourPlayerId));
            console.log(JSON.stringify(data.state));
            var message = (data.state);
            //console.log((message.board));
            $rootScope.$broadcast('SetState',data.state);
            $rootScope.$broadcast('UpdateUI');
        }
        if (data.type == "VerifyMove") {
            Service.send({"type" : "VerifyMoveDone", "hackerPlayerId" : null, "message":null});
        }
    };

    // Define a "getter" for getting customer data
    Service.sendMessage = function(type, operations) {
        if(type == "VerifyMove"){
            send({"type" : type, "hackerPlayerId" : null, "message":null});
        }else if(type == "GameReady"){
            send({"type" : type});
        }else if(type == "MakeMove"){
            send({"type" : type, "operations" : operations});
        }
    };

    return Service;
}]);