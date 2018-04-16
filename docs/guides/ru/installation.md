Установка
=========

1.  Установите [ionCube Loader](http://iris-crm.ru/install-php-under-linux).

1.  Сделайте форк проекта-шаблона https://github.com/IrisCRM/iriscrm-project 
    или скачайте проект в виде zip-архива.

1.  После распаковки скаченного архива настройте корневой каталог 
    для веб сервера: `public`.
    
    Пример для Apache:
    ```
    <VirtualHost *:80>
            ServerName iriscrm.local
    
            ServerAdmin admin@example.com
            DocumentRoot /var/www/iriscrm/public/
            <Directory /var/www/iriscrm/public/>
                    Options Indexes FollowSymLinks
                    AllowOverride All
                    Require all granted
            </Directory>
    
            ErrorLog ${APACHE_LOG_DIR}/error.log
            CustomLog ${APACHE_LOG_DIR}/access.log combined
    </VirtualHost>
    ```

    Пример для Nginx:
    ```
    server {
        listen 80;
    
        server_name iris5.local;
        root /var/www/iriscrm/public/;
        index index.php index.html index.htm;
    
        client_max_body_size 2g;
        access_log /var/log/nginx/iriscrm_access.log;
        error_log /var/log/nginx/iriscrm_error.log;
    
      location / {
        try_files $uri $uri/ /index.php?$args;
      }
    
      location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php7.0-fpm.sock;
        fastcgi_read_timeout 300;
      }
    }
    ```

1.  Создайте пустую базу данных в PostgreSQL.

1.  Скопируйте файл настроек `admin/settings/settings.xml.template` 
    в `admin/settings/settings.xml`:
    ```
    cp admin/settings/settings.xml.template admin/settings/settings.xml
    ```
    и внесите необходимые изменения - параметры соединения с БД.

1.  Установите необходимые пакеты через composer:
    ```
    composer install
    ```

1.  Установите необходимые пакеты для сборки проекта с помощью npm:
    ```
    npm install
    ```
    
1.  Выполните сборку проекта:
    ```
    npm run build:prod
    ```

1.  Выполните миграции:
    ```
    ./iris migrations:migrate
    ```
    
1.  Закажите лицензии на странице http://<iris crm>/license/request.html.