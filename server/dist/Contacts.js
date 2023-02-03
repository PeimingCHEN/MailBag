"use strict";
// dealing with contacts (listing, adding, and deleting them)
// store data in a ole’ database on a server.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Worker = void 0;
// Node imports.
const path = __importStar(require("path"));
// Library imports.
const Datastore = require("nedb");
// The worker that will perform contact operations.
class Worker {
    constructor() {
        this.db = new Datastore({
            filename: path.join(__dirname, "contacts.db"),
            autoload: true // load automatically
        });
    }
    /**
     * Lists all contacts.
     *
     * @return A promise that eventually resolves to an array of IContact objects.
     */
    listContacts() {
        return new Promise((inResolve, inReject) => {
            this.db.find(// returns all the records in the contacts.db file
            {}, (inError, inDocs) => {
                if (inError) {
                    inReject(inError);
                }
                else {
                    inResolve(inDocs);
                }
            });
        });
    } /* End listContacts(). */
    /**
     * Add a new contact.
     *
     * @param  inContact The contact to add.
     * @return           A promise that eventually resolves to an IContact object.
     */
    addContact(inContact) {
        return new Promise((inResolve, inReject) => {
            // insert method passes the added object to the callback, which include an _id field
            this.db.insert(inContact, // the contact to add
            (inError, inNewDoc) => {
                if (inError) {
                    inReject(inError);
                }
                else {
                    inResolve(inNewDoc);
                }
            });
        });
    } /* End addContact(). */
    /**
     * Update a contact.
     *
     * @param  inContact The contact to update.
     * @return           A promise that eventually resolves to an IContact object.
     */
    updateContact(inContact) {
        return new Promise((inResolve, inReject) => {
            this.db.update({ _id: inContact._id }, inContact, { returnUpdatedDocs: true }, (inError, numberOfUpdated, inDocs, upsert) => {
                if (inError) {
                    inReject(inError);
                }
                else {
                    inResolve(inDocs);
                }
            });
        });
    } /* End updateContact(). */
    /**
     * Delete a contact.
     *
     * @param  inID The ID of the contact to delete.
     * @return      A promise that eventually resolves to a string (null for success, or the error message for an error).
     */
    deleteContact(inID) {
        return new Promise((inResolve, inReject) => {
            this.db.remove({ _id: inID }, {}, (inError, inNumRemoved) => {
                if (inError) {
                    inReject(inError);
                }
                else {
                    inResolve();
                }
            });
        });
    } /* End deleteContact(). */
} /* End class. */
exports.Worker = Worker;
//# sourceMappingURL=Contacts.js.map