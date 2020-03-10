
npm run build && tar -zcvf dist.tar.gz dist/* && scp dist.tar.gz root@47.96.151.103:/home/pro/test/web-upload/ && ssh root@47.96.151.103 "cd /home/pro/test/web-upload/; tar -zxvf dist.tar.gz; rm dist.tar.gz; exit;"
