angular.module('rangular').
    factory('teams', ['$resource', function ($resource) {
        return $resource('/api/teams', {}, {
            query: {
                method: 'GET',
                isArray: true
            },
            create: {
                method: 'POST',
                isArray: true
            }
        })
    }]);
