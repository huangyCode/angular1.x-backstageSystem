appModule.directive('pageutil', function () {
    return {
        restrict: "A",
        replace: true,
        scope: {
            headurl: '@',
            bodyurl: '@',
            pageutil: '=pageutil',
            param: '=param',
            filter: '=filter'
        },
        controller: ['$scope', '$http', 'clickDown', '$filter', '$uibModal', function ($scope, $http, clickDown, $filter, $uibModal) {
            if (!$scope.pageutil)$scope.pageutil = {};
            $scope.pageutil.parameter = {};
            $scope.pageutil.pageNum = 1;
            $scope.pageutil.pageSize = 10;
            $scope.pageutil.orderBy = "";
            $scope.pageutil.buttons = [];
            if ($scope.param) $scope.pageutil.parameter = $scope.param;
            /*请求thead*/
            $scope.getHead = function () {
                $http.get($scope.headurl).success(function (data) {
                    for (var i in data.ctrlShow) {
                        data.ctrlShow[i].desc = false;
                        data.ctrlShow[i].asc = false;
                        data.ctrlShow[i].sortFlag = false;
                    }
                    data.ctrlShow.enThead = function (obj) {
                        if (!obj.sortFlag) obj.desc = true;
                        else obj.asc = true;
                    }
                    data.ctrlShow.leThead = function (obj) {
                        obj.desc = false;
                        obj.asc = false;
                    }
                    data.ctrlShow.descClick = function (obj) {
                        obj.sortFlag = true;
                        obj.desc = false;
                        obj.asc = true;
                        $scope.pageutil.orderBy = obj.key + " desc"
                        $scope.getBody();
                    }
                    data.ctrlShow.ascClick = function (obj) {
                        obj.sortFlag = false;
                        obj.desc = true;
                        obj.asc = false;
                        $scope.pageutil.orderBy = obj.key + " asc"
                        $scope.getBody();
                    }
                    $scope.pageutil.ctrlShow = data.ctrlShow;
                })
            }
            /*请求tbody*/
            $scope.getBody = function () {
                $http.post($scope.bodyurl, {
                    pageNum: $scope.pageutil.pageNum,
                    pageSize: $scope.pageutil.pageSize,
                    parameter: $scope.pageutil.parameter,
                    orderBy: $scope.pageutil.orderBy
                }).success(function (data) {
                    $scope.pageutil.data = data;
                    if ($scope.filter) {
                        for (var i in $scope.pageutil.data.list)
                            for (var j in $scope.pageutil.data.list[i])
                                for (var k = 0; k < $scope.filter.length; k++)
                                    if (j == $scope.filter[k].name)
                                        $scope.pageutil.data.list[i][j] = $filter($scope.filter[k].name)($scope.pageutil.data.list[i][j], $scope.filter[k].param);
                    }
                    /*处理复选框数据*/
                    data.list._selected = false;
                    /*处理单个复选框*/
                    for (var i = 0; i < data.list.length; i++) {
                        var o = data.list[i];
                        o._selected = false;
                        o._selectItem = function (fn) {
                            this._selected = !this._selected;
                            fn && fn();
                            for (var j = 0; j < data.list.length; j++) if (!(data.list._selected = data.list[j]._selected)) return;
                        }
                    }
                    /*处理全选复选框*/
                    data.list._selectAll = function () {
                        data.list._selected = !data.list._selected;
                        for (var i = 0; i < data.list.length; i++) data.list[i]._selected = data.list._selected;
                    }
                    /*获取已选中的项*/
                    $scope.pageutil._getSelectedItems = function (attr) {
                        var result = [];
                        for (var i = 0; i < data.list.length; i++) {
                            if (data.list[i]._selected) result.push(attr ? data.list[i][attr] : data.list[i]);
                        }
                        return result;
                    }
                    /*处理分页按钮数据*/
                    var btnsLength = 5,
                        start = $scope.pageutil.pageNum - Math.floor(btnsLength / 2),
                        end = $scope.pageutil.pageNum + Math.floor(btnsLength / 2);
                    start = (start < 1) ? 1 : start;
                    end = (end > data.pages) ? data.pages : end;
                    $scope.pageutil.buttons.length = 0;
                    for (var i = start; i <= end; i++) {
                        $scope.pageutil.buttons.push(i);
                    }
                    /*选择行*/
                    $scope.pageutil.clickDown = function (name, num, item, $event) {
                        clickDown(name, num, item, $event);
                    }
                    /*往上层controller冒泡*/
                    $scope.$emit("pageData", $scope.pageutil);
                }).error(function () {
                    console.log("请求失败");
                });
            }
            //执行分页请求
            $scope.pageutil.go = function (pageNum) {
                if (pageNum) {
                    $scope.pageutil.pageNum = (pageNum < 1) ? 1 : pageNum;
                    if ($scope.pageutil.data) $scope.pageutil.pageNum = (pageNum > $scope.pageutil.data.pages) ? $scope.pageutil.data.pages : pageNum;
                }
                $scope.getHead();
                $scope.getBody();
            }
            $scope.options = [
                {value: 10, name: '10'},
                {value: 20, name: '20'},
                {value: 50, name: '50'}
            ];
            $scope.pageutil.go(1);
            //列表显示修改 弹框
            $scope.pageutil.ctrlTableShow = function (size) {
                $uibModal.open({
                    templateUrl: 'tpls/common/ctrlTableShow.html',
                    controller: function ($scope, $uibModalInstance, show) {
                        //console.log(show.data);
                        $scope.show = show.data.ctrlShow.sort(function (a, b) {
                            return a.sort - b.sort;
                        });
                        $scope.up = function (index, obj) {
                            //console.log(show.data)
                            //console.log(show.indexOf(this)-1);
                            if (index > 0) {
                                $scope.show[index].sort = obj.sort - 1;
                                $scope.show[index - 1].sort = show.data.ctrlShow[index - 1].sort + 1;
                                $scope.show.sort(function (a, b) {
                                    return a.sort - b.sort;
                                })
                            }
                        }
                        $scope.down = function (index, obj) {
                            //console.log(show.indexOf(this)-1);
                            // console.log(index, obj);
                            //console.log(show);
                            if (index < $scope.show.length) {
                                $scope.show[index].sort = obj.sort + 1;
                                $scope.show[index + 1].sort = show.data.ctrlShow[index + 1].sort - 1;
                                $scope.show.sort(function (a, b) {
                                    return a.sort - b.sort;
                                })
                            }
                        }
                        //console.log($scope.show);
                        $scope.ok = function () {
                            $uibModalInstance.close();
                        };
                        $scope.reDefualt = function () {

                        }
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                    },
                    size: size,
                    resolve: {
                        show: function () {
                            return $http.get($scope.headurl).success(function (data) {
                                $scope.data = data.ctrlShow;
                            })
                        }
                    }
                });
            }
        }
        ],
        templateUrl: "tpls/common/table.html"
    }
        ;
})
;
//分页2
appModule.directive('grid', function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            obj: "@"
        },
        controller: ['$scope','$resource',function ($scope, $resource) {

        }]
    }
})
    .directive('gridTr', function () {
        return {
            require: "^gird",
            restrict: 'E',
            transclude: true,
            scope: {
                name: "@"
            },
            link: function (scope) {

            }
        }
    })
