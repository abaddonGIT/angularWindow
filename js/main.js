var app = angular.module("app", ['angularWindow']);
app.controller("baseController", ['$scope', '$document', '$compile', '$angularWindow', '$rootScope', '$http', function ($scope, $document, $compile, $angularWindow, $rootScope, $http) {
    $scope.images = [
        {
            src: 'img/14.jpg',
            title: '1 картинка',
            id: '1'
        },
        {
            src: 'img/13.jpg',
            title: '2 картинка',
            id: '2'
        },
        {
            src: 'img/22.jpg',
            title: '1 картинка',
            id: '1'
        },
        {
            src: 'img/33.jpg',
            title: '2 картинка',
            id: '2'
        },
        {
            src: 'img/44.jpg',
            title: '3 картинка',
            id: '3'
        },
        {
            src: 'img/55.jpg',
            title: '3 картинка',
            id: '3'
        },
        {
            src: 'img/66.jpg',
            title: '3 картинка',
            id: '3'
        }
    ];

    $scope.data = [
        {
            title: '1 картинка',
            id: '1'
        },
        {
            title: '2 картинка',
            id: '2'
        },
        {
            title: '3 картинка',
            id: '3'
        }
    ];

    $scope.openFree = function () {
        $angularWindow.open({
            scope: $scope,
            tpl: "tpl/defInnerTpl.html"
        }).then(function (obj) {//Тут я сам могу сделать вывод какой мне хочется, окно будет ждать пока я не закончу
            //obj.config.target = $scope.data;
            $http({'url': 'test.php', 'method': 'post'}).success(function (data) {
                obj.config.target.push(data);
                obj.goOn();
            });
            return obj.instance;
        }).then(function (win) {
            win.bind("afterOpen", function () {
                console.log("после открытия");
            });
        });
    };

    $scope.openFour = function () {
        $angularWindow.open({
            controllerScope: $scope,
            tpl: "tpl/inlineTpl.html"
        }).then(function (obj) {//Тут я сам могу сделать вывод какой мне хочется, окно будет ждать пока я не закончу
            $http.get("tpl/ajaxHtmlTpl.html").success(function (tpl) {
                obj.config.target = $scope.images;
                obj.sectors['content'].html(tpl);
                var content = obj.sectors['content'].contents();
                $compile(content)(obj.scope);
                obj.goOn();
            });
            return obj.instance;
        }).then(function (win) {
            win.bind("afterOpen", function () {
                console.log("после открытия");
            });
        });
    };

    $scope.open = function (e) {
        $angularWindow.open({
            target: $scope.images,
            controllerScope: $scope,
            pathAttr: 'src',
            tpl: "tpl/defInnerTpl.html"
        }).then(function (obj) {
            obj.instance.bind("afterOpen", function () {
                console.log("после открытия");
            });
        });

        e.preventDefault();
    };
}]);