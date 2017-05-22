####  Docker Deploy
- git clone this project && cd SmartNotice
- Docker Test

  - ```$ docker build -t smart-notice:<tag> .```

  - ```$ docker run -it --rm -p 3000 -e "SERVICE_NAME=smart-notice-test" -e "NODE_ENV=production" smart-notice:<tag>```

  - OR  ```$ docker run -it --rm -p 3000 -e "SERVICE_NAME=smart-notice-test" -e "NODE_ENV=production" smart-notice:<tag>  bash --login ```

    ​

- Docker Deploy

  - ```$ docker run -d --restart always -p 3000 -e "SERVICE_NAME=smart-notice" -e "NODE_ENV=production"  --name smart-notice smart-notice:<tag> ```

