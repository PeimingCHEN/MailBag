// The main code entry point.
// Style imports.
import "normalize.css"; // CSS reset; applied automatically before your app’s styles
import "../css/main.css";

// React imports.
import React from "react";
import ReactDOM from "react-dom";

// App imports.
import BaseLayout from "./components/BaseLayout";
import * as IMAP from "./IMAP";
import * as Contacts from "./Contacts";


// Render the UI.
const baseComponent = ReactDOM.render(<BaseLayout />, document.body);


// Now go fetch the user's mailboxes, and then their contacts.
baseComponent.state.showHidePleaseWait(true); // BaseLayout is a parent to all the rest, which is the most logical place to place state.
// With the please wait popup showing, we can now call the server:
async function getMailboxes() {
  const imapWorker: IMAP.Worker = new IMAP.Worker();
  const mailboxes: IMAP.IMailbox[] = await imapWorker.listMailboxes();
  mailboxes.forEach((inMailbox) => {
    baseComponent.state.addMailboxToList(inMailbox); // update the mailboxes array in state
  });
}
getMailboxes().then(function() {
  // Now go fetch the user's contacts.
  async function getContacts() {
    const contactsWorker: Contacts.Worker = new Contacts.Worker();
    const contacts: Contacts.IContact[] = await contactsWorker.listContacts();
    contacts.forEach((inContact) => {
      baseComponent.state.addContactToList(inContact);
    });
  }
  getContacts().then(() => baseComponent.state.showHidePleaseWait(false));//  hide the please wait popup.
});
