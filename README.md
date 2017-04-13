# barmanage
酒吧接入管理后台


#mysql远程登录
服务器：112.74.188.109

账号：admin

密码：jufo_admin@2017

#安装说明
请全局安装以下插件pm2、cross-env、nodemon


#数据库工具
Mysql

Redis（使用默认配置即可）

#数据库不使用外键的过程
1，先将原表改名，后缀加1；
2，将表数据导出成cvs；
3，在将cvs导入新表；

数据库的问题：
users表中wx的字段少了，不能包含全部内容要400长度
