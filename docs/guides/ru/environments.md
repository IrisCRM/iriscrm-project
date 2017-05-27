Окружения
=========

Как указать окружение для Apache
--------------------------------

Отредактируйте файл `/etc/apache2/envvars`:

```bash
sudo mcedit /etc/apache2/envvars
```

Добавьте строчку с названием окружения, например:
```
export IRIS_ENV=dev
```

Перезапустите Apache:
```bash
sudo service apache2 restart
```

После этого будет использоваться файл настроек `iriscrm/settings/settings-dev.xml`.

Как указать окружение для Nginx
-------------------------------

Отредактируйте файл с описанием хоста (например, `/etc/nginx/vhosts/iriscrm.conf`):

```bash
sudo mcedit /etc/nginx/vhosts/iriscrm.conf
```

В секции `location ~ \.php$` добавьте строчку с названием окружения, например:
```
location ~ \.php$ {
    fastcgi_param  IRIS_ENV dev;
}
```

Перезапустите Nginx:
```bash
sudo service nginx restart
```

После этого будет использоваться файл настроек `iriscrm/settings/settings-dev.xml`.

Как указать окружения для консольных команд
-------------------------------------------

Первый способ. Укажите окружение с помощью опции `--env`:
```bash
./iris --env=dev
```

Второй способ. Укажите окружение в файле `~/.profile`:
```
export IRIS_ENV=dev
```
