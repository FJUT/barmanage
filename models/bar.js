/*
*
* — Create table
 create table
 (
 id            nvarchar2(32) not null,
 logo          nvarchar2(128),
 name          nvarchar2(32),
 address       nvarchar2(512),
 businesshours nvarchar2(64),
 position      nvarchar2(32),
 score         number,
 photos        nvarchar2(2048),
 summary       nvarchar2(1024),
 city          nvarchar2(32),
 screenvalid   number,
 phonenumber   number not null,
 password      nvarchar2(32) not null
 )
* */