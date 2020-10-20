<?php
// https://www.collectiveray.com/add-javascript-to-wordpress
// https://stackoverflow.com/questions/58931144/enqueue-javascript-with-type-module     
// get_template_directory_uri()

add_action( 'wp_enqueue_scripts', 'my_theme_enqueue_styles' );
function my_theme_enqueue_styles() {
    wp_enqueue_style( 'child-style', get_stylesheet_uri(),
        array( 'parenthandle' ), 
        wp_get_theme()->get('Version') // this only works if you have Version in the style header
    );
}

function wpb_adding_scripts() {
   wp_enqueue_script( 'js-file', get_stylesheet_directory_uri()  . '/quizbot.js', 1.1, true);
}

// https://stackoverflow.com/questions/59423089/how-to-add-script-as-a-module-using-wp-enqueue-script-wordpress
function add_module_to_script( $tag, $handle, $src ) {
   if ( "js-file" === $handle ) {
      echo $src;
      $tag = '<script type="module" src="' . esc_url( $src ) . '"></script>';
   }
   return $tag;
 }

add_action( 'wp_enqueue_scripts', 'wpb_adding_scripts' ); 
add_filter( 'script_loader_tag', 'add_module_to_script', 10, 3 );


echo '<div class="quiz_bot" id="quiz_bot"></div>';






?>