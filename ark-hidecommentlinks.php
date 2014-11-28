<?php
/**
Plugin Name: ark-hidecommentlinks
Author: Александр Каратаев
Plugin URI: http://blog.ddw.kz/zakryt-ssylki-v-kommentariyax-wordpress.html
Description: Плагин закрывает ссылки на сайты комментаторов, оставляя возможность перехода на эти сайты
Version: 1.0
Author URI: http://blog.ddw.kz
License: GPL2
*/
?>
<?php
/*  Copyright 2014  Александр Каратаев  (email : ddw2@yandex.ru)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License, version 2, as 
    published by the Free Software Foundation.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/
?>
<?php
// Функции плагина
// Стили
function set_style_hidecommentlinks() {
    // Регистрация стилей для плагина:
    wp_register_style( 'ark-hidecommentlinks', plugins_url( '/css/ark-hidecommentlinks.css', __FILE__ ), array(), '20131003', 'all' );
    wp_enqueue_style( 'ark-hidecommentlinks' );
}
add_action( 'wp_enqueue_scripts', 'set_style_hidecommentlinks' );
// Скрипты
function set_script_hidecommentlinks() {
    // Регистрация скриптов для плагина:
    wp_register_script( 'ark-hidecommentlinks', plugins_url( '/js/ark-hidecommentlinks.js', __FILE__ ), array(), '20131003', 'all' );
    wp_enqueue_script( 'ark-hidecommentlinks' );
    wp_register_script( 'pcl_tooltip', plugins_url( '/js/pcl_tooltip.js', __FILE__ ), array(), '20131003', 'all' );
    wp_enqueue_script( 'pcl_tooltip' );	
    wp_register_script( 'pcl_tooltip_init', plugins_url( '/js/pcl_tooltip_init.js', __FILE__ ), array(), '20131003', true );
    wp_enqueue_script( 'pcl_tooltip_init' );		
}
add_action( 'wp_enqueue_scripts', 'set_script_hidecommentlinks' );

/* ==========================================================================
 * Функция закрытия ссылки комментатора через JS
 * Параметр $link - html-код ссылки комментатора
 * ========================================================================== */
function ark_comment_author_link( $link ){
    $link = str_replace( // вызываем функцию замены в строке
        array('<a', '</a>', 'href=','http://','external nofollow','rel=',"''"), // что заменяем
        array('<span class="arklink" onclick="arkrun(this)"', '</span>', 'title=', '', '', '',''), // на что заменяем
        $link // в строке с html-кодом ссылки
    );
    return $link; // возвращаем новую ссылку после замены
}
// подключаем фильтр
add_filter( "get_comment_author_link", "ark_comment_author_link" );
/* ========================================================================== */
?>