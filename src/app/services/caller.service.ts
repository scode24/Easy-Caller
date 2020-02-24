import { Injectable } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Contacts } from '../models/contacts';

@Injectable({
  providedIn: 'root'
})
export class CallerService {
  imagePath: string;
  contactDoc: AngularFirestoreDocument<Contacts>;

  constructor(private firestore: AngularFirestore,
    private callNumber: CallNumber) { }

  public getContacts() {
    return this.firestore.collection('contacts').snapshotChanges();
  }

  public saveContact(contact: any) {
    return this.firestore.collection('contacts').add(contact);
  }

  public deleteContact(docId: string) {
    this.contactDoc = this.firestore.doc('contacts/' + docId);
    return this.contactDoc.delete();
  }

  public updateContact(docId: string, contact: Contacts) {
    this.contactDoc = this.firestore.doc('contacts/' + docId);
    return this.contactDoc.update(contact);
  }

  public callTo(phno: string) {
    this.callNumber.callNumber(phno, true).then(
      (res) => console.log('Dialer opened'),
      (err) => console.log(err)
    );
  }
}
