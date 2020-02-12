import { Component, OnInit } from '@angular/core';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Contacts } from '../models/contacts';
import { AlertService } from '../services/alert.service';
import { CallerService } from '../services/caller.service';
import { ToastService } from '../services/toast.service';
import { SpinnerService } from '../services/spinner.service';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.page.html',
  styleUrls: ['./add-contact.page.scss'],
})
export class AddContactPage implements OnInit {
  nameValue: string;
  phnoValue: number;
  imagePath = '../../assets/icon/user.png';

  constructor(private callerService: CallerService,
    private toastService: ToastService,
    private alertService: AlertService,
    private imagePicker: ImagePicker,
    private spinnerService: SpinnerService) { }

  ngOnInit() {
  }

  saveContact() {
    this.spinnerService.present('Saving contact...');
    if (this.nameValue === undefined || this.phnoValue === undefined) {
      this.alertService.showOkAlert('Mandetory information is missing', 'To save the contact name and phone number should be provided');
      this.spinnerService.dismiss();
    } else if (!this.validatePhoneNo(this.phnoValue)) {
      this.alertService.showOkAlert('Invalid phone number', 'Please enter valid phone number');
      this.spinnerService.dismiss();
    } else {
      const contact = new Contacts();
      contact.name = this.nameValue;
      contact.phno = this.phnoValue;
      contact.photoPath = this.callerService.imagePath;
      this.callerService.saveContact(JSON.parse(JSON.stringify(contact))).then(
        () => { this.toastService.show('Contact has been saved successfully'); this.spinnerService.dismiss() },
        () => this.toastService.show('OOPS! Contact has not been saved successfully')
      );
    }
  }

  validatePhoneNo(phnoValue: number) {
    const regex = /^\(?([0-9]{3})\)?([0-9]{3})([0-9]{4})$/;
    return regex.test(phnoValue.toString());
  }

  uploadImage() {
    const option = {
      maximumImageCount: 1,
      outputType: 1
    };

    this.imagePicker.getPictures(option).then(results => {
      this.spinnerService.present('Uploading photo...');

      if (results.length > 0) {
        for (let i = 0; i < results.length; i++) {
          this.imagePath = 'data:image/jpeg;base64,' + results[i];
          this.callerService.imagePath = this.imagePath;
          this.spinnerService.dismiss();
        }
      } else {
        this.spinnerService.dismiss();
      }
    }, (err) => {

    });
  }
}
