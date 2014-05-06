angular.module('rangular').
    factory('winners', ['$resource', function ($resource) {
        return $resource('/api/winners', {}, {
            query: {
                method: 'GET',
                isArray: true
            },
            store: {
                method: 'POST',
                isArray: true
            }
        })
    }]);