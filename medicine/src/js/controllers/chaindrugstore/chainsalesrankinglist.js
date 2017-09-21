'use strict';
app.controller('Chainsalesrankinglist', function ($rootScope, $scope, $state, $http, $compile, utils, modal) {
    //本月店内药品销量排行榜Top10
    $scope.topDNList = [
        {name:"保健品1",number:40000},
        {name:"保健品2",number:40000},
        {name:"保健品3",number:40000},
        {name:"保健品4",number:40000},
        {name:"保健品5",number:40000},
        {name:"保健品6",number:40000},
        {name:"保健品7",number:40000},
        {name:"保健品8",number:40000},
        {name:"保健品9",number:40000},
        {name:"保健品10",number:40000}
    ];

    //本月同行药品销量排行榜Top10
    $scope.topTHList = [
        {name:"保健品1",number:40000},
        {name:"保健品2",number:40000},
        {name:"保健品3",number:40000},
        {name:"保健品4",number:40000},
        {name:"保健品5",number:40000},
        {name:"保健品6",number:40000},
        {name:"保健品7",number:40000},
        {name:"保健品8",number:40000},
        {name:"保健品9",number:40000},
        {name:"保健品10",number:40000}
    ];



});
