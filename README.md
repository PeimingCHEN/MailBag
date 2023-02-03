# MailBag
A single-user webmail system project for UCI MSWE Web Programming

## Environment
Node.js Version: 16.14.2 <br>
TypeScript Version: 3.7.3  <br>
React Version: 16.11.0 <br>

## Setup Project Steps
Server <br>
* Navigate to the server folder in the terminal `cd server`
* Install dependencies by running `npm install`
* Update SMTP and IMAP server information for the personal email application in `serverInfo.json`
* Using `npm run dev` to compile all the source code from ts format in the src folder to js format in the dist folder and then start up the server. 

Client <br>
* Navigate to the client folder in the terminal `cd client`
* Install dependencies by running: `npm install`
* Update server information for the personal email application in `./src/code/config.ts `
* Using `npm run build` to start up a client, and interact with the UI in http://localhost

## View
* Welcome View <br>
<img src="https://github.com/PeimingCHEN/MailBag/blob/main/images/Welcome.png" width="900"/><br/>

* Message View  <br>
<img src="https://github.com/PeimingCHEN/MailBag/blob/main/images/Message.png" width="900"/><br/>

* Contact View  <br>
<img src="https://github.com/PeimingCHEN/MailBag/blob/main/images/Contact.png" width="900"/><br/>

* Update the contact’s information<br>
<img src="https://github.com/PeimingCHEN/MailBag/blob/main/images/Update.png" width="900"/><br/>

* Trash View
<img src="https://github.com/PeimingCHEN/MailBag/blob/main/images/Trash.png" width="900"/><br/>

## Reference
Modern Full-Stack Development Using TypeScript, React, Node.js, Webpack and Docker. by Frank Zammetti
