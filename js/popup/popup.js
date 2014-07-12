/**
 * Created by netBeans.
 * Name: popupWindow
 * User: Abaddon
 * Date: 29.04.14
 * Time: 17:15
 * Description: Open popup window
 */
(function(an, w, d) {
    "use strict";
    var anWin = an.module('angularWindow', []);
    anWin.value("$sectors", {});
    anWin.directive("ngWindowSectors", ['$sectors', function($sectors) {
            return function(scope, elem, attr) {
                var name = attr.ngWindowSectors;
                $sectors[name] = elem;
            };
        }]);
    anWin.directive("ngWindowPlace", ['$rootScope', '$angularWindow', function($rootScope, $angularWindow) {
            return {
                scope: {},
                template: '<div id="window-wrap" ng-show="show"></div><div ng-show="show" id="wrap-inner" ng-style="{width:inner.width + \'px\', height:inner.height + \'px\', padding:inner.padding}">' +
                        '<div id="wrap-block" ng-window-sectors="wrap" class="win-close" ng-hide="fullscreen" ng-style="{width: content.width + \'px\', padding: content.padding + \'px\'}">' +
                        '</div>' +
                        '</div><div ng-window-sectors="fullScreen" ng-show="fullscreen"></div>',
                link: function(scope, elem, attr) {
                    $angularWindow.sharing(scope);
                }
            };
        }]);
    anWin.factory('$angularWindow', ['$rootScope', '$templateCache', '$sectors', '$q', '$http', '$compile', '$timeout', function(
                $rootScope, $templateCache, $sectors, $q, $http, $compile, $timeout) {
            var scope, config, interval, currIndex = 0, delay, defer = $q.defer(), that;
            var AngularWindow = function(options) {
                if (!(this instanceof AngularWindow)) {
                    return new AngularWindow(options);
                }
                this.config = {};
                var configDefer = $q.defer(), waitingDefer = $q.defer();
                that = this;
                //Ждем получения скопа из директивы
                defer.promise.then(function(sc) {
                    scope = sc;
                    config = an.extend(that.config, {
                        timestamp: Date.now(),
                        target: [],
                        margin: 10,
                        padding: 10,
                        effect: 1,
                        outPadding: 150,
                        startIndex: 0,
                        resize: true,
                        resizeDelay: 20,
                        paginate: 1,
                        infPaginate: true,
                        ready: false,
                        pathAttr: 'src',
                        tplMark: options.tpl.replace(/[\/,\.]/g, '__'),
                        myParams: {},
                        maxSizes: {
                            width: 1024,
                            height: 768
                        },
                        minSizes: {
                            width: 640,
                            height: 480
                        }
                    }, options);
                    that.targetCount = config.target.length;
                    if (that.targetCount === 1) {
                        config.paginate = 0;
                    }
                    return config;
                }).then(function(config) {
                    this.bind = function(event, handler) {//Биндим событие
                        scope.$on(config.timestamp + ':' + event, handler.bind(this));
                    };
                    this.trigger = function(event, params) {//Запускаем событие
                        arguments[0] = config.timestamp + ':' + event;
                        scope.$broadcast.apply(scope, arguments);
                    };
                    this.goOn = function() {
                        waitingDefer.resolve();
                    };
                    //Подгружаем шаблон
                    this._loadTpl(config.tpl).then(function() {
                        return that._resize();
                    }).then(function() {
                        return that._baseFunction();
                    }).then(function() {
                        configDefer.resolve({'instance': that, 'config': config, 'goOn': that.goOn, 'sectors': $sectors, 'scope': scope});
                    }).then(function() {
                        if (!that.targetCount) {
                            waitingDefer.promise.then(function() {
                                that.targetCount = config.target.length;
                                return that._open();
                            });
                        } else {
                            return that._open();
                        }
                    });
                }.bind(this));

                return configDefer.promise;
            };
            AngularWindow.prototype = {
                _open: function(index) {//Открытие окна
                    currIndex = (index === undefined) ? config.startIndex : index;
                    this._defVar();
                    an.extend(scope.param, config.myParams);
                    if (that.targetCount) {//Проверяем передана ли цель
                        var imgPath = config.target[currIndex][config.pathAttr];
                        an.extend(scope.param, config.target[currIndex]);
                        if (imgPath) {//Проверяем картинки ли это
                            this._prepareImgContent(imgPath);
                        } else {
                            this._prepareContent();
                        }
                    } else {//Тут обычное окно с контентом
                        this._prepareContent();
                    }
                },
                _navigate: function(type) {
                    var index, future;
                    switch (type) {
                        case 'prev':
                            future = currIndex - 1;
                            index = (future < 0) ? (that.targetCount - 1) : future;
                            break;
                        case 'next':
                            future = currIndex + 1;
                            index = (future === that.targetCount) ? 0 : future;
                            break;
                    }
                    ;
                    $sectors.wrap.removeClass("win-show").addClass("win-close");
                    $timeout(function() {
                        this.trigger("beforePagination", config, currIndex, index, $sectors);
                        this._open(index);
                    }.bind(this), 600);
                },
                _baseFunction: function() {//Стандартные ф-и доступные в шаблоне окна
                    scope.close = that.close = function() {
                        that.trigger("beforeClose", config, $sectors);
                        scope.show = false;
                        an.element(d.body).css('overflow', 'auto');
                        $sectors.wrap.removeClass("win-show").addClass("win-close");
                    };
                    scope.prev = that.prev = function() {
                        that._navigate('prev');
                    };
                    scope.next = that.next = function() {
                        that._navigate('next');
                    };
                },
                _resize: function() {
                    if (config.resize) {
                        an.element(w).off("resize");
                        an.element(w).on("resize", function() {
                            this._delay(this._winResize);
                        }.bind(this));
                    }
                    return true;
                },
                _delay: function(after) {
                    $timeout.cancel(delay);
                    delay = $timeout(function() {
                        after.call(this);
                    }.bind(this), config.resizeDelay);
                },
                _winResize: function() {
                    var newSize = this._winSize();
                    //Изменение размеров окна
                    scope.inner.width = newSize.pageWidth;
                    scope.inner.height = newSize.viewHeight;
                    if (config.resize) {
                        scope.content.width = newSize.wrap;
                        var imageSize = this._getImageSize(scope.param);
                        scope.param.width = imageSize[0];
                        scope.param.height = imageSize[1];
                        (imageSize[0] < config.minSizes.width) ? (scope.content.width = config.minSizes.width) : (scope.content.width = imageSize[0]);
                    }
                },
                _prepareImgContent: function(imgPath) {//подготавливает картинку к выводу
                    this._loadImg(imgPath).then(function(result) {
                        that.trigger("beforeOpen", config, result, $sectors);
                        an.extend(scope.param, result);
                        scope.show = true;
                    }).then(function() {
                        return that._openEffect();
                    }).then(function() {
                        return that._checkPag();
                    }).then(function() {
                        that.trigger("afterOpen", config, $sectors);
                    });
                },
                _prepareContent: function() {
                    var prepare = function() {
                        that.trigger("beforeOpen", config, $sectors);
                        scope.show = true;
                    };
                    $q.when(prepare()).then(function() {
                        return that._openEffect();
                    }).then(function() {
                        return that._checkPag();
                    }).then(function() {
                        that.trigger("afterOpen", this);
                    });
                },
                _openEffect: function() {
                    an.element(d.body).css('overflow', 'hidden');
                    return $timeout(function() {
                        $sectors.wrap.removeClass("win-close").addClass("win-show");
                    }, 100);
                },
                _checkPag: function() {
                    //Проверка надо ли показывать кнопки для пагинации
                    if (config.paginate && that.targetCount) {
                        var count = that.targetCount;
                        if (!config.infPaginate) {
                            if (count === 1) {
                                scope.nav = {prev: false, next: false};
                            } else if (currIndex === 0) {
                                scope.nav = {prev: false, next: true};
                            } else if (currIndex === count - 1) {
                                scope.nav = {prev: true, next: false};
                            } else {
                                scope.nav = {prev: true, next: true};
                            }
                        } else {
                            if (count === 1) {
                                scope.nav = {prev: false, next: false};
                            } else {
                                scope.nav = {prev: true, next: true};
                            }
                        }
                    }
                },
                _loadImg: function(path) {//подгружает картинку
                    var modalImageDeferred = $q.defer(), result = {},
                            img = new Image();
                    img.onload = function() {
                        an.extend(result, {
                            oric_height: img.height,
                            oric_width: img.width,
                            elem: img,
                            src: path,
                            ratio: img.width / img.height
                        });
                        var newSize = this._getImageSize(result);
                        result.width = newSize[0];
                        result.height = newSize[1];
                        //Даем добро на ресайз картинки
                        config.imgResize = true;
                        (newSize[0] < config.minSizes.width) ? (scope.content.width = config.minSizes.width) : (scope.content.width = newSize[0]);
                        modalImageDeferred.resolve(result);
                    }.bind(this);
                    img.onerror = function() {
                        modalImageDeferred.reject(this);
                    };
                    img.src = path;
                    return modalImageDeferred.promise;
                },
                _defVar: function() {//Установка дефолтовых переменных
                    var sizes = this._winSize();
                    an.extend(scope, {
                        content: {
                            width: sizes.wrap,
                            padding: config.padding
                        },
                        inner: {
                            width: sizes.pageWidth,
                            height: sizes.viewHeight,
                            padding: config.margin + 'px 0 ' + config.margin + 'px 0'
                        },
                        param: {}
                    });
                    //Эффект открытия
                    $sectors.wrap.addClass("win-effect-" + config.effect);
                },
                _loadTpl: function(tpl, name) {//загружает шаблон окна
                    if (!name) {
                        name = 'tpl';
                    }
                    var check = $sectors['wrap'][0].querySelector("[mark=" + config[name + 'Mark'] + "]");
                    if (check) {
                        return $q.when(function() {
                            return true;
                        });
                    } else {
                        return $http.get(tpl, {cache: $templateCache}).then(function(result) {
                            $sectors['wrap'].html(result.data);
                            var content = $sectors['wrap'].contents();
                            content[0].setAttribute('mark', config[name + 'Mark']);
                            $compile(content)(scope);
                            return result;
                        });
                    }
                },
                _winSize: function() {
                    var pageWidth = w.innerWidth, viewHeight = w.innerHeight, wrap, maxSizes;
                    wrap = pageWidth - 2 * config.outPadding;//Ширина области контента с учетов боковых отступов
                    if (scope.fullscreen) {
                        maxSizes = {width: pageWidth, height: viewHeight};
                    } else {
                        maxSizes = config.maxSizes;
                    }
                    if (config.resize) {
                        if (wrap < config.minSizes.width) {
                            wrap = config.minSizes.width;
                        } else if (wrap > maxSizes.width) {
                            wrap = maxSizes.width;
                        }
                    } else {
                        wrap = maxSizes.width;
                    }
                    return {
                        'pageWidth': pageWidth,
                        'viewHeight': viewHeight,
                        'wrap': wrap
                    };
                },
                _getImageSize: function(item) {
                    var wrapWidth = scope.content.width, winHeight = scope.inner.height - config.outPadding, result = [];
                    //Желаемые размеры картинки
                    var desiredWidth = wrapWidth, desiredHeight = winHeight - (config.margin * 2 + config.padding * 2);
                    //Проверка на минимальную высоту
                    if (desiredHeight < config.minSizes.height) {
                        desiredHeight = config.minSizes.height;
                    }

                    if ((item.oric_width / desiredWidth) > (item.oric_height / desiredHeight)) {
                        result[0] = desiredWidth;
                        result[1] = Math.round(item.oric_height * desiredWidth / item.oric_width);
                    } else {
                        result[0] = Math.round(item.oric_width * desiredHeight / item.oric_height);
                        result[1] = desiredHeight;
                    }
                    return result;
                }
            };

            return {
                open: function(options) {
                    return AngularWindow(options);
                },
                sharing: function(scope) {
                    defer.resolve(scope);
                }
            };
        }]);
})(angular, window, document);