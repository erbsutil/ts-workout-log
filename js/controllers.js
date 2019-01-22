var app = angular.module('app', ['ui.mask']);

app.controller('LogController', function($scope, $rootScope, $http, $timeout, $filter) {
    $scope.list = [];
    $scope.obj = {};
    $scope.total = "0:0";

    $scope.obj.date = new Date();
    $scope.save = function(time, modality) {
        var objLog = {
            time: "",
            modality: "",
            date: ""
        };

        objLog.time = $scope.obj.time;
        objLog.modality = $scope.obj.modality;
        objLog.date = $scope.obj.date;

        $scope.saveObject(objLog);
    }

    $scope.saveObject = function(objLog) {
        var saved = JSON.parse(localStorage.getItem('saveData'));
        $scope.list = [];

        if (saved !== null && saved.length > 0) {
            saved.forEach(function(objLog) {
                $scope.list.push(objLog);
            });
        }

        $scope.list.push($scope.obj);
        localStorage.removeItem('saveData');
        localStorage.setItem('saveData', JSON.stringify($scope.list));
        $scope.obj = {};
        $scope.obj.date = new Date();

        $scope.obj.time = "";
        $scope.obj.modality = "";

        $scope.listLogs();

        $scope.total = "0:0";

    }

    $scope.listLogs = function() {
        $scope.list = JSON.parse(localStorage.getItem('saveData'));

        if ($scope.list != null) {
            if ($scope.list.length == 0) {
                $scope.text = "No activity to show... Call friends and go!";
                return;
            }
            for (i = 0; i < $scope.list.length; i++) {

                $scope.total = sumHour($scope.total, $scope.list[i].time);
                $scope.text = "Great! You have " + $scope.total + " hours of exercices!";
            }
        } else {
            $scope.text = "No activity to show... Call friends and go!";
        }
    }

    $scope.listLogs();

    function sumHour(total, hourAdd) {
        hourInit = total.split(':');
        hourSum = hourAdd.split(':');
        hoursTotal = parseInt(hourInit[0], 10) + parseInt(hourSum[0], 10);
        minutesTotal = parseInt(hourInit[1], 10) + parseInt(hourSum[1], 10);

        if (minutesTotal >= 60) {
            minutesTotal -= 60;
            hoursTotal += 1;
        }
        if (minutesTotal < 10) {
            minutesTotal = "0" + minutesTotal;
        }
        if (hoursTotal < 10) {
            hoursTotal = "0" + hoursTotal;
        }

        return hourEnd = hoursTotal + ":" + minutesTotal;
    }

    $scope.delete = function(index) {
        $scope.aux = [];
        var data = JSON.parse(localStorage.getItem('saveData'));

        $scope.aux = $filter('orderBy')(data, 'date', true);
        $scope.aux.splice(index, 1);

        localStorage.removeItem('saveData');
        localStorage.setItem('saveData', JSON.stringify($scope.aux));
        $scope.list = $scope.aux;

        $scope.total = "0:0";

        $scope.listLogs();
    }

});