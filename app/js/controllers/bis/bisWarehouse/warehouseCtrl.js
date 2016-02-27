appModule.controller('bisWarehouse', ['$scope', 'dialog', 'rts', 'au_dialog', function ($scope, dialog, rts, au_dialog) {
    $scope.warehousefilter = [{name: "status", param: 1}];
    $scope.param = {};
    $scope.$on('pageData', function ($event, msg) {
        //删除判断（弹框满足的验证函数）
        $scope.check = function () {
            //msg._getSelectedItems是一个数组，里面封装的是选中的行对象
            if (msg._getSelectedItems.length)//判断是否选择行（多行）
                for (var i in msg._getSelectedItems())
                    return msg._getSelectedItems()[i].status == "生效" && msg._getSelectedItems()[i].name == "2";//判断选择条件
        }
        //显示详情判断
        $scope.detailCheck = function () {
            //判断直是否选中一行
            if (msg._getSelectedItems().length == 1) return true;
        }
        //生效判断（弹框满足的验证函数）
        $scope.enableCheck = function () {
            //msg._getSelectedItems是一个数组，里面封装的是选中的行对象
            if (msg._getSelectedItems.length)//判断是否选择行（多行）
                for (var i in msg._getSelectedItems())
                    return msg._getSelectedItems()[i].status == "失效";//判断选择条件
        }
        //删除弹框
        $scope.delete = function () {
            //参数注释：弹框尺寸(sm小型，md中型，lg大大)，弹框满足的验证函数，弹框页面，弹框ctrl，弹框需要的数据，弹框点击涂层是否消失（static为不消失，默认为消失）
            return dialog({
                size: 'sm',
                check: $scope.check(),
                tpls: 'tpls/bis/bisWarehouselist/dialog/delete.html',
                ctrl: 'wareDeleteCtrl',
                data: msg._getSelectedItems("id"),
                backdrop: 'static'
            })
        }
        //显示详情弹框
        $scope.detail = function () {
            //根据选中的id查找详情json，然后返回弹框
            return dialog({
                size: 'lg',
                check: $scope.detailCheck(),
                tpls: 'tpls/bis/bisWarehouselist/dialog/detail.html',
                ctrl: 'wareDetailCtrl',
                data: msg._getSelectedItems("id"),
                backdrop: 'default',
                url: 'testJson/updateWare.json'
            })
        }
        //生效（无弹框直接请求）
        $scope.enable = function () {
            return rts('enable-url.do', msg._getSelectedItems("id"), $scope.enableCheck());
        }
        $scope.search = function () {
            dialog({
                size: 'md',
                check: true,
                tpls: 'tpls/bis/bisWarehouselist/dialog/search.html',
                ctrl: 'wareSearch',
                backdrop: 'default'
            });
        }
        $scope.asearch = function () {
            dialog({
                size: 'lg',
                check: true,
                tpls: 'tpls/bis/bisWarehouselist/dialog/search.html',
                ctrl: 'wareDetailCtrl',
                backdrop: 'default'
            });
        }
        //双击事件
        $scope.xxx = function () {
            console.log("hahaha")
        }
    })
}])
//删除弹框ctrl
appModule.controller('wareDeleteCtrl', ['$scope', '$uibModalInstance', 'data', function ($scope, $uibModalInstance, data) {
    $scope.ok = function () {
        console.log(data);
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}])
//显示弹框ctrl
appModule.controller('wareDetailCtrl', ['$scope', '$http', '$uibModalInstance', 'data', function ($scope, $http, $uibModalInstance, data) {
    $scope.detail = data
    $scope.ok = function () {
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}])
appModule.controller('wareSearch', ['$scope', '$http', function ($scope, $http) {
    $http.get("testJson/ctrlTable.json").success(function (data) {
        $scope.title = data.ctrlShow;
    })
    $scope.data = [{value: "=", key: "等于"}, {value: ">", key: "大于"}, {value: "<", key: "小于"}]
    $scope.colname = '';
    $scope.condition = '';
    $scope.newSearch = [{}];
    $scope.whereCond = '';
    $scope.value = '';
    $scope.changeCol = function () {
        for (var i in $scope.title) {
            if ($scope.colname == $scope.title[i].key) {
                $scope.newSearch[$scope.newSearch.length - 1].colname = $scope.colname;
                $scope.newSearch[$scope.newSearch.length - 1].colnameText = $scope.title[i].colName;
            }
        }
    }
    $scope.valueKeyDown = function () {
        $scope.newSearch[$scope.newSearch.length - 1].value = $scope.value;
    }
    $scope.changeCond = function () {
        for (var i in $scope.data) {
            if ($scope.condition == $scope.data[i].value) {
                $scope.newSearch[$scope.newSearch.length - 1].condition = $scope.condition;
                $scope.newSearch[$scope.newSearch.length - 1].conditionText = $scope.data[i].key;
            }
        }
    }
    $scope.connectJson = [{connect: "and", connectText: "并且"}, {connect: "or", connectText: "或者"}]
    $scope.connectFn = function (i) {
        if ($scope.newSearch.length && !$scope.newSearch[$scope.newSearch.length - 1].connect) {
            $scope.newSearch[$scope.newSearch.length - 1].connect = $scope.connectJson[i].connect;
            $scope.newSearch[$scope.newSearch.length - 1].connectText = $scope.connectJson[i].connectText;
            $scope.newSearch.push({});
            $scope.colname = '';
            $scope.condition = '';
            $scope.value = '';
        }
    }
    $scope.andClick = function () {
        return $scope.connectFn(0);
    }
    $scope.orClick = function () {
        return $scope.connectFn(1);
    }
    $scope.searchGo = function () {

    }
}])