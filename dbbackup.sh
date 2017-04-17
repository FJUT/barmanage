#!/bin/bash

BKRoot=/var/www/node/dbbackup/
File=${BKRoot}`date +%Y%m%d`.sql

mysqldump -uadmin -pjufo_admin@2017 weizhong > ${File}

#删除超过7天的备份数据
find ${BKRoot} -mtime +7 -name '*[1-9].sql' -exec rm -rf {} \;

#删除超过3个月的所有备份数据，保留3个月里的 10号 20号 30号的备份数据
find ${BKRoot} -mtime +92 -name '*.sql' -exec rm -rf {} \;
