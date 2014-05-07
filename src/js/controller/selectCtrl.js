angular.module('rangular').
    controller('selectCtrl', ['$scope', '$interval', 'participants', 'winners', 'teams', '$q', '$timeout', function ($scope, $interval, participants, winners, teams, $q, $timeout) {
        $scope.interval = 100000;
        $scope.participantField = '';
        $scope.teamField = '';

        $q.all([
                fetchWinners(),
                fetchParticipants()
            ])
            .then(function (data) {
                $scope.winners = data[0];
                $scope.participants = shuffleArray(_.difference(data[1], data[0]));
                var slides = $scope.slides = [];
                angular.forEach($scope.participants, function (participant) {
                    slides.push({name: participant});
                })
            });


        function fetchWinners() {
            var deferred = $q.defer();
            winners.query({}, function (w) {
                var winners = [];
                angular.forEach(w, function (winner) {
                    winners.push(winner.name)
                });
                deferred.resolve(winners);
            });
            return deferred.promise;
        }

        function fetchParticipants() {
            var deferred = $q.defer();
            participants.query({}, function (p) {
                var participants = [];
                angular.forEach(p, function (participant) {
                    participants.push(participant.name)
                })
                deferred.resolve(participants);
            })
            return deferred.promise;
        }

        $scope.addParticipant = function () {

            //post part-field to API
            participants.create({name: $scope.participantField}, function (data) {
                console.log('addParticipant callback : ', data);                //debug
            });
        };

        $scope.addTeam = function () {

            //post part-field to API
            teams.create({name: $scope.teamField}, function (data) {
                console.log('addTeam callback : ', data);                //debug
            });
        };

        function shuffleArray(array) {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
        }


        /* Save the source. */
        $scope.store = function () {
            var found = _.find($scope.slides, function (slide) {
                return slide.active;
            });
            winners.store({name: found.name}, function (w) {
                var winners = $scope.winners = [];
                angular.forEach(w, function (winner) {
                    winners.push(winner.name)
                });


                $timeout(function(){
                    $scope.participants = shuffleArray(_.difference($scope.participants, winners));
                    var slides = $scope.slides = [];
                    angular.forEach($scope.participants, function (participant) {
                        slides.push({name: participant});
                    })
                }, 5000)




            });

        }

        $scope.start = function () {
            $scope.interval = 1;
            $scope.initialIntervalSpeed = 1000;

            $interval(function () {
                $scope.initialIntervalSpeed = 500;
                if ($scope.interval === 451) {

                    $scope.interval = 100000;
                    $scope.store();
                }
                if ($scope.interval !== 0) {
                    $scope.interval = $scope.interval + 50;
                }
            }, $scope.initialIntervalSpeed, 10)
        }
    }]);
