angular.module('rangular').config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'partials/select.html'
        }).
        otherwise({
            redirectTo: '/'
        });
}]);