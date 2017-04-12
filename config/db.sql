/*Users  用户表只需要修改wx字段为400长度*/
/*DROP TABLE IF EXISTS `Users`;
CREATE TABLE `Users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `nickname` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `gender` int(11) DEFAULT NULL,
  `exp` int(11) DEFAULT '0',
  `score` int(11) DEFAULT '0',
  `province` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `phonenumber` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `openid` varchar(255) DEFAULT NULL,
  `wx` varchar(400) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;*/

/*Bars*/
DROP TABLE IF EXISTS `Bars`;
CREATE TABLE `Bars` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `logo` char(255) DEFAULT 'logo-default.png',
  `name` char(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT '',
  `bussinesshours` char(255) DEFAULT NULL,
  `position` char(255) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `photos` varchar(255) DEFAULT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `screenvalid` int(11) DEFAULT NULL,
  `phonenumber` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `screenTitle` varchar(255) DEFAULT NULL,
  `screenBackImage` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

/*Orders*/
DROP TABLE IF EXISTS `Orders`;
CREATE TABLE `Orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `amount` int(11) DEFAULT '0',
  `status` tinyint(1) DEFAULT '0',
  `type` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime NULL DEFAULT NULL,
  `BarId` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  `MessageId` int(11),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

/*Messages*/
DROP TABLE IF EXISTS `Messages`;
CREATE TABLE `Messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `msgText` varchar(255) DEFAULT NULL,
  `msgImage` varchar(255) DEFAULT NULL,
  `msgVideo` varchar(255) DEFAULT NULL,
  `msgTime` datetime DEFAULT NULL,
  `msgType` int(11) DEFAULT NULL,
  `seconds` int(11) DEFAULT NULL,
  `isDisplay` tinyint(1) DEFAULT '1',
  `isPayed` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime NULL DEFAULT NULL,
  `BarId` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;


