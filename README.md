<div align="center"><img alt="Groupomania Logo" src="./front/groupomania/src/assets/icon-left-font-monochrome-white.svg" /></div>

# 7th OpenClassrooms project :zebra:

Creation of a Beta version of a corporate social network.
***
## Table of Contents
1. [General Info](#general-info)
2. [Technologies](#technologies)
3. [Installation](#installation)
4. [Admin Info](#admin-info)

### :newspaper: General Info :newspaper:
***
The objective is to build an internal social network for Groupomania employees. 
The purpose of this tool is to facilitate interactions between colleagues.

Features:

- User registration and login
- Profil page && profil edit
- Forum with posts and comments (sending of text and image possible)
- Moderator board (can soft delete a user)
- Admin board (can soft delete a user and switch roles between user and moderator)

### :briefcase: Technologies :briefcase:
***
- [HTML](https://developer.mozilla.org/fr/docs/Web/HTML)
- [CSS](https://developer.mozilla.org/fr/docs/Web/CSS)
- [VueJS](https://vuejs.org/guide/introduction.html): Version 3.0.0
- [JS](https://developer.mozilla.org/fr/docs/Web/JavaScript)
- [MySQL2](https://dev.mysql.com/): Version 2.3.3
- [Sequelize](https://sequelize.org/v6/): Version 6.15.0
- [Axios](https://axios-http.com/docs/intro): Version 0.25.0

### :wrench: Installation :wrench:
***
Prerequisite: 
Works with Node.js: Version 14.19.0

Clone repository from : https://github.com/SpiritF0rest/SandraWeidenthal_7_080721.git

#### :wrench: DataBase Install :wrench:

```
$ mysql -u root -p groupomania < groupomania.sql
```

#### :wrench: Backend Install :wrench:

```
from cloned folder :
$ cd ./backend
$ mkdir images
$ npm install
```

#### :airplane: Backend Start :airplane:

```
from cloned folder :
$ cd ./backend
$ nodemon server
```

#### :wrench: Frontend Install :wrench:

```
from cloned folder :
$ cd ./front/groupomania
$ npm install
```

#### :airplane: Frontend Start :airplane:

```
from cloned folder :
$ cd ./front/groupomania
$ npm run serve
```

### :shield: Admin Info :shield:
***
To connect with the administrator account, on the login page enter: 
- Pseudo: Admin
- Mot de passe (password): 267jSy!%y[Y3G

You can change password via profile page after login.

After that you can change the role of a user to moderator and vice versa via the adminboard.

***

:smiley: Have Fun with Groupomania :smiley: