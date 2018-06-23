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
import { SendNotifyService } from '../notification/send-notify.service';

@Injectable()
export class EcontractService {

  tempObject: any = {};
  updated: Observable<any>;
  loading: boolean;
  updateCid : any;
  updateIdCreate: any;
  baseurl: string = "https://paylancer-dev.firebaseapp.com/"
  constructor(public auth: AuthService , public db: AngularFirestore , public router: Router, public logsService: LogsService , public sendNotify: SendNotifyService) { }

  createEcontract(contract: any){
    this.loading = true;
    var setDocument = this.db.collection<any>(`econtract/`);
    setDocument.add(contract).then(
      update =>{
        this.tempObject = contract;
        this.tempObject.cid = update.id;
        var toWhom = undefined;
        console.log(contract);
        console.log("Notification mein");
        if(this.auth._user.uid == contract.sc){
          toWhom = contract.sp;
        }else if(this.auth._user.uid == contract.sp) {
          toWhom = contract.sc;
        }
        console.log(toWhom);
        var title = "New Contract"
        var body = `${this.auth._user.displayName} is interested in creating a contract with you`;
        var url = this.baseurl +"econtract/" + this.tempObject.cid;
        if(toWhom){
          this.sendNotify.sendNotification(title,body,toWhom,this.tempObject.cid,url).then(
            () =>{
               this.setLogOfCreate(contract);
            }
          );
        } else {
          this.setLogOfCreate(contract);
        }
            
      }
    )
  
  }

  setLogOfCreate(contract: any) {
    console.log(this.tempObject.cid);
            var temp = this.db.doc(`econtract/${this.tempObject.cid}`);
            if(contract.status == 0){
              this.logsService.econtractLog(this.tempObject.cid,0,0);
            } else if(contract.status == 16){
              this.logsService.econtractLog(this.tempObject.cid,16,16);
            }
            temp.set(this.tempObject).then(
              () =>{
                    this.loading = false;
                    if(this.auth._user.bankDetails){
                      this.router.navigateByUrl(`econtract/${this.tempObject.cid}`);
                    } else {
                      this.router.navigateByUrl('/bankDetails');
                    }
                    console.log("Done");
              });
  }
  getUsersData(start: any): Observable<any[]>  {
    console.log(start)
    return this.db.collection<any>('users/', ref => ref.where('phone', '==' , start )).valueChanges();

  }

  getContractData(cid: any){
    return this.db.doc(`econtract/${cid}`).valueChanges();
  }
  getUserById(uid: any){
    return this.db.doc(`users/${uid}`).valueChanges();
  }
  // getUsersAllSP(){
  //   return this.db.collection<any>(`econtract/` , ref =>{
  //     let query = ref;
  //     query.where('sp', '==', this.auth._user.uid);
  //     query.where('active', '==' , 1);
  //     query.orderBy('startDate');
  //     return query;
  //   }).valueChanges();
  // }
  getUsersAllSP(active: number){
    return this.db.collection<any>(`econtract/` , ref =>ref.where('spPhone', '==' , this.auth._user.phone) .where('active','==', active) .orderBy('startDate')).valueChanges();
  }
  getUsersAllSC(active: number){
    return this.db.collection<any>(`econtract/` , ref =>ref.where('scPhone', '==' , this.auth._user.phone) .where('active','==', active) .orderBy('startDate')).valueChanges();
  }
  changeStatus(contract: any){
    if(contract.status == 4){
      var otp = Math.floor(1000 + Math.random() * 9000);
      contract.otp = otp;
    }
    return this.db.doc(`econtract/${contract.cid}`).update(contract);
  }
  updateEcontract(contract: any){
    return this.db.doc(`econtract/${contract.cid}`).update(contract);
  }
  updateEditEcontract(contract: any){
    this.loading = true;
   this.db.doc(`econtract/${contract.cid}`).update(contract).then(
     ()=>{
       this.loading = false;
       this.router.navigateByUrl(`/econtract/${contract.cid}`);
     }
   );
  }
  updateSCData(contract: any){
    return this.db.doc(`econtract/${contract.cid}`).update(contract);
  }
  updateSPData(contract: any){
    return this.db.doc(`econtract/${contract.cid}`).update(contract);
  }

  getDisputeData(econtract: any){
    return this.db.doc(`dispute/${econtract.cid}`).valueChanges();
  }
  disputeCreate(data: any){
    return this.db.doc(`dispute/${data.cid}/`).set(data);
  }
  disputeResolve(data: any){
    return this.db.doc(`dispute/${data.cid}/`).update(data);
  }


}
