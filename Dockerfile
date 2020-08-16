FROM php:7.1-apache
MAINTAINER Rob Zeeman <rob.zeeman@di.huc.knaw.nl>
EXPOSE 80 443
COPY --chown=www-data:www-data  ./src/ /var/www/html/

RUN apt-get update \
 && apt-get install -y libfreetype6-dev libjpeg62-turbo-dev libmcrypt-dev sudo unzip \
 && docker-php-ext-install mbstring \
 && docker-php-ext-install gd \
 && docker-php-ext-install iconv \
 && docker-php-ext-install mcrypt

RUN a2enmod rewrite