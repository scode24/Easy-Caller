import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class CallerService {
  imagePath: string;

  constructor(private firestore: AngularFirestore,
    private callNumber: CallNumber) { }

  public getContacts() {
    return this.firestore.collection('contacts').valueChanges();
  }

  public saveContact(contact: any) {
    return this.firestore.collection('contacts').add(contact);
  }

  public callTo(phno: string) {
    this.callNumber.callNumber(phno, true).then(
      (res) => console.log('Dialer opened'),
      (err) => console.log(err)
    );
  }
}
