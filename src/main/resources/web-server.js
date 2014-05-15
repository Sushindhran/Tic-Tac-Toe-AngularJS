(function () {
    "use strict";

    var express = require('express');
    //var httpProxy = require("http-proxy");
    var path = require("path");

    var args = process.argv.splice(2);
    var basePort = Number(args[0]);
    var packageDir = args[1];

    var ws = require("nodejs-websocket");
    var connCount = 0;
    var state;

    function initState() {
        state = { connections : [], gameReadyCount : 0};
    }

    function send(source, message) {
        //debug("Sending: " + JSON.stringify(message));
        source.sendText(JSON.stringify(message));
    }

    function sendGameState() {
        for (var i = 0; i < 2; i++) {
            var msg = {"type" : "UpdateUI", "state": state.gameState, "yourPlayerId" : ("" + i), "playersInfo" : [{"playerId": "0"}, {"playerId": "1"}]};
            console.log("Sending to player "+ i + " "+msg);
            send(state.connections[i], msg);
        }
    }
    function listener(event) {
        var data = event.data;
        debug("Received: " + JSON.stringify(data));
    }

    function mutateState(data){
        var type = JSON.parse(data).type;
        if (type == "GameReady") {
            console.log("Type is gameReady");
            state.gameReadyCount++;
            var indexOfSender = -1;
            for (var i = 0; i < 2; i++) {
                if (state.connections[i]) {
                    indexOfSender = i;
                }
            }
            if (indexOfSender == -1) {
                window.alert("Error! Something went wrong. Try connecting again.");
            }
            if (state.gameReadyCount == 2) {
                console.log("Two players have started the game");
                // start game
                state.gameState = {};
                sendGameState();
            }
        } else if (type == "MakeMove") {
            var operations = JSON.parse(data).operations;
            for (var i = 0; i < operations.length; i++) {
                var operation = operations[i];
                if (operation.type = "Set") {
                    state.gameState[operation.key] = operation.value;
                }
            }
            sendGameState();
        }
    }

    function createServer(domain, port) {
        var options = {
            changeOrigin: true
        };
        ws.createServer(function (conn){
            console.log("New Connection");

            //Allow only two connections
            if(connCount<2){
                state.connections.push(conn);
                connCount++;
            }else{
                console.log("Only two players can play");
                conn.close();
            }

            conn.on("text", function(str){
                console.log("Received "+str);
                mutateState(str);
            });

            conn.on("close", function(code, reason){
                connCount = 0;
                initState();
                console.log("Connection closed");
            });
        }).listen(port);
        console.log("Port " + port + " is proxying to " + domain);
    }

    var app = express();
    app.use(express.static(packageDir));
    app.listen(basePort);
    console.log('Package (' + path.resolve(packageDir) + ') is served on http://localhost:' + basePort);
    initState();
    createServer("ws://localhost",8001);
})();
