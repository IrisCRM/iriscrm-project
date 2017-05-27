Environments
============

How to specify environment for Apache
-------------------------------------

Edit `/etc/apache2/envvars` file:

```bash
sudo mcedit /etc/apache2/envvars
```

Add line with environment name, for example:
```
export IRIS_ENV=dev
```

Restart Apache:
```bash
sudo service apache2 restart
```

File `iriscrm/settings/settings-dev.xml` will be used.

How to specify environment for Nginx
-------------------------------------

Edit file with host description (for example, `/etc/nginx/vhosts/iriscrm.conf`):

```bash
sudo mcedit /etc/nginx/vhosts/iriscrm.conf
```

Add line with environment name into section `location ~ \.php$`:
```
location ~ \.php$ {
    fastcgi_param  IRIS_ENV dev;
}
```

Restart Nginx:
```bash
sudo service nginx restart
```

File `iriscrm/settings/settings-dev.xml` will be used.

How to specify environment for console
--------------------------------------

Way one. Specify environment with `--env` option:
```bash
./iris --env=dev
```

Way two. Specify environment in `~/.profile` file:
```
export IRIS_ENV=dev
```