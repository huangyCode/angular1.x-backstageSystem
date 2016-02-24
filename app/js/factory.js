//右键菜单
appModule.factory('rightMenu', ['$rootScope', '$interval', function ($rootScope, $interval) {
    $interval(function () {
        if ($rootScope.rightMenus && (window.showContextMenu != $rootScope.rightMenus.show)) {
            $rootScope.rightMenus.show = window.showContextMenu;
        }
    }, 10);
    var rightMenu = function (params, event) {
        $rootScope.rightMenus = params;
        $rootScope.rightMenus.X = event.pageX + "px";
        $rootScope.rightMenus.Y = event.pageY + "px";
        window.showContextMenu = true;
        $rootScope.rightMenus.close = function ($event) {
            if ($event.button == 2) {
                $rootScope.rightMenus.X = $event.pageX + "px";
                $rootScope.rightMenus.Y = $event.pageY + "px";
                window.showContextMenu = false;
            }
        }
        window.rightMenus = $rootScope.rightMenus;
    }
    return rightMenu;
}]);
//复选框鼠标点击事件
appModule.factory("clickDown", function () {
    var one = null;
    var two = null;
    var clickDown = function (name, num, item, $event) {
        if ($event.button == 0) {
            item._selectItem(function () {
                if ($event.shiftKey && $event.ctrlKey) {
                    console.log("all");
                } else if ($event.shiftKey) {
                    if (one != null)two = num;
                    else one = num;
                    var start = one, end = two;
                    if (one > two) start = two, end = one;
                    for (var i = start; i <= end; i++) name.data.list[i]._selected = name.data.list[two]._selected;
                    one = two, two = null;
                } else if (!$event.shiftKey && !$event.ctrlKey) {
                    one = num;
                    for (var i = 0, length = name.data.list.length; i < length; i++) {
                        if (i != num) name.data.list[i]._selected = false;
                    }
                } else if ($event.ctrlKey) {
                    one = num;
                }
            });
        }
    }
    return clickDown;
})
//弹框公共方法size, fn, tpls, ctrl, data, backdrop, url
appModule.factory('dialog', ['dialoginit', '$http', function (dialoginit, $http) {
    return function (obj) {
        if (obj.check) {
            if (obj.url) $http.get(obj.url, obj.data).success(function (data) {
                return dialoginit(obj.size, obj.tpls, obj.ctrl, data, obj.backdrop)
            })
            else return dialoginit(obj.size, obj.tpls, obj.ctrl, obj.data, obj.backdrop)
        }
        else return console.log("不满足操作条件");
    }
}]);
//弹框init
appModule.factory('dialoginit', ['$uibModal', function ($uibModal) {
    return function (size, tpls, ctrl, data, backdrop) {
        $uibModal.open({
            animation: true,
            backdrop: backdrop,
            templateUrl: tpls,
            controller: ctrl,
            size: size,
            resolve: {
                data: function () {
                    return data;
                }
            }
        });
    }
}])
//新增数据弹框&&修改数据弹框
appModule.factory('au_dialog', ['dialoginit', '$http', function (dialoginit, $http) {
    return function (obj) {
        obj.msg.obj = {};
        var ctrl;
        if (obj.status == 'add') {
            ctrl = ['$scope', '$http', '$uibModalInstance', function ($scope, $http, $uibModalInstance) {

                $scope.submit = function () {
                    $http.post(obj.addurl, obj.msg.obj).success(function (data) {
                        if (data) {
                            obj.msg.go();
                        }
                    })
                }
                $scope.cancel = $uibModalInstance.dismiss('cancel');
            }]
        }
        return dialoginit('lg', obj.tpls, ctrl, obj.msg.obj , 'default');
    }
}])
//小型提示框
appModule.factory('', function () {
})
//按钮请求
appModule.factory("rts", ['$http', function ($http) {
    return function (url, param, fn) {
        if (fn) {
            $http.post(url, param).success(function (data) {
                if (data) console.log("请求成功");
            })
        } else console.log("请求条件不满足");
    }
}])

appModule.factory('requestUrl', ["$rootScope", '$q', '$injector', function ($rootScope, $q, $injector) {
    var requestUrl = {
        request: function (config) {
            $rootScope.loading = false;
            $rootScope.width = "0%"
            if (config) {
                $rootScope.loading = true;
                $rootScope.width = "70%"
            }
            return config;
        },

        requestError: function (rejectReason) {
            $rootScope.loading = false;
            $rootScope.width = "0%"
            if (rejectReason === 'requestRejector') {
                // Recover the request
                return {
                    transformRequest: [],
                    transformResponse: [],
                    method: 'GET',
                    url: 'http://localhost:63342/wuliuModule/app/index.html#/index',
                    headers: {
                        Accept: 'application/json, text/plain, */*'
                    }
                };
            } else {
                return $q.reject(rejectReason);
            }
        }
    };
    return requestUrl;
}]);
//http请求拦截器--response
appModule.factory("responseUrl", ['$rootScope', '$q', '$injector', function ($rootScope, $q, $injector) {
    var responseUrl = {
        response: function (response) {
            if ($rootScope.loading && $rootScope.width == "70%")$rootScope.width = "100%";
            if (response) $rootScope.loading = false
            return response;
        },
        responseError: function (response) {
            if (response.status != 200) {
                var deferred = $q.defer();
                console.log(deferred.notify);
                console.log(deferred.resolve);
                console.log(deferred.reject);
                return
            }
            return $q.reject(response);
        }
    }
    return responseUrl
}])
