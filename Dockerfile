FROM node:6.10.3
ADD . /opt/smart-notice/
RUN \
    cd /opt/smart-notice/ && \
    npm install

CMD cd /opt/smart-notice/ && node bin/www

EXPOSE 3000