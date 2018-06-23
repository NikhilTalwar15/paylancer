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
import { AngularFireAuth } from 'angularfire2/auth';
import { DeviceDetectorService } from 'ngx-device-detector';

import 'rxjs/add/operator/take';
import { NotifyService } from './core/notify.service';

@Injectable()
export class MessagingService {

  messaging = firebase.messaging();
  currentMessage = new BehaviorSubject(null)
  temp: any = {};
  token: any ;
  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth , private notify: NotifyService) { }


  updateToken(token: any) {
    var temp =this.db.collection<any>('tokens/', ref => ref.where('token', '==' , token)).valueChanges().take(1);
    temp.subscribe(
      (list) =>{
        console.log(list)
        if(list.length == 0 ){
          this.afAuth.authState.take(1).subscribe(user => {
            if (!user) return;
      
            const data = { token : token , uid: user.uid}
            this.db.collection('tokens').add(data)
          })
        } else {
          console.log('you already have registered for push');
        }
      }
    )
   
  }

  getPermission() {
      this.messaging.requestPermission()
      .then(() => {
        console.log('Notification permission granted.');
        return this.messaging.getToken()
      })
      .then(token => {
        this.token = token;
        console.log(token)
        this.updateToken(token)
      })
      .catch((err) => {
        console.log('Unable to get permission to notify.', err);
      });
    }

    receiveMessage() {
       this.messaging.onMessage((payload) => {
        console.log("Message received. ", payload);
        this.temp = payload;
        var notifyArray = this.temp.notification.click_action.split('/');
        console.log(notifyArray);
        var cid = notifyArray[notifyArray.length-1];
        this.notify.update(this.temp.notification.title , this.temp.notification.body , cid, "success");
        this.currentMessage.next(payload)
      });

    }
}