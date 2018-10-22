FROM php:7.0-fpm

RUN apt-get update && apt-get install -y \
        libjpeg62-turbo-dev \
        libmcrypt-dev \
        libxpm-dev \
        libvpx-dev \
        libpq-dev \
        libpng-dev \
        libjpeg-dev \
        libjpeg-progs \
        libjpeg62 \
        libfftw3-3 \
        libfftw3-dev \
        libwmf-dev \
        libx11-dev \
        libxt-dev \
        libxext-dev \
        libxml2-dev \
        libfreetype6-dev \
        libltdl3-dev \
        graphviz \
        pkg-config \
        libperl-dev \
        perl \
        libz-dev \
        libbz2-dev \
        libmemcached-dev \
        zlib1g-dev \
        libicu-dev \
        g++ \
        libc-client-dev \
        libkrb5-dev \
        supervisor \
        cron \
        mc \
        htop \
    && docker-php-ext-install -j$(nproc) mcrypt \
    && docker-php-ext-install -j$(nproc) intl \
    && docker-php-ext-install -j$(nproc) zip \
    && docker-php-ext-install -j$(nproc) pgsql \
    && docker-php-ext-install -j$(nproc) pdo_pgsql \
    && docker-php-ext-install -j$(nproc) exif \
    && docker-php-ext-configure gd \
        --with-freetype-dir=/usr/lib/ \
        --with-png-dir=/usr/lib/ \
        --with-jpeg-dir=/usr/lib/ \
        --with-gd \
    && docker-php-ext-install -j$(nproc) gd \
    && docker-php-ext-configure imap \
        --with-kerberos \
        --with-imap-ssl \
    && docker-php-ext-install -j$(nproc) imap \
    && docker-php-ext-install -j$(nproc) gettext

# Install composer
ENV COMPOSER_ALLOW_SUPERUSER=1
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && composer global require hirak/prestissimo

# Instal npm
RUN apt update -y \
    && apt -y install gnupg \
    && curl -sL https://deb.nodesource.com/setup_8.x | bash - \
    && apt -y install nodejs

# Install Ioncube
RUN curl -O http://downloads3.ioncube.com/loader_downloads/ioncube_loaders_lin_x86-64.tar.gz \
    && tar xvfz ioncube_loaders_lin_x86-64.tar.gz \
    && PHP_VERSION=$(php -r "echo PHP_MAJOR_VERSION.'.'.PHP_MINOR_VERSION;") \
    && PHP_EXT_DIR=$(php-config --extension-dir) \
    && mkdir -p $PHP_EXT_DIR \
    && cp "ioncube/ioncube_loader_lin_${PHP_VERSION}.so" $PHP_EXT_DIR \
    && cp "ioncube/ioncube_loader_lin_${PHP_VERSION}_ts.so" $PHP_EXT_DIR \
    && rm -rf ioncube ioncube_loaders_lin_x86-64.tar.gz \
    && echo "zend_extension=ioncube_loader_lin_${PHP_VERSION}.so" > /usr/local/etc/php/conf.d/ioncube.ini

RUN apt update -y \
    && apt -y install procps

ADD ./entrypoint.sh /root/entrypoint.sh
RUN chmod 755 /root/entrypoint.sh

ENTRYPOINT ["/root/entrypoint.sh"]
