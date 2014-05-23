Neosavvy.Controllers.controller('view.content.GameController',
    ['$scope', '$rootScope', 'constants.Configuration', 'services.GameService', 'services.SocketService',
        function ($scope, $rootScope, configuration, gameService, socketService) {

            var playerIds;

            $scope.socketStatus = 'Connecting...';

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

            var setState = function(serverState) {
                console.log("serverState "+serverState);
                var state = {};
                state.board = [];
                for (var i = 0; i < 9; i++) {
                    state.board[i] = serverState[i] == null ? ' ' : serverState[i];
                }
                if(serverState.winner!=null){
                    state.winner = serverState.winner;
                }else{
                    state.winner = getWinner();
                }

                console.log("State board "+state.board);
                gameService.setState(state);
            }

            var getWinner = function(){
                var stateStr = '';
                var state = gameService.getState();
                var win_patterns = gameService.getWinPatterns();
                for (var i = 0; i < 9; i++) {
                    stateStr += state.board[i];
                }

                for (var i = 0; i < win_patterns.length; i++) {
                    var win_pattern = win_patterns[i];
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

            $scope.getWinner = getWinner;

            var updateUI = function() {
                console.log("Updating the UI");
                var state = gameService.getState();
                for (var i = 0; i < 9; i++) {
                    var square = document.getElementById(i);
                    square.innerHTML = state.board[i];
                }

                if (state.winner != ' ') {
                    var yourPlayerIndex = gameService.getYourPlayerIndex();
                    var winnerPlayerId = state.winner == 'X' ? 0 : 1;
                    yourPlayerIndex == winnerPlayerId ? $scope.displayText = "You won the game!" : "";
                    yourPlayerIndex == winnerPlayerId ? "" : $scope.displayText = "You lost the game.";
                } else if (isMyMove()) {
                    $scope.displayText = "Your move! Click a square to place your piece.";
                } else {
                    $scope.displayText = "Waiting for other player to move...";
                }
            };

            var isMyMove = function() {
                var state = gameService.getState();
                if(state == null) {
                    return;
                }
                var numberOfMoves = 0;
                for (i = 0; i < 9; i++) {
                    if (state.board[i] != ' ') {
                        numberOfMoves++;
                    }
                }
                return state.winner == ' ' && (numberOfMoves % 2 == gameService.getYourPlayerIndex());
            }

            $scope.isMyMove = isMyMove;
            var sendMessage = function(id){
                var state = gameService.getState();
                var value = gameService.getYourPlayerIndex() == 0 ? 'X' : 'O';
                state.board[id] = value;
                state.winner =  getWinner();
                console.log("Winner is "+state.winner);
                setState(state.board);
                updateUI();
                var operations = [];
                operations.push({"type": "Set", "key": id.toString(), "value": value, "visibleToPlayerIds": "ALL"});
                if (state.winner != ' ') {
                    var winnerPlayerIndex = state.winner == 'X' ? 0 : 1;
                    var playerScores = {};
                    for (var index = 0; index < 2; index++) {
                        playerScores[configuration.playerIds[index]] = winnerPlayerIndex == index ? 1 : 0;
                    }
                    operations.push({"type": "EndGame", "playerIdToScore": playerScores});
                    console.log("Sending game over!");
                }
                console.log(["operations",operations,"state.winner=", state.winner, state]);
                socketService.sendMessage("MakeMove",operations);
            };

            $scope.moveInSquare = function(id){
                var state = gameService.getState();

                if (isMyMove() && state.board[id] == ' ') {
                    sendMessage(id);
                }
            };


            $scope.highlightSquare = function(id) {
                var state = gameService.getState();
                if (state == null) {
                    return;
                }
                if (state.winner != " ") {
                    return;
                }
                for (var i = 0; i < 9; i++) {
                    if (i == id  && isMyMove()) {
                        if (state.board[i] == ' ') {
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

            $scope.$on('UpdateUI', function(){
                updateUI();
            });

            $scope.$on('SocketOpen', function(){
                $scope.socketStatus = 'Connected to Server.';
            });

            $scope.$on('SocketClose', function(){
                $scope.socketStatus = 'Disconnected from WebSocket.';
            });

            $scope.$on('SetState', function(event, message){
                console.log("Logging "+ (message));
                //var state = serverState;

                setState(message);
            });

            $scope.submitClick = function() {
                socketService.sendMessage("GameReady",null);
                return false;
            };
        }]);