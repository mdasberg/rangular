angular.module('rangular').factory('httpInterceptor', [ '$q', function ($q) {
    return {
        'response': function (response) {
            if(response.data.rows) {
                response.data = response.data.rows;
            }
            return response;
        }
    };
}]);

angular.module('rangular').config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
}]);