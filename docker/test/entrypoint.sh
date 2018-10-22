#!/bin/bash -e

composer install

./vendor/bin/parallel-phpunit --pu-cmd="./vendor/bin/phpunit -c phpunit-docker.xml" tests
