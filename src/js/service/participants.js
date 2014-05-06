angular.module('rangular').
    factory('participants', ['$resource', function ($resource) {
        return $resource('/api/participants', {}, {})
    }]);