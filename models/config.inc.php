<?php
// PATHS
define('PATH_CHARACTERS', 'gfx/characters/');
define('PATH_OBJECTS', 'gfx/objects/');
define('PATH_TILES', 'gfx/tiles/');

// DATABASE
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_TABLE', 'roleplayit');

// LONG POLLING AJAX
define('POLLING_INTERVAL', 500000); // 0.5 seconds
define('MAX_EXEC_TIME', ini_get('max_execution_time')-1 );

// MISC
mb_internal_encoding('UTF-8');
mb_http_output('UTF-8');
mb_http_input('UTF-8');
mb_language('uni');
mb_regex_encoding('UTF-8');
