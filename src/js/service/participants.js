angular.module('rangular').
    factory('participants', ['$resource', function ($resource) {
        return $resource('/api/participants', {}, {
            create: {
                method: "POST",
                isArray: true
            }
        })
    }]);
