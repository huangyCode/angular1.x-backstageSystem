appModule.controller('mainCtrl', ['$rootScope', '$scope', '$http', '$state', 'rightMenu', '$interval', '$filter', function ($rootScope, $scope, $http, $state, rightMenu, $interval, $filter) {
    window.isPass = true;
    $rootScope.loading = false
    $rootScope.wrapperShow = true;
    $rootScope.wrapperShowSm = false;
    $rootScope.wrapperWidth = "200px"
    $interval(function () {
        $rootScope.nowTime = new Date();
        $rootScope.nowTime = $filter('date')($rootScope.nowTime, "yyyy-MM-dd HH:mm:ss")
        return $rootScope.nowTime
    }, 1);
    $scope.sysActive = [];
    for (var i = 0; i < 4; i++) {
        $scope.sysActive.push(false);
    }
    $scope.sysFalse = function () {
        for (var i = 0; i < 4; i++) {
            $scope.sysActive[i] = false;
        }
    }
    $rootScope.wrapperBtn = function () {
        $rootScope.wrapperShow = !$rootScope.wrapperShow;
        if ($rootScope.wrapperShow)$rootScope.wrapperWidth = "200px"
        else {
            $rootScope.wrapperWidth = "50px"
            for (var i in $rootScope.roleMenu)
                if ($rootScope.roleMenu[i].active) $rootScope.roleMenu[i].active = !$rootScope.roleMenu[i].active
        }
    }
    $scope.bisSys = function () {
        $http.get("testJson/bisNavleft.json").success(function (data) {
            $rootScope.roleMenu = data.resultValue;
            $scope.sysFalse();
            $scope.sysActive[0] = true;
        })
    }
    $scope.omsSys = function () {
        $http.get("testJson/omsNavleft.json").success(function (data) {
            $rootScope.roleMenu = data.resultValue;
            $scope.sysFalse();
            $scope.sysActive[1] = true;
        })
    }
    $scope.wmsSys = function () {
        $http.get("testJson/wmsNavleft.json").success(function (data) {
            $rootScope.roleMenu = data.resultValue;
            $scope.sysFalse();
            $scope.sysActive[2] = true;
        })
    }
    $scope.tmsSys = function () {
        $http.get("testJson/tmsNavleft.json").success(function (data) {
            $rootScope.roleMenu = data.resultValue;
            $scope.sysFalse();
            $scope.sysActive[3] = true;
        })
    }
    $scope.toggle = function (list) {
        list.childMenus = list.childMenus || [];
        if (list.childMenus.length == 0) tabs.append(list);
        else {
            for (var i in $rootScope.roleMenu) if (list != $rootScope.roleMenu[i]) $rootScope.roleMenu[i].active = false;
            list.active = !list.active;
        }
    }

    $scope.showRightMenus = function (index, tab, $event) {
        if ($event.button == 2) {
            rightMenu([
                {
                    text: "关闭当前",
                    click: function () {
                        console.log(tab);
                        tab.remove();
                    }
                }, {
                    text: "关闭所有",
                    click: function () {
                        tabs.history.length = 0;
                        tabs.length = 0;
                        $state.go("index");
                    }
                }, {
                    text: "关闭其他",
                    click: function () {
                        tabs.history.length = 0;
                        tabs.length = 0;
                        tabs.append(tab);
                    }
                }
            ], $event);
        }
    }

}])


