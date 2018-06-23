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
import { LogsService } from './logs.service';

@Injectable()
export class PodService {
  loading: boolean;
  constructor(public auth: AuthService , public db: AngularFirestore , public router: Router , public logsService: LogsService) { }

  getOrderDataList(){
    console.log(this.auth._user.phone);
    return this.db.collection<any>('pod/', ref => ref.where('user_phone_no', '==' ,""+ this.auth._user.phone )).valueChanges();
  }

  getOrderData(oid: any) {
    return this.db.doc(`pod/${oid}`).valueChanges();
  }
  updateOrderData(order: any){
    if(order.status == 2){
      var otp = Math.floor(1000 + Math.random() * 9000);
      order.otp = otp;
    }
    return this.db.doc(`pod/${order.oid}`).update(order);
  }

}
