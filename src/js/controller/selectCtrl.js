angular.module('rangular').controller('selectCtrl', ['$scope', 'participants', function($scope, participants) {
    participants.query({}, function(p) {
        $scope.participants = p;
    })
}])