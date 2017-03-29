Логгер
======

Пример использования

```php
use Iris\Iris;

$loggerFactory = Iris::$app->getContainer()->get('LoggerFactory'); 

// Создаем логгер, который будет писать сообщения в log/test.log
/** @var \Psr\Log\LoggerInterface $logger */
$logger = $loggerFactory->get('test'); 

// Пишем сообщение в лог
$logger->info('ok'); 
```