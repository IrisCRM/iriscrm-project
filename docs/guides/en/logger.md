Logger
======

Example of usage

```php
use Iris\Iris;

$loggerFactory = Iris::$app->getContainer()->get('LoggerFactory'); 

// Log into log/test.log
/** @var \Psr\Log\LoggerInterface $logger */
$logger = $loggerFactory->get('test'); 

// Log message
$logger->info('ok'); 
```