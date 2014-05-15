var Neosavvy = Neosavvy || {};

Neosavvy.Constants = angular.module('neosavvy.constants', []);
Neosavvy.Services = angular.module('neosavvy.services', []);
Neosavvy.Controllers = angular.module('neosavvy.controllers', []);
Neosavvy.Filters = angular.module('neosavvy.filters', []);
Neosavvy.Directives = angular.module('neosavvy.directives', []);
Neosavvy.Dependencies = [
    'neosavvy.filters',
    'neosavvy.services',
    'neosavvy.directives',
    'neosavvy.constants',
    'neosavvy.controllers',
    'ngRoute'
];

angular.module(
    'application',
    Neosavvy.Dependencies
).
  config(
    [
        '$routeProvider',
        function($routeProvider) {


            $routeProvider.when('/index', {
                templateUrl: '/application/view/content/home.html'
            });
            $routeProvider.when('/about', {
                templateUrl: '/application/view/content/about.html'
            });
            $routeProvider.when('/play', {
                templateUrl: '/application/view/content/game.html'
            });

            $routeProvider.otherwise({templateUrl: '/application/view/content/home.html'});
        }
    ]
);
