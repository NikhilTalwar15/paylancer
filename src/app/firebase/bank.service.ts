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
export class BankService {
  loading: boolean;
  constructor(public auth: AuthService , public db: AngularFirestore , public router: Router , public logsService: LogsService) { }

  addBankDetails(bankData: any){
    this.loading = true;
    var setDocument = this.db.doc<any>(`bankDetails/${this.auth._user.uid}`);
    setDocument.set(bankData).then(
      update =>{
        this.auth._user.bankDetails = true;
        var temp = this.db.doc(`users/${this.auth._user.uid}`);
        temp.update(this.auth._user).then(
          () =>{
            this.loading = false;
            this.logsService.bankLog(bankData);
            this.router.navigateByUrl(`/`);
          }
        )
      }
    );
  }

  updateBankDetails(bankData: any){
    this.loading = true;
    var setDocument = this.db.doc<any>(`bankDetails/${this.auth._user.uid}`);
    setDocument.set(bankData).then(
      update =>{
        this.loading = false;
        this.logsService.bankLog(bankData);
        this.router.navigateByUrl(`/`);
      });
  }

  getBankDetails(){
    return this.db.doc(`bankDetails/${this.auth._user.uid}`).valueChanges();
  }

}
