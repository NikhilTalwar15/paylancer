import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AuthService } from 'app/core/auth.service';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as firebase from 'firebase';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/combineLatest';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable()
export class LogsService {
  deviceInfo: any= null;
  constructor(public auth: AuthService , public db: AngularFirestore , public router: Router, private deviceService: DeviceDetectorService) { }

  econtractLog(cid: any , oldStatus: number , newStatus: number){
    var today = new Date();
    this.deviceInfo = this.deviceService.getDeviceInfo();
    var data = {
      oldStatus: oldStatus,
      newStatus : newStatus,
      time: today,
      changedBy : this.auth._user.uid,
      device: this.deviceInfo 
    };
    console.log(this.deviceInfo);
    return this.db.collection(`logs/econtract/${cid}/${today}/update`).add(data);
  }

  bankLog(bankData: any){
    this.deviceInfo = this.deviceService.getDeviceInfo();
    console.log(bankData);
    var today = new Date();
    var data = {
      oldData:  bankData,
      time: today,
      changedBy : this.auth._user.uid,
      device: this.deviceInfo 
    }
    return this.db.doc(`logs/bankData/${this.auth._user.uid}/${today}`).set(data);
  }

}
