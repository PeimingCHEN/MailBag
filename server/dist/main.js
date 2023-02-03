"use strict";
// the main entry point and constitute the API the server presents to the client 
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// core Node module imports.
const path_1 = __importDefault(require("path"));
// Express and some Express-related things imports.
const express_1 = __importDefault(require("express"));
// App imports.
const ServerInfo_1 = require("./ServerInfo");
const IMAP = __importStar(require("./IMAP"));
const SMTP = __importStar(require("./SMTP"));
const Contacts = __importStar(require("./Contacts"));
// creates our Express app.
const app = (0, express_1.default)();
// add some middleware to Express
// Handle JSON in request bodies.
app.use(express_1.default.json());
// Serve the client to a requested browser.
// The static middleware is a built-in middleware for serving static resources. 
// __dirname is the directory the current script is in
app.use("/", express_1.default.static(path_1.default.join(__dirname, "../../client/dist")));
// Enable CORS so that we can call the API even from anywhere.
// CORS is a security mechanism ensures that only certain domains can call REST services. 
app.use(function (inRequest, inResponse, inNext) {
    inResponse.header("Access-Control-Allow-Origin", "*"); // asterisk means browser will allow the call regardless of where it’s launched from. 
    inResponse.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS"); // Http methods we will accept from clients
    inResponse.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept"); // accept additional header
    inNext(); // continue the middleware chain, so the request can continue to be processed as required
});
// REST Endpoint: List Mailboxes
// Express app is acting as a proxy to the IMAP (and also SMTP and Contacts) object
app.get("/mailboxes", // app.get() is used to register 'get' path, /mailboxes is a logical choice for the path
(inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imapWorker = new IMAP.Worker(ServerInfo_1.serverInfo);
        const mailboxes = yield imapWorker.listMailboxes();
        inResponse.status(200);
        inResponse.json(mailboxes); // marshals array into JSON and returns to the caller
    }
    catch (inError) {
        inResponse.status(400);
        inResponse.send("error"); // send a plain text "error" response back if any exceptions be thrown
    }
}));
// REST Endpoint: List Messages
app.get("/mailboxes/:mailbox", // specify the name of the mailbox to get messages for
(inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imapWorker = new IMAP.Worker(ServerInfo_1.serverInfo);
        const messages = yield imapWorker.listMessages({
            mailbox: inRequest.params.mailbox // access dynamic value after /mailboxes/
        });
        inResponse.status(200);
        inResponse.json(messages);
    }
    catch (inError) {
        inResponse.status(400);
        inResponse.send("error");
    }
}));
// REST Endpoint: Get a Message
app.get("/messages/:mailbox/:id", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imapWorker = new IMAP.Worker(ServerInfo_1.serverInfo);
        const messageBody = yield imapWorker.getMessageBody({
            mailbox: inRequest.params.mailbox,
            id: parseInt(inRequest.params.id, 10) // the ID of the message (str -> int)
        });
        inResponse.status(200);
        inResponse.send(messageBody); // returned as plain text 
    }
    catch (inError) {
        inResponse.status(400);
        inResponse.send("error");
    }
}));
// REST Endpoint: Delete a Message
// the app.delete() method is used to register this endpoint.
app.delete("/messages/:mailbox/:id", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imapWorker = new IMAP.Worker(ServerInfo_1.serverInfo);
        yield imapWorker.deleteMessage({
            mailbox: inRequest.params.mailbox,
            id: parseInt(inRequest.params.id, 10)
        });
        inResponse.status(200);
        inResponse.send("ok");
    }
    catch (inError) {
        inResponse.status(400);
        inResponse.send("error");
    }
}));
// REST Endpoint: Send a Message
// app.post() is used to send a message
// IMAP protocol: retrieving mailboxes and messages
// SMTP protocol: send messages
app.post("/messages", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const smtpWorker = new SMTP.Worker(ServerInfo_1.serverInfo);
        yield smtpWorker.sendMessage(inRequest.body);
        inResponse.status(201);
        inResponse.send("ok");
    }
    catch (inError) {
        inResponse.status(400);
        inResponse.send("error");
    }
}));
// REST Endpoint: List Contacts
app.get("/contacts", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contactsWorker = new Contacts.Worker();
        const contacts = yield contactsWorker.listContacts();
        inResponse.status(200);
        inResponse.json(contacts);
    }
    catch (inError) {
        inResponse.status(400);
        inResponse.send("error");
    }
}));
// REST Endpoint: Add Contact
app.post("/contacts", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contactsWorker = new Contacts.Worker();
        const contact = yield contactsWorker.addContact(inRequest.body); // contain a unique identifier
        inResponse.status(201);
        inResponse.json(contact);
    }
    catch (inError) {
        inResponse.status(400);
        inResponse.send("error");
    }
}));
// REST Endpoint: Update Contacts
app.put("/contacts", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contactsWorker = new Contacts.Worker();
        const contact = yield contactsWorker.updateContact(inRequest.body);
        inResponse.status(202);
        inResponse.json(contact);
    }
    catch (inError) {
        inResponse.status(400);
        inResponse.send("error");
    }
}));
// REST Endpoint: Delete Contact
app.delete("/contacts/:id", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contactsWorker = new Contacts.Worker();
        yield contactsWorker.deleteContact(inRequest.params.id); // includes the ID of the contact to delete
        inResponse.status(200);
        inResponse.send("ok");
    }
    catch (inError) {
        inResponse.status(400);
        inResponse.send("error");
    }
}));
// Start app listening.
app.listen(80, () => {
    console.log("MailBag server open for requests");
});
//# sourceMappingURL=main.js.map