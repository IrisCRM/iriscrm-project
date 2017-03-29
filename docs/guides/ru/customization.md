Настройка конфигурации
======================

Для того, чтобы внести изменения во внешний вид и структуру карточек, таблиц, 
изменить или добавить новую бизнес логику, необходимо следовать принципам,
описанным в этой инструкции.

Стандартная конфигурация Iris CRM определена в пространстве имен `Iris\Config\CRM`.
Придумайте название для вашего пространства имен, в котором будете выполнять настройки. 
Например, `MyCompany\Config\ConfigName`.

Создайте в каталоге `src` структуру каталогов согласно выбранному пространству имен.
Например, `src/MyCompany/Config/ConfigName`. Регистр важен.

Создайте файл `src/MyCompany/Config/ConfigName/version.xml`, 
укажите в нем название конфигурации, пример файла:

```
<?xml version="1.0"?>
<VERSION_INFO>
	<CONFIGURATION_NAME>CRM Configuration for my company</CONFIGURATION_NAME>
	<CURRENT_VERSION>1.0.0</CURRENT_VERSION>
</VERSION_INFO>
```

После этого зарегистрируйте вашу конфигурацию в системе. Для этого создайте файл
`src/hierarchy.php` и пропишите в нем порядок подключения конфигураций. 
Чем конфигурация выше в списке, тем больший приоритет она имеет. 
То есть первая конфигурация в списке - дочерняя.

```
<?php
return [
    [
        // Неймспейс, в котором описана конфигурация
        'namespace' => '\\MyCompany\\Config\\ConfigName',

        // Путь к файлам конфигурации относительно каталога проекта
        'directory' => 'src/MyCompany/Config/ConfigName/',

        // Используется для наименования объектов JavaScript
        'postfix' => '_MyCompany',
    ],
    [
        'namespace' => '\\Iris\\Config\\CRM',
        'directory' => 'vendor/iriscrm/config-crm/',
        'postfix' => '',
    ],
];
```

В этом списке конфигураций может быть несколько конфигураций. 
Например,
- настройки под конкретную компанию (наследуется от отраслевого решения),
- отраслевое решение (наследуется от стандартной),
- стандартная конфигурация CRM (родительская).

Переопределение карточек, таблиц
--------------------------------

Чтобы переопределить карточку или таблицу в разделе, необходимо скопировать xml файл 
с описанием раздела в каталог с вашей конфигурацией и внести необходимые правки.

Например, если необходимо изменить карточку компании, то скопируйте файл 
`vendor/iriscrm/config-crm/sections/Account/structure.xml` 
в каталог с вашей конфигурацией
`src/MyCompany/Config/ConfigName/sections/Account/structure.xml`.
И внесите необходимые изменения.

Переопределение серверной логики
--------------------------------

Для изменения поведения на сервере, создайте php-файл в соответствующем разделе.
Например, если необходимо дополнить обработчик `s_Account::onPrepare()`, 
создайте файл `src/MyCompany/Config/ConfigName/sections/Account/s_Account.php`
со следуюшим содержимым:

```
<?php

namespace SomeClient\Config\ConfigName\sections\Account;

use Iris\Config\CRM\sections\Account\s_Account as s_AccountBase;

/**
 * Серверная логика карточки компании
 */
class s_Account extends s_AccountBase
{
    function onPrepare($params)
    {
        // Обработчик родительского класса
        $result = parent::onPrepare($params);
        
        // Добавьте сюда новое поведение, напримр:
        // $result = FieldValueFormat('Description', 'Test description', null, $result);
        
        return $result;
    }
}
```

Переопределение логики на стороне браузера
------------------------------------------

Создайте js-файл в соответствующем разделе. Нпример, если необходимо дополнить
обработчик `c_Account::onOpen()`, создайте файл 
`src/MyCompany/Config/ConfigName/sections/Account/c_account.js` 
со следуюшим содержимым:

```
irisControllers.classes.c_Account_custom = irisControllers.classes.c_Account.extend({

    onOpen: function() {
        // Родительский обработчик
        irisControllers.classes.c_Account_custom.__super__.onOpen.call(this);
    
        // Дополнительное прведение, например:
        // alert('Новый функционал');
    }

});
```

Не забудьте после внесения изменений пересобрать проект с помощью Gulp.

Изменение формы входа в систему
-------------------------------

Создайте каталог `src/MyCompany/Config/ConfigName/login` и скопируйте в него
файлы `user-form.php` (форма логина для сотрудников) 
и `client-form.php` (форма логина в личный кабинет) из каталога 
`vendor/iriscrm/core-build/src/Iris/core/login`. Внесите необходимые изменения.

Если на страницах требуется подключение Javascript скриптов или css стилей, 
разместите их в каталогах `login/js` и `login/css` соответственно.

Не забудьте после внесения изменений пересобрать проект с помощью Gulp.

Добавление переводов
--------------------

Переводы подключаются из каталога `language` вашей конфигурации
и объединяются с системными переводами. Чтобы добавить новые переводы 
или изменить имеющиеся для английского языка, добавьте файл `language/en/en.php` 
следующего содержания: 

```
<?php

use Iris\Iris;

$translations = require Iris::$app->getRootDir() . 'src/Iris/Config/CRM/language/en/en.php';

return array_replace_recursive($translations, [
	'common' => [
		'Телефон 1' => 'Phone 1 customized',
	],
]);
```

Регистрация новых сервисов в сервис-провайдере
----------------------------------------------

Добавьте в каталог конфигурации файл `ServicePrvider.php`
со следующим содержимым

```
<?php

namespace SomeClient\Config\ConfigName;

class ServiceProvider extends \Iris\ServiceProvider
{
    public function register()
    {
        parent::register();
        
        // Добавьте новые сервисы
    }
}
```