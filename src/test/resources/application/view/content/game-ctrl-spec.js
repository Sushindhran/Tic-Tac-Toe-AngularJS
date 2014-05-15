describe("view.content.GameController", function () {
    var $rootScope, $scope, controller;

    beforeEach(function () {
        module.apply(module, Neosavvy.Dependencies);

        inject(function ($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            controller = $injector.get('$controller')("view.content.GameController", {$scope: $scope});
            $scope.state = {};
        });
    });

    describe("INITIALIZATION", function () {
        it("Initialize the grid rows for ng-repeat", function () {
            expect($scope.gridRows.length).toEqual(9);
        });
    });

    describe("GAME LOGIC FUNCTIONS",function(){
        it("Winner Player 0", function(){
            $scope.state.board = ['X','O',' ','O','X',' ',' ',' ','X'];
            var winner = controller.getWinner();
            expect(winner).toEqual('X');
        });

        it("Winner Player 1", function(){
            $scope.state.board = ['X','X',' ','O','O','O',' ',' ','X'];
            var winner = controller.getWinner();
            expect(winner).toEqual("O");
        });

       /* it("Is my move Player 0", function(){
            $scope.state.board = ['X','X',' ','O','O',' ',' ',' ',' '];
            var isMove = controller.isMyMove();
            //configuration.yourPlayerIndex = 0;
            expect(isMove).toEqual(true);
        });

        it("Is my move Player 1", function(){
            $scope.state.board = ['X','X',' ','O','O',' ','X',' ',' '];
            var isMove = controller.isMyMove();
            //configuration.yourPlayerIndex = 1;
            expect(isMove).toEqual(true);
        });*/

       /* it("Setting the state", function(){
           var serverState = {"0":"X","3":"O","4":"O","8":"X"};
           var board = ['X',' ',' ','O','O',' ',' ',' ','X'];
           $rootScope.setState(serverState);
           expect($scope.state.board).toEqual(board);
        });*/
    });

});