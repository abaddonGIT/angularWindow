/**
 * Created by netBeans.
 * Name: popupWindow
 * User: Abaddon
 * Date: 29.04.14
 * Time: 17:15
 * Description: Open popup window
 */
(function (an, w, d) {
    "use strict";
    var anWin = an.module('angularWindow', []);
    anWin.value("$sectors", {});
    anWin.directive("ngWindowSectors", ['$sectors', function ($sectors) {
        return function (scope, elem, attr) {
            var name = attr.ngWindowSectors;
            $sectors[name] = elem;
        };
    }]);
    anWin.factory('$angularWindow', ['$rootScope', '$templateCache', '$sectors', '$q', '$http', '$compile', '$timeout', '$document', function ($rootScope, $templateCache, $sectors, $q, $http, $compile, $timeout, $document) {
        var AngularWindow = function (options) {
            if (!(this instanceof AngularWindow)) {
                return new AngularWindow(options);
            }
            var that = this, config, scope, body = $document.find('body').eq(0), currIndex, delay, winElement;
            this.config = {};
            an.extend(this, {
                timestamp: Date.now(),
                scope: null,
                defer: $q.defer(),
                result: $q.defer()
            });
            this.scope = scope = (options.scope || $rootScope).$new();
            config = an.extend(that.config, {
                target: [],
                margin: 10,
                padding: 10,
                effect: 1,
                outPadding: 150,
                startIndex: 0,
                preloderHTML: "<div class='halo1'></div><div class='halo2'></div>",
                resize: true,
                resizeDelay: 20,
                paginate: 1,
                infPaginate: true,
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
            this.targetCount = config.target.length;
            if (this.targetCount === 1) {
                config.paginate = 0;
            }
            this._createElem = function () {/*создаем элемент окна*/
                var add = function () {
                    winElement = an.element('<div class="window">' +
                        '<div id="window-wrap" ng-show="fixedShow"><div ng-window-sectors="fixedplace" ng-show="preloader"></div></div>' +
                        '<div ng-show="show" id="wrap-inner" ng-style="{width:inner.width + \'px\', height:inner.height + \'px\', padding:inner.padding}">' +
                        '<div id="wrap-block" ng-window-sectors="wrap" class="win-close" ng-hide="fullscreen" ng-style="{width: content.width + \'px\', padding: content.padding + \'px\'}">' +
                        '</div>' +
                        '</div>' +
                        '<div ng-window-sectors="fullScreen" ng-show="fullscreen"></div>' +
                        '</div>');
                    var domWinElem = $compile(winElement)(scope);
                    body.append(domWinElem);
                };
                return $q.when(add());
            };
            this._loadTpl = function (tpl, name) {/*загружает шаблон окна*/
                this._setPreloader();
                if (!name) {
                    name = 'tpl';
                }
                var check = $sectors['wrap'][0].querySelector("[mark=" + config[name + 'Mark'] + "]");
                if (check) {
                    return $q.when(function () {
                        return true;
                    });
                } else {
                    return $http.get(tpl, {'cache': $templateCache}).then(function (result) {
                        $sectors['wrap'].html(result.data);
                        var content = $sectors['wrap'].contents();
                        content[0].setAttribute('mark', config[name + 'Mark']);
                        $compile(content)(scope);
                        return result;
                    });
                }
            };
            this._setPreloader = function () {
                var place = $sectors['fixedplace'];
                if (config.preloderHTML) {
                    $sectors['fixedplace'].html(config.preloderHTML);
                }
            },
                this._baseFunction = function () {/*Стандартные ф-и доступные в шаблоне окна*/
                    scope.close = that.close = function () {
                        that.trigger("beforeClose", config, $sectors);
                        $sectors.wrap.removeClass("win-show").addClass("win-close");
                        $timeout(function () {
                            scope.show = scope.fixedShow = false;
                            an.element(d.body).css('overflow', 'auto');
                            w.removeEventListener("resize", that._changeSize, false);
                        }, 600).then(function () {
                            $timeout(function () {
                                scope.$destroy();
                                winElement.remove();
                                winElement = null;
                                that = null;
                            }, 0);
                        });
                    };
                    that.update = function (src) {
                        config.target[currIndex][config.pathAttr] = src;
                        that._open();
                    };
                    scope.prev = function () {
                        that._navigate('prev');
                    };
                    scope.next = function () {
                        that._navigate('next');
                    };
                    scope.fixedShow = scope.preloader = true;
                };
            this._open = function (index) {/*Открытие окна*/
                currIndex = (index === undefined) ? config.startIndex : index;
                this._defVar();
                an.extend(scope.param, {'count': that.targetCount, 'index': currIndex + 1}, config.myParams);
                if (that.targetCount) {/*Проверяем передана ли цель*/
                    var imgPath = config.target[currIndex][config.pathAttr];
                    an.extend(scope.param, config.target[currIndex]);
                    if (imgPath) {/*Проверяем картинки ли это*/
                        this._prepareImgContent(imgPath);
                    } else {
                        this._prepareContent();
                    }
                } else {/*Тут обычное окно с контентом*/
                    this._prepareContent();
                }
            };
            this._navigate = function (type) {
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
                scope.preloader = true;
                $sectors.wrap.removeClass("win-show").addClass("win-close");
                $timeout(function () {
                    this.trigger("beforePagination", config, currIndex, index, $sectors);
                    this._open(index);
                }.bind(this), 600);
            };
            this._changeSize = function () {
                that._delay(that._winResize);
            };
            this._resize = function () {
                w.addEventListener("resize", that._changeSize, false);
                return true;
            };
            this._delay = function (after) {
                $timeout.cancel(delay);
                delay = $timeout(function () {
                    after.call(this);
                }.bind(this), config.resizeDelay);
            };
            this._winResize = function () {
                var newSize = this._winSize();
                scope.inner.width = newSize.pageWidth;
                scope.inner.height = newSize.viewHeight;
                if (config.resize) {
                    scope.content.width = newSize.wrap;
                    if (!that.noImage) {
                        var imageSize = this._getImageSize(scope.param);
                        scope.param.width = imageSize[0];
                        scope.param.height = imageSize[1];
                        (imageSize[0] < config.minSizes.width) ? (scope.content.width = config.minSizes.width) : (scope.content.width = imageSize[0]);
                    }
                }
            };
            this._prepareImgContent = function (imgPath) {/*подготавливает картинку к выводу*/
                that.noImage = false;
                this._loadImg(imgPath).then(function (result) {
                    that.trigger("beforeOpen", config, result, $sectors);
                    an.extend(scope.param, result);
                    scope.show = true;
                }).then(function () {
                    return that._openEffect();
                }).then(function () {
                    return that._checkPag();
                }).then(function () {
                    that.trigger("afterOpen", config, $sectors);
                });
            };
            this._prepareContent = function () {
                that.noImage = true;
                var prepare = function () {
                    scope.show = true;
                };
                $q.when(prepare()).then(function () {
                    that.trigger("beforeOpen", config, $sectors);
                    return that._openEffect();
                }).then(function () {
                    return that._checkPag();
                }).then(function () {
                    that.trigger("afterOpen", this);
                });
            };
            this._openEffect = function () {
                an.element(d.body).css('overflow', 'hidden');
                return $timeout(function () {
                    $sectors.wrap.removeClass("win-close").addClass("win-show");
                    scope.preloader = false;
                }, 100);
            };
            this._checkPag = function () {
                /*Проверка надо ли показывать кнопки для пагинации*/
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
            };
            this._loadImg = function (path) {/*подгружает картинку*/
                var modalImageDeferred = $q.defer(), result = {},
                    img = new Image();
                img.onload = function () {
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
                    config.imgResize = true;
                    (newSize[0] < config.minSizes.width) ? (scope.content.width = config.minSizes.width) : (scope.content.width = newSize[0]);
                    modalImageDeferred.resolve(result);
                    img = null;
                }.bind(this);
                img.onerror = function () {
                    modalImageDeferred.reject(this);
                };
                img.src = path;
                return modalImageDeferred.promise;
            };
            this._defVar = function () {/*Установка дефолтовых переменных*/
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
                $sectors.wrap.addClass("win-effect-" + config.effect);
            };
            this._winSize = function () {
                var pageWidth = w.innerWidth, viewHeight = w.innerHeight, wrap, maxSizes;
                wrap = pageWidth - 2 * config.outPadding;
                /*Ширина области контента с учетов боковых отступов*/
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
            };
            this._getImageSize = function (item) {
                var wrapWidth = scope.content.width, winHeight = scope.inner.height - config.outPadding, result = [];
                //Желаемые размеры картинки
                var desiredWidth = wrapWidth, desiredHeight = winHeight - (config.margin * 2 + config.padding * 2);
                if (item.oric_height <= config.minSizes.height) {//Если высота картинки меньше минимальной, то не ресайзим окно
                    desiredHeight = item.oric_height;
                } else {//Проверка на минимальную высоту
                    if (desiredHeight < config.minSizes.height) {
                        desiredHeight = config.minSizes.height;
                    }
                }
                if ((item.oric_width / desiredWidth) > (item.oric_height / desiredHeight)) {
                    result[0] = desiredWidth;
                    result[1] = Math.round(item.oric_height * desiredWidth / item.oric_width);
                } else {
                    result[0] = Math.round(item.oric_width * desiredHeight / item.oric_height);
                    result[1] = desiredHeight;
                }
                return result;
            };
            this._createElem()/*Добавляем место под окно*/
                .then(this._loadTpl(config.tpl))/*подгрузка шаблона для окна*/
                .then(function () {
                    return that._resize();
                })
                .then(this._baseFunction())/*Регистрируем основные ф-и окна*/
                .then(function () {
                    that.defer.resolve({'instance': that, 'config': config, 'goOn': function () {
                        that.result.resolve();
                    }, 'sectors': $sectors, 'scope': scope});
                })
                .then(function () {
                    if (!that.targetCount) {
                        that.result.promise.then(function () {
                            that.targetCount = config.target.length;
                            return that._open();
                        });
                    } else {
                        return that._open();
                    }
                });

            return this.defer.promise;
        };
        AngularWindow.prototype = {
            bind: function (event, handler) {/*Биндим событие*/
                this.scope.$on(this.timestamp + ':' + event, handler.bind(this));
            },
            trigger: function (event, params) {/*Запускаем событие*/
                arguments[0] = this.timestamp + ':' + event;
                this.scope.$broadcast.apply(this.scope, arguments);
            }
        };
        return {
            open: function (options) {
                return AngularWindow(options);
            }
        };
    }]);
})(angular, window, document);