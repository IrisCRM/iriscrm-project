# API

В Iris CRM предусмотрен механизм предоставления сервисов в виде API.
Методы API описываются в PHP скриптах конфигурации, в каждом разделе.

Запросы к API имеют следующий вид:  
`https://iriscrm.domain/api/<section>/<method>`

Например, запрос
`https://iriscrm.domain/api/Account/card`
приведет к вызову метода
`\MyCompany\Config\MyConfig\sections\api_Account::card()`.

Для методов с аннотацией `@ReauireAuth(false)` авторизация не требуется.
В противном случае требуется авторизация по токену, 
который должен быть передан в заголовке или в параметре `api-token` 
(название параметра настраивается в *settings.xml*).

```xml
<API>
  <TOKEN_PARAMETER>api-token</TOKEN_PARAMETER>
</API>
```

Управление токенами выполняется в разделе Администрирование&rarr;Пользовтели &mdash; 
генерация, удаление токена, установка срока действия.

Доступ по токену идентичен доступу пользователя, которому назначен токен.

У одного пользователя может быть несколько токенов. 
Один токен может быть назначен только одному пользователю.

Пример метода, обрабатывающего запрос к API по урлу 
`https://iriscrm.domain/api/Demo/testMethodWithoutAuth`

```php
<?php

namespace SomeClient\Config\ConfigName\sections\Demo;

use Config;
use Iris\Annotation\RequestMethod;
use Iris\Annotations\RequireAuth;

class api_Demo extends Config
{
    /**
     * @RequireAuth(false)
     * @RequestMethod({"get"})
     * @param \Symfony\Component\HttpFoundation\Request $request
     * @return array
     */
    public function testMethodWithoutAuth($request) {
        return [
            // POST parameter
            'param-value' => $request->get('param_test'),
            // JSON or XML request body
            'content' => $request->getContent(),
        ];
    }
}
```

Для методов обработки запросов к API возможно определять 
необходимость авторизации с помощью аннотации 
`@\Iris\Annotations\RequireAuth`.
Также можно ограничивать доступ запросам разных типов
с помощью аннотации `@\Iris\Annotation\RequestMethod`.

В случае, если необходимо подменить роутер, 
отвечающий за обработку запросов к API, 
переопределите используемый роутер в сервис провайдере.

```php
<?php

$this->container
    ->register('api.router', CustomApiRouter::class)
    ->addArgument(new Reference('http.request'))
    ->addArgument(new Reference('loader'));

```
