describe("view.content.GameController", function () {
    var $rootScope, $scope, controller;

    beforeEach(function () {
        module.apply(module, Neosavvy.Dependencies);

        inject(function ($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            gameService = $injector.get('services.GameService');
            controller = $injector.get('$controller')("view.content.GameController", {$scope: $scope});
        });
    });

    describe("INITIALIZATION", function () {
        it("Initialize the grid rows for ng-repeat", function () {
            expect($scope.gridRows.length).toEqual(9);
        });
    });

    describe("GAME LOGIC FUNCTIONS",function(){
        it("Winner Player 0", function(){
            var state = {};
            state.board = ['X','O',' ','O','X',' ',' ',' ','X'];
            gameService.setState(state);
            var winner = $scope.getWinner();
            expect(winner).toEqual('X');
        });

        it("Winner Player 1", function(){
            var state = {};
            state.board = ['X','X',' ','O','O','O',' ',' ','X'];
            gameService.setState(state);
            var winner = $scope.getWinner();
            expect(winner).toEqual("O");
        });

       it("Is my move Player 0", function(){
            var state = {};
            state.board = ['X','X',' ','O','O',' ',' ',' ',' '];
            gameService.setState(state);
            gameService.setYourPlayerIndex(0);
            var isMove = $scope.isMyMove();
            expect(isMove).toEqual(true);
        });

        it("Is my move Player 1", function(){
            var state = {};
            state.board = ['X','X',' ','O','O',' ','X',' ',' '];
            gameService.setState(state);
            gameService.setYourPlayerIndex(1);
            var isMove = $scope.isMyMove();
            expect(isMove).toEqual(true);
        });

    });

});