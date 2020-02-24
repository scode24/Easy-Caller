import { Component, OnInit } from '@angular/core';
import { CallerService } from '../services/caller.service';
import { ToastService } from '../services/toast.service';
import { AlertService } from '../services/alert.service';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { SpinnerService } from '../services/spinner.service';
import { Contacts } from '../models/contacts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-entry',
  templateUrl: './edit-entry.page.html',
  styleUrls: ['./edit-entry.page.scss'],
})
export class EditEntryPage implements OnInit {

  nameValue: string;
  phnoValue: number;
  imagePath = '../../assets/icon/user.png';
  id: string;

  constructor(private callerService: CallerService,
    private router: Router,
    private toastService: ToastService,
    private alertService: AlertService,
    private imagePicker: ImagePicker,
    private spinnerService: SpinnerService) { }

  ngOnInit() {
    this.nameValue = this.router.getCurrentNavigation().extras.state.name;
    this.phnoValue = this.router.getCurrentNavigation().extras.state.phno;
    this.imagePath = this.router.getCurrentNavigation().extras.state.imagePath;
    this.id = this.router.getCurrentNavigation().extras.state.id;
  }

  saveContact() {
    this.spinnerService.present('Updating contact...');
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

      this.callerService.updateContact(this.id, JSON.parse(JSON.stringify(contact))).then(
        () => { this.toastService.show('Contact has been updated successfully'); this.spinnerService.dismiss(); },
        () => this.toastService.show('OOPS! Contact has not been updated successfully')
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
