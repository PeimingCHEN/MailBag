"use strict";
// a configuration file that provides the IMAP and SMTP server(s) 
// the server will connect to and where that information will be stored.
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverInfo = void 0;
// Node path module imports.
const path = require("path");
const fs = require("fs"); // File System module
// Read in the serverInfo.json file and create an object
// The file is read in as a plain string with the fs.readFileSync() function
const rawInfo = fs.readFileSync(path.join(__dirname, "../serverInfo.json"));
exports.serverInfo = JSON.parse(rawInfo);
// After that, we have an object in memory that contains the information needed to connect to the server
// MailBag is a single-user webmail application
//# sourceMappingURL=ServerInfo.js.map