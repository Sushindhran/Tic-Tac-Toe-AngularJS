Neosavvy.Controllers.controller('view.content.SocketController',
    ['$scope', '$rootScope', 'constants.Configuration',
        function ($scope, $rootScope, configuration) {
            $scope.socketStatus = 'Connecting...';
            var statusDiv = document.getElementById('status');

            // Create a new WebSocket.
            var socket = new WebSocket(configuration.wsDomain+":"+configuration.gamePort);

            // Handle any errors that occur.
            socket.onerror = function(error) {
                console.log('WebSocket Error: ' + error);
            };

            // Show a connected message when the WebSocket is opened.
            socket.onopen = function(event) {
                console.log("Socket Open");
                //statusDiv.className = 'open';
            };

            // Handle messages sent by the server.
            socket.onmessage = function(event) {
                var data = JSON.parse(event.data);
                console.log("Receiving");
                console.log(["yourPlayerIndex=", configuration.yourPlayerIndex, " received: ", data]);
                console.log("Type is "+data.type);
                if (data.type == "UpdateUI") {
                    console.log("UpdateUI");
                    configuration.playerIds = [];
                    for (var i = 0; i < data.playersInfo.length; i++) {
                        configuration.playerIds.push(data.playersInfo[i].playerId);
                    }
                    configuration.yourPlayerIndex = configuration.playerIds.indexOf(data.yourPlayerId);
                    $rootScope.setState(data.state);
                    $rootScope.updateUI();
                }
                if (data.type == "VerifyMove") {
                    $rootScope.send({"type" : "VerifyMoveDone", "hackerPlayerId" : null, "message":null});
                }
            };

            // Show a disconnected message when the WebSocket is closed.
            socket.onclose = function(event) {
                $scope.socketStatus = 'Disconnected from WebSocket.';
                statusDiv.className = 'closed';
            };

            // Send a message when the form is submitted.
            $scope.submitClick = function() {
                $scope.socketStatus = 'Connected to Server';
                $rootScope.socket = socket;
                $rootScope.send({"type" : "GameReady"});
                return false;
            };
        }]);