describe("view.content.SocketController", function () {
    var $rootScope, $scope, controller;

    beforeEach(function () {
        module.apply(module, Neosavvy.Dependencies);

        inject(function ($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            controller = $injector.get('$controller')("view.content.SocketController", {$scope: $scope});
        });
    });

});