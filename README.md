# The Webchat (client-side)
The project project was created as part of the studies. React framework was chosen for the client-side and Node.js for the server-side. MySQL was chosen as the DBMS.

## Table of contents
- [Overview](#overview)
- [Features](#features)
- [Limitations](#limitations)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)  

## Overview
During my studies, I had to come up with a project that I would like to implement. By that time I had already been familiar with some basics of Node.js and had a strong foundation of HTML, CSS, JavaScript and React. However, I really wanted to create something that mimics the apps we use everyday, and in particular those which involve both server and client. And the field of those is huge: internet calls, online games, social media etc.
I decided to implement a simplified version of the messaging app like WhatsApp or Telegram. 


## Features
- Full account management, including creation and removal of an account and the logging in process.
- Two-factor authentication required (using an email) when creating an account and when deleting it completely.
- Bilateral chat management, including an ability to perform a global search by username in order to add that person to your "list of contacts", and leaving the chat completely (automatically removes the whole chat history). The system is open for modification to implement the group chat.
- Communication by text only. Includes the message status, such as "sent", "delivered" and "read".
- Preserves all the contacts and chat history.
- Settings panel for some client-side settings adjustment, such as the language, the font size, the theme etc.
- The application is mobile and laptop friendly.

## Limitations
- No sending of files of any type.
- No calls.
- No group chats.
- Only 3 languages are supported: Ukrainian, English and Russian.


## Prerequisites
- The lates version of Node.js.
- The latest version of npm.

## Installation
Do a ``git clone`` or install a .zip file of this repository. Same for the WebChat-Server repository.

## Usage
1. Once installed, navigate to each of the target folders (client and server) and run ``npm i``.
2. In order to run the app, you need to install the DBMS, you then need to change .env file in WebChat-Server repository to match your credentials (I deliberately posted .env file on Github). Also run the code from WebChat-Database repository to create the database structure.
3. Then you need to find another email provider and setup your account and put its credentials in the .env file (the credentials for my account have been changed, so you will not be able to use it).
4. Once done, make sure your DBMS is on. Then navigate to WebChat-Server directory and run ``node app`` and then navigate to WebChat-Client directory and run ``npm start``. 
