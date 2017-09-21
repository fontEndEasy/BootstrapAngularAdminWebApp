/**
 * Created by clf on 2016/1/14.
 */

app.directive('xgTable',function($filter){
    return{
        restrict:'AE',
        template:'<div>'+
        '<div style="margin: 10px;display: inline-block;" ng-show="showLengthMenu">'+
        '<label for="p_num">每页</label>'+
        '<select id="p_num" style="width: 50px;height: 30px;border-color:#CFD1D2;margin-left: 5px;margin-right: 5px;" ng-model="itemPerPage" >'+
        '<option ng-repeat="item in lengthMenu track by $index" value="{{item}}">{{item}}</option>'+
        '</select>'+
        '<span>条</span>'+
        '</div>'+
        '<input type="text" class="form-control rounded" ng-model="searchText" style="width: 200px;display: inline-block;float: right;margin-top:7px" placeholder="搜索">'+
        '<ng-transclude></ng-transclude>'+
        '<span style="display: inline-block; margin-top:10px;margin-left: 5px;">当前第 {{startItem}} - {{endItem}} 条，共 {{totalItems}} 条</span>'+
        '<pagination style="margin:10px 0;float: right" total-items="totalItems" ng-change="pageChanged()" items-per-page="itemPerPage" ng-model="currentPage" max-size="maxSize" class="pagination-sm" boundary-links="true" first-text="首页" last-text="尾页" previous-text="<" next-text=">"></pagination>'+
        '<div style="clear:both;"></div>'+
        '</div>',
        scope:{
            lengthMenu:'=',
            searching:'@',
            data:'='
        },
        transclude:true,
        link:function($scope,element,attr){

            $scope.itemPerPage=10;
            $scope.showLengthMenu=false;
            $scope.maxSize = 5;
            if($scope.lengthMenu&&Array.isArray($scope.lengthMenu)){
                var isNum=true;
                $scope.lengthMenu.forEach(function(item,index,array){
                    if(typeof item!=='number'){
                        isNum=false;
                    }
                });
                if(isNum==true){
                    $scope.itemPerPage=$scope.lengthMenu[0];
                    $scope.showLengthMenu=true;

                }
            }

            $scope.$watch('searchText',function(newValue,oldValue){
                if(newValue!==oldValue){
                    var filteredData=$filter('filter')($scope.data,$scope.searchText);
                    init(filteredData);
                }
            });

            $scope.$watch('itemPerPage',function(newValue,oldValue){
                if(newValue!==oldValue){
                    var filteredData=$filter('filter')($scope.data,$scope.searchText);
                    init(filteredData);
                }
            });

            function init(_data){
                $scope.currentPage = 1;
                $scope.totalItems = _data.length;
                $scope.startItem=($scope.currentPage-1)*$scope.itemPerPage+1;
                $scope.endItem=$scope.currentPage*$scope.itemPerPage;
                $scope.sliceData=_data.slice($scope.startItem-1,$scope.endItem);
            };


            $scope.$watch('data',function(newValue,oldValue){
                if(newValue){
                    init($scope.data);
                }
            });

            $scope.pageChanged = function() {
                $scope.startItem=($scope.currentPage-1)*$scope.itemPerPage+1;
                $scope.endItem=$scope.currentPage*$scope.itemPerPage;
                $scope.sliceData=$scope.data.slice($scope.startItem-1,$scope.endItem);
            };
        }
    }
});