//标签页
appModule.directive('myTabs', function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {},
        controller: ['$scope', function ($scope) {
            var panes = $scope.panes = [];
            $scope.select = function (pane) {
                angular.forEach(panes, function (pane) {
                    pane.selected = false;
                });
                pane.selected = true;
            };
            this.addPane = function (pane) {
                if (!panes.length) {
                    $scope.select(pane);
                }
                panes.push(pane);
            };
        }],
        templateUrl: 'tpls/common/my-tabs.html'
    };
})
    .directive('myPane', function () {
        return {
            require: '^myTabs',
            restrict: 'E',
            transclude: true,
            scope: {
                title: '@'
            },
            link: function (scope, element, attrs, myTabsCtrl) {
                myTabsCtrl.addPane(scope);
            },
            templateUrl: 'tpls/common/my-pane.html'
        };
    });
//主页标签页
appModule.directive("tag", function () {
    return {
        restrict: 'AE',
        replace: true,
        controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
            $scope.tags = [];
            $scope.tagHistory = [];
            $scope.appendTag = function (obj) {
                for (var i in $scope.tags) if ($scope.tags.hasOwnProperty(i)) $scope.tags[i].current = false;
                var flag;
                for (var i in $scope.tags) {
                    if ($scope.tags[i].code == obj.code) {
                        obj = $scope.tags[i];
                        flag = true;
                        break;
                    }
                    else flag = false;
                }
                if (!flag) $scope.tags.push(obj)
                if ($scope.tags.indexOf(obj) < 0) $scope.tags.push(obj);
                if ($scope.tagHistory[$scope.tagHistory.length - 1] != obj) $scope.tagHistory.push(obj);
                obj.current = true;
                if (!$rootScope.wrapperShow)
                    for (var i in $rootScope.roleMenu)
                        if ($rootScope.roleMenu[i].active) $rootScope.roleMenu[i].active = !$rootScope.roleMenu[i].active;
            }
            $scope.remove = function (obj) {
                var h_index;
                while ((h_index = $scope.tagHistory.indexOf(obj)) >= 0) $scope.tagHistory.splice(h_index, 1);
                $scope.tags.splice($scope.tags.indexOf(obj), 1)
                if ($scope.tagHistory.length)$scope.appendTag($scope.tagHistory[$scope.tagHistory.length - 1]);
            }

        }],
        templateUrl: "tpls/common/tags.html"
    }
})
