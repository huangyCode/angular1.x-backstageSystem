appModule.filter("status", function () {
    return function (input, param) {
        if (param == 1) {
            if (input == "ENABLED") {
                return "生效";
            } else if (input == "DISABLE") {
                return "失效";
            } else {
                return input
            }
        }
    }
})