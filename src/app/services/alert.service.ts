import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(public alertController: AlertController) { }

  async showOkAlert(submsg: string, msg: string) {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: submsg,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }
}
