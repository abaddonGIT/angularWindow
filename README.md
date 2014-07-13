angularWindow
=============
Модальное окно на angularjs (IE9 и выше, Opera, Firefox, Chrome, Safary).
<b><a href="http://angular.demosite.pro/newwin/" target="_blank">Демка</b></a>
<ol>
    <li>
        <h3>Установка:</h3>
        <pre>var app = angular.module('app', ['angularWindow']);</pre>
    </li>
    <li>
        <h3>В шаблоне:</h3>
        В html шаблон необходимо поместить элемент, в который будет подгруженно окно
        <pre>
//Вызывается один раз на странице
&lt;div ng-window-place &gt;&lt;/div&gt;
</pre>
        Пример вызова
<pre>
&lt;a ng-click="open($event)"&gt;Открыть окно просмотра&lt;/a&gt;
</pre>
    </li>
    <li>
        <h3>В контроллере:</h3>
        <pre>
app.controller("baseController", ['$scope', '$angularWindow', function ($scope, $angularWindow) {
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
    };
}]);
</pre>
        Для открытия окна используется ф-я <b>open</b>. Параметры вызова:
        <ul>
            <li>
                <b>target</b> - массив объектов для вывода в окне;
                <pre>
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
    }
]
</pre>
Если параметр не передан, то окно будет ожидать, пока <b>target</b> не будет задан, или пока пользователь сам не даст команду на открытие.
<pre>
$scope.openFree = function() {
    $angularWindow.open({
        controllerScope: $scope,
        tpl: "tpl/defInnerTpl.html"
    }).then(function(obj) {
        $http({'url': 'test.php', 'method': 'post'}).success(function(data) {
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
</pre>
            </li>
            <li><b>pathAttr</b> - имя аттрибута, в котором передан адрес изображения;</li>
            <li><b>resizeDelay</b> - задержка между пересчетами размера окна (по умолчанию 20);</li>
            <li><b>resize</b> - нужен ли резайз окна в зависимости от разрешения монитора (true - default, false);</li>
            <li><b>padding</b> - внутренний отступ (15px - default);</li>
            <li><b>margin</b> - отступ от верхнего края монитора;</li>
            <li><b>outPadding</b> - отступы справа и слева от контента окна до границ монитора, при котором начинается ресайз;</li>
            <li><b>tpl</b> - шаблон внутренней части окна;</li>
            <li>
                <b>maxSizes</b> - максимальные размеры окна ({
                                width: 1024,
                                height: 768
                                } - default. Если параметр resize - false, то по этим размерам строится окно);
            </li>
            <li>
                <b>minSizes</b> - {
                                width: 640,
                                height: 480
                                } - минимальные размеры окна;
            </li>
            <li><b>startIndex</b> - номер стартовой позиции при открытии;</li>
            <li><b>infPaginate</b> - если true, то пагинация будет идти по кругу;</li>
            <li><b>paginate</b> - Показывать кнопки пагинации;</li>
            <li><b>effect</b> - Эффект открытия окна (так же распостраняется и на пагинацию. От 1 до 5);</li>
            <li><b>myParams</b> - Пробрасывает параметры в scope окна;</li>
        </ul>
    </li>
    <li>
        <h3>Пример шаблона внутренней части окна:</h3>
        <pre>
&lt;div id="content"&gt;
   &lt;div ng-sector="header"&gt;
        &lt;h1&gt;{{param.title}}&lt;/h1&gt;
        &lt;a ng-click="close()"&gt;Закрыть&lt;/a&gt;
        &lt;a class="nav-prev" ng-show="nav.prev" ng-click="prev()"&gt;Назад&lt;/a&gt;
        &lt;a class="nav-next" ng-show="nav.next" ng-click="next()"&gt;Вперед&lt;/a&gt;
    &lt;/div&gt;
    &lt;div ng-sectors="content"&gt;
       &lt;img src="{{param.src}}" width="{{param.width}}" height="{{param.height}}" alt="" /&gt;
    &lt;/div&gt;
    &lt;div ng-sectors="footer"&gt;
        {{param.index}} - {{param.count}}
    &lt;/div&gt;
&lt;/div&gt;
</pre>
Стандартные методы окна доступные в его шаблонах
    <ul>
        <li>
            <b>prev</b> - следующий слайд;
        </li>
        <li>
            <b>next</b> - предыдущий слайд;
        </li>
        <li>
            <b>close</b> - закрывает окно;
        </li>
    </ul>
    Вы так же можете создавать свои ф-и и вешать их на элементы окна. Выглядеть это будет примерно так
    <pre>
$angularWindow.open({
    target: $scope.images,
    controllerScope: $scope,
    pathAttr: 'src',
    tpl: "tpl/defInnerTpl.html"
}).then(function(obj) {
    obj.scope.testFunction = function () {
        console.log("Я буду работать внутри окна")
    };
});
</pre>
    Список стандартных переменных:
        <ul>
            <li><b>nav.prev</b> - показывает, есть ли предыдущий элемент;</li>
            <li><b>nav.next</b> - показывает, есть ли следующий элемент;</li>
            <li><b>param.index</b> - порядковый номер текущего эемента в наборе;</li>
            <li><b>param.count</b> - общее кол-во элементов в наборе;</li>
            <li><b>param.width</b> - ширина картинки;</li>
            <li><b>param.height</b> - высота картинки;</li>
            <li><b>param</b> - сюда попадают все остальные переменные переданные в через параметер <b>myParams</b>, а так же переменные связанные с окном.</li>
        </ul>
    </li>
    <li>
        <h3>Сектора шаблона</h3>
        Шаблон окна можно разделить на сектора, которые будут сохраняться и будут доступны для работы. Окно разбивается на сектора при помощи директивы
        ngWindowSectors.
    </li>
    <li>
        <h3>События:</h3>
        <ul>
            <li><b>beforePagination</b></li>
            <li><b>beforeClose</b></li>
            <li><b>beforeOpen</b></li>
            <li><b>afterOpen</b></li>
        </ul>
    </li>
</ol>
<hr />
angularWindow
=============
Modal window on angularjs (IE9 и выше, Opera, Firefox, Chrome, Safary).
<b><a href="http://angular.demosite.pro/newwin/" target="_blank">Demo</b></a>
<ol>
    <li>
        <h3>Installation:</h3>
        <pre>var app = angular.module('app', ['angularWindow']);</pre>
    </li>
    <li>
        <h3>In template:</h3>
        <pre>
////Is called once on page
&lt;div ng-window-place &gt;&lt;/div&gt;
</pre>
Example
<pre>
&lt;a ng-click="open($event)"&gt;Open window&lt;/a&gt;
</pre>
    </li>
    <li>
        <h3>In conroller:</h3>
        <pre>
app.controller("baseController", ['$scope', '$angularWindow', function ($scope, $angularWindow) {
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
    };
}]);
</pre>
        Parameters:
        <ul>
            <li>
                <b>target</b> - the array of objects for a conclusion in a window;
                <pre>
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
    }
]
</pre>
If parameter isn't transferred, the window will expect while by <b>target</b> it won't be set or while the user himself won't give command on opening.
<pre>
$scope.openFree = function() {
    $angularWindow.open({
        controllerScope: $scope,
        tpl: "tpl/defInnerTpl.html"
    }).then(function(obj) {
        $http({'url': 'test.php', 'method': 'post'}).success(function(data) {
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
</pre>
            </li>
            <li><b>pathAttr</b> - имя аттрибута, в котором передан адрес изображения;</li>
            <li><b>resizeDelay</b> - delay before re-calculations of window size (by default 20);</li>
            <li><b>resize</b> - indicates if resize of window is needed in depend on display resolution(true - default, false);</li>
            <li><b>padding</b> - padding (15px - default);</li>
            <li><b>margin</b> -  margin from top of display;</li>
            <li><b>outPadding</b> - left and right margins from content to display bounds in which resize is occured;</li>
            <li><b>tpl</b> - template of inner part of window;</li>
            <li>
                <b>maxSizes</b> - maximum size of window ({ width: 1024, height: 768 } - default. If parameter resize is false, then window is displayed according to these sizes);
            </li>
            <li>
                <b>minSizes</b> - { width: 640, height: 480 } - minimum size of window;
            </li>
            <li><b>startIndex</b> - Starting index;</li>
            <li><b>infPaginate</b> - if is true, that the pagination will revolve;</li>
            <li><b>paginate</b> - show pagination buttons;</li>
            <li><b>effect</b> - open effect (1 - 5);</li>
            <li><b>myParams</b> - transfer parameters to window scope;</li>
        </ul>
    </li>
    <li>
        <h3>Window template example:</h3>
        <pre>
&lt;div id="content"&gt;
   &lt;div ng-sector="header"&gt;
        &lt;h1&gt;{{param.title}}&lt;/h1&gt;
        &lt;a ng-click="close()"&gt;Закрыть&lt;/a&gt;
        &lt;a class="nav-prev" ng-show="nav.prev" ng-click="prev()"&gt;Prev&lt;/a&gt;
        &lt;a class="nav-next" ng-show="nav.next" ng-click="next()"&gt;Next&lt;/a&gt;
    &lt;/div&gt;
    &lt;div ng-sectors="content"&gt;
       &lt;img src="{{param.src}}" width="{{param.width}}" height="{{param.height}}" alt="" /&gt;
    &lt;/div&gt;
    &lt;div ng-sectors="footer"&gt;
        {{param.index}} - {{param.count}}
    &lt;/div&gt;
&lt;/div&gt;
</pre>
Standart function which used to window template
    <ul>
        <li>
            <b>prev</b> - next slide;
        </li>
        <li>
            <b>next</b> - prev slide;
        </li>
        <li>
            <b>close</b> - close window;
        </li>
    </ul>
    You also can create your own functions and call them in window template. It is implemented like this:
    <pre>
$angularWindow.open({
    target: $scope.images,
    controllerScope: $scope,
    pathAttr: 'src',
    tpl: "tpl/defInnerTpl.html"
}).then(function(obj) {
    obj.scope.testFunction = function () {
        console.log("I work into to window")
    };
});
</pre>
    List of standard variables:
        <ul>
            <li><b>nav.prev</b> - is TRUE when previous element is exist;</li>
            <li><b>nav.next</b> - is TRUE when next element is exist;</li>
            <li><b>param.index</b> - index of element in set;</li>
            <li><b>param.count</b> - count of elements in set</li>
            <li><b>param.width</b> - image width;</li>
            <li><b>param.height</b> - image height;</li>
            <li><b>param</b> - variables received by window.</li>
        </ul>
    </li>
    <li>
        <h3>Template sectors</h3>
        The template of a window can be divided into sectors which will remain and will be available to work. The window breaks into sectors by means of the directive
        ngWindowSectors.
    </li>
    <li>
        <h3>Events:</h3>
        <ul>
            <li><b>beforePagination</b></li>
            <li><b>beforeClose</b></li>
            <li><b>beforeOpen</b></li>
            <li><b>afterOpen</b></li>
        </ul>
    </li>
</ol>