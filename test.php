<?php
/**
 * Created by PhpStorm.
 * User: abaddon
 * Date: 03.05.14
 * Time: 15:56
 */
//if ($_POST['type']) { //<img src="' . $_POST['href'] . '" width="{{content.img.width}}" height="{{content.img.height}}" alt="" data-image-incontent />
//    $outer = '<div><img src="img/001.jpg" width="{{winpopup.content.width}}" height="{{winpopup.content.height}}" alt="" data-image-incontent />Nulla Nullam pellentesque feugiat turpis sit amet laoreet. Nulla tempus ipsum sed nisl mattis congue. Duis rhoncus tellus vel auctor rutrum. Nunc luctus arcu at cursus gravida. Sed condimentum elit eget neque elementum fringilla. Morbi facilisis
//Nullam pellentesque feugiat turpis sit amet laoreet. Nulla tempus ipsum sed nisl mattis congue. Duis rhoncus tellus vel auctor rutrum. Nunc luctus arcu at cursus gravida. Sed condimentum elit eget neque elementum fringilla. Morbi facilisis
//Nullam pellentesque feugiat turpis sit amet laoreet. Nulla tempus ipsum sed nisl mattis congue. Duis rhoncus tellus vel auctor rutrum. Nunc luctus arcu at cursus gravida. Sed condimentum elit eget neque elementum fringilla. Morbi facilisis
//Nullam pellentesque feugiat turpis sit amet laoreet. Nulla tempus ipsum sed nisl mattis congue. Duis rhoncus tellus vel auctor rutrum. Nunc luctus arcu at cursus gravida. Sed condimentum elit eget neque elementum fringilla. Morbi facilisis
//Nullam pellentesque feugiat turpis sit amet laoreet. Nulla tempus ipsum sed nisl mattis congue. Duis rhoncus tellus vel auctor rutrum. Nunc luctus arcu at cursus gravida. Sed condimentum elit eget neque elementum fringilla. Morbi facilisistempus ipsum sed nisl mattis congue. Duis rhoncus tellus vel auctor rutrum. Nunc luctus arcu at cursus gravida. Sed condimentum elit eget neque elementum fringilla.</div>';
//    echo $outer;
//} else {

    $outer = array(
        //'items' => array(array('name' => 'hellow'), array('name' => 'hellow2'), array('name' => 'hellow3'))
        'src' => "img/small-w.jpg",
        'id' => 1,
        'title' => 'Картинка из json №1',
        'description' => 'amet laoreet.<b></b> Nulla tempus ipsum sed nisl mattis congue. Dui'
    );
//echo $outer;

    echo json_encode($outer);
//}