Neosavvy.Controllers.controller('view.content.GameController',
    ['$scope', '$rootScope', 'constants.Configuration',
        function ($scope, $rootScope, configuration) {
            $scope.state = null;
            var playerIds;
            $scope.displayText;

            $scope.gridRows = [
                    {'id' : '0','class': 't l cell'},
                    {'id' : '1','class': 't c cell'},
                    {'id' : '2','class': 't r cell'},
                    {'id' : '3','class': 'm l cell'},
                    {'id' : '4','class': 'm c cell'},
                    {'id' : '5','class': 'm r cell'},
                    {'id' : '6','class': 'b l cell'},
                    {'id' : '7','class': 'b c cell'},
                    {'id' : '8','class': 'b r cell'}
            ];

            $rootScope.setState = function(serverState) {
                $scope.state = {};
                $scope.state.board = [];
                for (var i = 0; i < 9; i++) {
                    $scope.state.board[i] = serverState[i] == null ? ' ' : serverState[i];
                }
                $scope.state.winner = getWinner();
                console.log("State board "+$scope.state.board);
            }

            var getWinner = function(){
                var stateStr = '';
                for (var i = 0; i < 9; i++) {
                    stateStr += $scope.state.board[i];
                }

                for (var i = 0; i < configuration.win_patterns.length; i++) {
                    var win_pattern = configuration.win_patterns[i];
                    var x_regexp = new RegExp(win_pattern);
                    var o_regexp = new RegExp(win_pattern.replace(/X/g,'O'));
                    if (x_regexp.test(stateStr)) {
                        return 'X';
                    }
                    if (o_regexp.test(stateStr)) {
                        return 'O';
                    }
                }
                return ' ';
            }

           $rootScope.updateUI = function() {
                for (var i = 0; i < 9; i++) {
                    var square = document.getElementById(i);
                    square.innerHTML = $scope.state.board[i];
                }

                if ($scope.state.winner != ' ') {
                    var winnerPlayerId = $scope.state.winner == 'X' ? 0 : 1;
                    configuration.yourPlayerIndex == winnerPlayerId ? $scope.displayText = "You won the game!" : "";
                    configuration.yourPlayerIndex == winnerPlayerId ? "" : $scope.displayText = "You lost the game.";
                } else if (isMyMove()) {
                    $scope.displayText = "Your move! Click a square to place your piece.";
                } else {
                    $scope.displayText = "Waiting for other player to move...";
                }
               //$scope.$digest();
            }


            var isMyMove = function() {
                if ($scope.state == null) {
                    return;
                }
                var numberOfMoves = 0;
                for (i = 0; i < 9; i++) {
                    if ($scope.state.board[i] != ' ') {
                        numberOfMoves++;
                    }
                }
                return $scope.state.winner == ' ' && (numberOfMoves % 2 == configuration.yourPlayerIndex);
            }

            var sendMessage = function(id){
                var value = configuration.yourPlayerIndex == 0 ? 'X' : 'O';
                $scope.state.board[id] = value;
                $scope.state.winner =  getWinner();
                $rootScope.updateUI();
                var operations = [];
                operations.push({"type": "Set", "key": id.toString(), "value": value, "visibleToPlayerIds": "ALL"});
                if ($scope.state.winner != ' ') {
                    var winnerPlayerIndex = $scope.state.winner == 'X' ? 0 : 1;
                    var playerScores = {};
                    for (var index = 0; index < 2; index++) {
                        playerScores[configuration.playerIds[index]] = winnerPlayerIndex == index ? 1 : 0;
                    }
                    operations.push({"type": "EndGame", "playerIdToScore": playerScores});
                    console.log("Sending game over!");
                }
                console.log(["operations",operations,"state.winner=", $scope.state.winner, $scope.state]);
                $rootScope.send({"type" : "MakeMove", "operations" : operations});
            };

            $scope.moveInSquare = function(id){
                if (isMyMove() && $scope.state.board[id] == ' ') {
                    sendMessage(id);
                }
            };

            $scope.highlightSquare = function(id) {
                if ($scope.state == null) {
                    return;
                }
                if ($scope.state.winner != " ") {
                    return;
                }
                for (var i = 0; i < 9; i++) {
                    if (i == id  && isMyMove()) {
                        if ($scope.state.board[i] == ' ') {
                            color = 'lightBlue';
                        } else {
                            color = 'lightGrey';
                        }
                    } else {
                        color = 'white';
                    }
                    document.getElementById(i).style['background'] = color;
                }
            }

            $rootScope.send = function(message) {
                console.log(["yourPlayerIndex=", configuration.yourPlayerIndex, " sending: ", message]);
                $rootScope.socket.send(JSON.stringify(message));
            }
        }]);