import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

import { Geofence } from '@ionic-native/Geofence';
import { Geolocation } from '@ionic-native/Geolocation';
import { SMS } from '@ionic-native/SMS';
import { ActivePage } from '../active/active';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  radius: number = 5;
  error: any;
  success: any;

  longitude: number = 0;
  latitude:number = 0;

  constructor(public navCtrl: NavController, private platform: Platform, private geofence: Geofence, private geolocation: Geolocation, private sms: SMS) {
    this.platform.ready().then(() => {

      geofence.initialize().then(
        () => console.log('Geofence Plugin Ready'),
        (err) => console.log("err")
      );

      this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp) => {
        this.longitude = resp.coords.longitude;
        this.latitude = resp.coords.latitude;
      });

    });
    
  }
  getPosition() {
    this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp) => {
      this.longitude = resp.coords.longitude;
      this.latitude = resp.coords.latitude;
    });
  }

  setGeofence(value: number) {
    this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp) => {
      this.longitude = resp.coords.longitude;
      this.latitude = resp.coords.latitude;
      var radius = value;

      // this.sms.send('89146514738', 'Fence setted.');

      let fence = {
        id: "myGeofenceID",
        latitude: this.latitude,
        longitude: this.longitude,
        radius: radius,
        transitionType: 2
      };

      this.geofence.addOrUpdate(fence).then(
        () => this.success = true,
        (err) => this.error = "Failed to add or update the fence."
      );

      this.geofence.onTransitionReceived().subscribe(resp => {
        this.sms.send('89146514738', 'She left the damn fence!');
      });

      this.navCtrl.push(ActivePage);

    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

}
