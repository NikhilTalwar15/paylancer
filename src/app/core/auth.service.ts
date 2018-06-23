import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { NotifyService } from './notify.service';

import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import { MessagingService } from '../messaging.service';

interface User {
  uid: string;
  email?: string | null;
  photoURL?: string;
  displayName?: string;
  phone?: number | null ;
  phoneVerified: boolean;
  bankDetails: boolean;
  profession: string;
  gender: string;
}

@Injectable()
export class AuthService {

  user: Observable<User | null>;
  isPhoneVerified = false;
  phoneDone: any =  {};
  userPhone: any = {};
  _user: any = {};
  valid: any  = {};
  showBack: boolean = false;
  globalLoader: boolean = true;
  nextPageProfile: boolean = false;
  constructor(private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private router: Router,
              private notify: NotifyService,
              private msgService: MessagingService) {

    this.user = this.afAuth.authState
      .switchMap((user) => {
        if (user) {
           var tempUser = this.afs.doc<User>(`users/${user.uid}`).valueChanges();
           tempUser.subscribe(
             (data)=>{
                this._user = data;
                this.globalLoader = false;
                console.log(this._user);
             });
             return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          this.globalLoader = false;
          return Observable.of(null);
        }
      });
  }

  ////// OAuth Methods /////

  googleLogin() {
    this.globalLoader = true;
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  githubLogin() {
    this.globalLoader = true;
    const provider = new firebase.auth.GithubAuthProvider();
    return this.oAuthLogin(provider);
  }

  facebookLogin() {
    this.globalLoader = true;
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.oAuthLogin(provider);
  }

  twitterLogin() {
    this.globalLoader = true;
    const provider = new firebase.auth.TwitterAuthProvider();
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider: firebase.auth.AuthProvider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        console.log('its google login');
        return this.updateUserData(credential.user);
      })
      .catch((error) => this.handleError(error) );
  }

  //// Anonymous Auth ////

  anonymousLogin() {
    return this.afAuth.auth.signInAnonymously()
      .then((user) => {
        return this.updateUserData(user); // if using firestore
      })
      .catch((error) => {
        console.error(error.code);
        console.error(error.message);
        this.handleError(error);
      });
  }

  //// Email/Password Auth ////

  emailSignUp(email: string, password: string) {
    this.globalLoader = true;
    const fbAuth = firebase.auth();
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
      
        this.globalLoader = false;
        return this.updateUserData(user); // if using firestore
      })
      .catch((error) => this.handleError(error) );
  }

  emailLogin(email: string, password: string) {
    this.globalLoader = true;
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        
        this.globalLoader = false;
        return this.updateUserData(user); // if using firestore
      })
      .catch((error) => this.handleError(error) );
  }

  // Sends email allowing user to reset password
  resetPassword(email: string) {
    const fbAuth = firebase.auth();

    return fbAuth.sendPasswordResetEmail(email)
      // .then(() => this.notify.update('Password update email sent', 'info'))
      .catch((error) => this.handleError(error));
  }

  signOut() {
    this.globalLoader = true;
    var token = this.msgService.token;
    console.log(token)
    var temp =this.afs.collection<any>('tokens/', ref => ref.where('token', '==' , token)).snapshotChanges();
    temp.subscribe(
      (list)=> {
        var i = 0;
        console.log(list);
        list.forEach(doc =>{
          let id = doc.payload.doc.id;
          this.afs.doc(`tokens/${id}`).delete().then(
            () =>{
              i = i + 1;
            }
          )
        })
        if(i == list.length){
          this.afAuth.auth.signOut().then(() => {
            console.log('hello')
              this.globalLoader = false;
              this._user = {};
              this.router.navigate(['/login']);
              
          });
        }
        });
  }

  // If error, console log and notify user
  private handleError(error: Error) {
    console.error(error);
    // this.notify.update(error.message, 'error');
  }

  // Sets user data to firestore after succesful login
  private updateUserData(user: User) {
    this.globalLoader = true;
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const tempDetails = this.afs.doc(`users/${user.uid}`).valueChanges();
    tempDetails.subscribe(
    tempData => {
      console.log(tempData)
      if(!tempData) {
        console.log(user);
        const data: User = {
          uid: user.uid,
          email: user.email || null,
          displayName: user.displayName || 'nameless user',
          photoURL: user.photoURL || 'https://goo.gl/Fz9nrQ',
          phone: null  ,
          phoneVerified: false,
          bankDetails: false,
          gender: "Male",
          profession: ''
        };
        console.log(data);
        userRef.set(data).then(
          () => {
            this.globalLoader = false;
            this.nextPageProfile = true;
            this.router.navigateByUrl('verify');
          }
        );
      } else {
        this.phoneDone = tempData;
        var phoneIsthere = this.phoneDone.phoneVerified;
        if(phoneIsthere && !this.nextPageProfile){
          this.globalLoader = false;
          this.router.navigateByUrl('/');
        } else {
          this.globalLoader = false;
          this.router.navigateByUrl('verify')
        }
    }
    }
    );

   
  
  }
  public updateUserDetails(phone: number,phoneVerified: boolean){
    const data: User = {
      uid: this._user.uid,
      email: this._user.email,
      displayName: this._user.displayName,
      photoURL: this._user.photoURL,
      phone: phone  ,
      phoneVerified: phoneVerified,
      bankDetails: this._user.bankDetails,
      gender: "Male",
      profession: ''
    };
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${this._user.uid}`);
    return userRef.set(data);
  }
  
  checkIfPhoneExist(phone: any){
    return this.afs.collection<any>(`users/` , ref => ref.where('phone', '==' , phone)).valueChanges();
  }

  sendPhoneOTP(phone: any , otp: number){
    var data = {
      phone: phone,
      otp: otp
    }
    return this.afs.doc(`verifyOTP/${this._user.uid}`).set(data);
  }
  getPhoneOTP(){
    return this.afs.doc(`verifyOTP/${this._user.uid}`).valueChanges();
  }

  updateToUserData(data: any){
    return this.afs.doc(`users/${this._user.uid}`).set(data);
  }

  fetchNotification(){
    return this.afs.collection<any>(`notify/` , ref => ref.where('uid', '==' , this._user.uid) .orderBy('seen') .orderBy('time', 'desc')).valueChanges().take(1);
  }
  fetchNotificationToSetSeen(){
    var temp = this.afs.collection<any>(`notify/` , ref => ref.where('uid', '==' , this._user.uid) .where('seen', '==' , 0)).snapshotChanges().take(1);
    temp.subscribe(
      list =>{
        console.log(list);
        list.forEach(doc =>{
          let id = doc.payload.doc.id;
          this.afs.doc(`notify/${id}`).update({'seen': 1}).then(
            () =>{
              console.log('done');
            }
          )
        })
      }
    )
  }


  newNotificationList() {
    return this.afs.collection<any>('notify' , ref =>  ref.where('uid', '==' , this._user.uid) .where('seen', '==' , 0) ).valueChanges();
  }
  
  setNotificationAsSeen() {

  }


}
