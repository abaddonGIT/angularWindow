var app = angular.module("app", ['angularWindow']);
app.controller("baseController", ['$scope', '$document', '$compile', '$angularWindow', '$rootScope', '$http', function($scope, $document, $compile, $angularWindow, $rootScope, $http) {

        $scope.images = [
            {
                src: 'img/1.jpg',
                title: '1 картинка',
                id: '1'
            },
            {
                src: 'img/2.jpg',
                title: '2 картинка',
                id: '2'
            },
            {
                src: 'img/3.jpg',
                title: '3 картинка',
                id: '3'
            },
            {
                src: 'img/4.jpg',
                title: '4 картинка',
                id: '4'
            },
            {
                src: 'img/5.jpg',
                title: '5 картинка',
                id: '5'
            },
            {
                src: 'img/6.jpg',
                title: '6 картинка',
                id: '6'
            },
            {
                src: 'img/7.jpg',
                title: '7 картинка',
                id: '7'
            },
            {
                src: 'img/8.jpg',
                title: '8 картинка',
                id: '8'
            },
            {
                src: 'img/9.jpg',
                title: '9 картинка',
                id: '9'
            },
            {
                src: 'img/10.jpg',
                title: '10 картинка',
                id: '10'
            },
            {
                src: 'img/11.jpg',
                title: '11 картинка',
                id: '11'
            },
            {
                src: 'img/12.jpg',
                title: '12 картинка',
                id: '12'
            }
        ];
        $scope.images2 = [
            {
                src: 'img/12.jpg',
                title: '1 картинка',
                id: '1'
            },
            {
                src: 'img/2.jpg',
                title: '2 картинка',
                id: '2'
            },
            {
                src: 'img/3.jpg',
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

        $scope.openTwo = function(e) {
            $angularWindow.open({
                target: $scope.images2,
                controllerScope: $scope,
                startIndex: 1,
                myParams: {
                    description: "Альбом №2"
                },
                pathAttr: 'src',
                tpl: "tpl/defInnerTpl.html"
            }).then(function(obj) {
                //Перед открытием
                obj.instance.bind("beforeOpen", function(eventName, config, result) {
                    console.log("Перед открытием");
                });
                //После открытия
                obj.instance.bind("afterOpen", function() {
                    console.log("после открытия второго окна");
                });
                //Перед пагинацией
                obj.instance.bind("beforePagination", function(eventName, config, currindex, index) {
                    config.myParams.test = "Меня добавили в событии beforePagination";
                });
            });

            e.preventDefault();
        };

        $scope.openFree = function() {
            $angularWindow.open({
                controllerScope: $scope,
                tpl: "tpl/defInnerTpl.html"
            }).then(function(obj) {//Тут я сам могу сделать вывод какой мне хочется, окно будет ждать пока я не закончу
                //obj.config.target = $scope.data;
                $http({'url': 'test.php', 'method': 'post'}).success(function (data) {
                    obj.config.target.push(data);
                    obj.goOn();
                });
                return obj.instance;
            }).then(function(win) {
                win.bind("afterOpen", function() {
                    console.log("после открытия");
                });
            });
        };
        
        $scope.openFour = function() {
            $angularWindow.open({
                controllerScope: $scope,
                tpl: "tpl/inlineTpl.html"
            }).then(function(obj) {//Тут я сам могу сделать вывод какой мне хочется, окно будет ждать пока я не закончу
                $http.get("tpl/ajaxHtmlTpl.html").success(function(tpl) {
                    obj.config.target = $scope.images2;
                    obj.sectors['content'].html(tpl);
                    var content = obj.sectors['content'].contents();
                    $compile(content)(obj.scope);
                    obj.goOn();
                });
                return obj.instance;
            }).then(function(win) {
                win.bind("afterOpen", function() {
                    console.log("после открытия");
                });
            });
        };

        //получение инстанса модуля
        $scope.open = function(e) {
            $angularWindow.open({
                target: $scope.images,
                controllerScope: $scope,
                pathAttr: 'src',
                tpl: "tpl/defInnerTpl.html"
            }).then(function(obj) {
                obj.instance.bind("afterOpen", function() {
                    console.log("после открытия");
                });
            });

            e.preventDefault();
            /*
             var elem = e.currentTarget;
             switch (elem.className) {
             case 'attr':
             $popupWindow.open({
             target: elem,
             source: "data-img"
             });
             break;
             case 'inline':
             $popupWindow.open({
             type: 'inline',
             requestParam: {
             title: "Заголовок 2"
             },
             innerTpl: 'tpl/inlineTpl.html'
             });
             break;
             case 'ajax':
             $popupWindow.open({
             target: elem,
             type: 'ajax',
             pushState: true,
             ajax: {
             method: 'get'
             },
             requestParam: {
             id: elem.getAttribute('img')
             },
             beforeContentLoaded: function (eventName, win, sectors) {
             win.requestParam.title = "Заголовок был сменен в событии beforeContentLoaded";
             },
             innerTpl: 'tpl/ajaxJsonTpl.html'
             });
             break;
             case 'ajaxhtml':
             $popupWindow.open({
             target: elem,
             type: 'ajax',
             innerTpl: 'tpl/ajaxHtmlTpl.html'
             });
             break;
             case 'list ng-scope':
             $popupWindow.open({
             target: elem,
             type: 'image',
             pushState: true,
             source: 'data-src',
             beforeContentLoaded: function (eventName, win, sectors) {
             win.requestParam = {
             title: "Заголовок был сменен в событии beforeContentLoaded"
             };
             }
             });
             break;
             case 'ajaxlist ng-scope':
             $popupWindow.open({
             target: elem,
             type: 'ajax',
             href: 'test.php',
             pushState: true,
             requestParam: {
             id: elem.getAttribute('img')
             },
             beforePagination: function (eventName, win, sectors, elem) {
             win.requestParam = {
             id: elem.target[0].getAttribute('img')
             };
             }
             });
             break;
             default:
             $popupWindow.open({
             target: elem
             });
             }*/
        };

        var el = $document[0].querySelector('.no-elem');
        angular.element(el).on('click', function() {
            $popupWindow.open({
                type: 'inline',
                href: 'tpl/test.html',
                innerTpl: 'tpl/inlineTpl.html',
                requestParam: {
                    title: "Без элемента"
                }
            });
        });
    }]);