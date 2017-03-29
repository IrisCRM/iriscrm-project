<?php
//ini_set('display_errors', 'on');

$iriscrmKernelPath = dirname(dirname(__FILE__)) . '/vendor/iriscrm/source-core/src/Iris/';

require_once $iriscrmKernelPath . 'core/engine/bootstrap.php';

use Iris\Iris;

$GLOBALS["g_loginform_function_name"] = 'showClientLoginForm'; // имя новой функции логина
$GLOBALS["g_wronglogin_message"] = 'Неверно указан Email или пароль'; // текст нового сообщения об ошибке

include Iris::$app->getCoreDir() . 'core/login/login.php'; // файл содержащий функцию логина
require Iris::$app->getCoreDir() . 'core/engine/index.php';
