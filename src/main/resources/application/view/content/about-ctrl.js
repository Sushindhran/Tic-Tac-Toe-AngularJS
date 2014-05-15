Neosavvy.Controllers.controller('view.content.AboutController',
    ['$scope', '$rootScope', 'constants.Configuration',
        function ($scope, $rootScope, configuration) {
            this.aboutText = "This is a multiplayer Tic Tac Toe game made using AngularJS and NodeJS using websockets.";
        }]);