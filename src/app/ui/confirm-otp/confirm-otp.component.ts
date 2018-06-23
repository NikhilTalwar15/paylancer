import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/core/auth.service';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'confirm-otp',
  templateUrl: './confirm-otp.component.html',
  styleUrls: ['./confirm-otp.component.scss']
})

export class ConfirmOtpComponent implements OnInit {

  phoneNumber : number ;
  Profession: any;
  Address: any;
  userName: string;
  hideSendOTP: boolean = true;
  canSubmit: boolean = false ;
  phoneErrorMessage: string ;
  phoneSuccessMessage: string;
  otp: any;
  enteredOTP: number;
  otpSuccess: string;
  otpError: string;
  tempObj: any = {};
  step: number = 0;
  ticks =0;
  reSendOTP: boolean = false;
  loading: boolean;
  public mask = [ /\d/, '-', /\d/ ,'-', /\d/, '-', /\d/ ,'-', /\d/]
  constructor(public auth: AuthService, public router: Router) { }
  ngOnInit() {
    this.loading = true;
    this.otp = Math.floor(1000 + Math.random() * 9000);
    this.auth.showBack = false;
    console.log(this.auth._user);
    this.userName = this.auth._user.displayName;
    if(this.auth._user.phoneVerified){
      this.loading = false;
      this.router.navigateByUrl('');
    }
    this.loading = false;
  }

  sendOTP() {
    if(this.phoneChecker()){
      this.loading = true;
      this.reSendOTP = false;
      this.ticks= 0;
      this.phoneErrorMessage = "";
      var reSendTime = 60;
      let timer = Observable.timer(2000,1000);
      let subscription = timer.subscribe((t)=>{
        var temp = 0;
        temp = reSendTime - t;
        temp = +(temp/60).toFixed(1);
        this.ticks = temp;
        if(t >= 60){
          this.reSendOTP = true;
          this.ticks = 0;
          subscription.unsubscribe();
        }
      });
      this.auth.checkIfPhoneExist(this.phoneNumber).subscribe(
        (list)=>{
          console.log(list);
          if(list.length > 0){
            this.phoneSuccessMessage = "";
            this.phoneErrorMessage = "This number is already registered !";
            this.loading = false;
          } else {
            this.auth.sendPhoneOTP(this.phoneNumber,this.otp).then(
              () => {
                this.hideSendOTP = false;
                this.loading = false;
              }
            )};
           
        }
      )
    }
    
 }
 phoneChecker(){
  var phone = this.phoneNumber;
  var PhoneString = (""+phone);
  var Phonelenght = PhoneString.length;
   if(Phonelenght == 10){
     this.phoneSuccessMessage = "Looks good !";
     this.phoneErrorMessage = '';
     return true;
    } else {
      this.phoneErrorMessage = 'Number should be 10 digits long';
      this.phoneSuccessMessage = "";
      return false;
    }
 }
 phoneNumberInput($event: any){
  var phone = this.phoneNumber;
  var PhoneString = (""+phone);
  var Phonelenght = PhoneString.length;
   if(Phonelenght == 10){
     this.phoneSuccessMessage = "Looks good !";
     this.phoneErrorMessage = '';
    
    } else {
      this.phoneErrorMessage = 'Number should be 10 digits long';
      this.phoneSuccessMessage = "";
  
    }
 }
  submitForm(){
      // this.auth.updateUserDetails(this.userName,this.phoneNumber,true);
  }
  checkOTP(){
    this.otpError = '';
    this.loading = true;
    this.auth.getPhoneOTP().subscribe(
      (data) =>{
        this.tempObj = data
        var otp = this.tempObj.otp;
        console.log(this.enteredOTP ,otp);
        if(this.enteredOTP == otp){
          this.canSubmit = true;
          this.otpError = '';
          this.otpSuccess = 'Phone is Varifed';
          this.auth.updateUserDetails(this.phoneNumber,true).then(
            () =>{
              this.loading = false;
              this.auth.globalLoader = true;
              this.router.navigateByUrl('/profile');
            }
          )

        } else {
          this.loading = false;
          this.otpError = 'OTP is not Valid';
        }
      }
    )

  }
  changeNumber(){
    this.hideSendOTP = !this.hideSendOTP;
  }


}
