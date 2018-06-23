import { Component, OnInit , HostListener   } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EcontractService } from 'app/firebase/econtract.service';
import { AuthService } from 'app/core/auth.service';
import { Router } from '@angular/router';
import * as moment from 'moment/moment';
import { LogsService } from '../../firebase/logs.service';
import { PlatformLocation } from '@angular/common'
import { SendNotifyService } from '../../notification/send-notify.service';
declare let paypal: any;
@Component({
  selector: 'econtract',
  templateUrl: './econtract.component.html',
  styleUrls: ['./econtract.component.scss']
})
export class EcontractComponent implements OnInit {

  cid: any;
  econtract: any = {};
  loading: boolean = true;
  loading2: boolean = true;
  isSP: boolean = false;
  isSC: boolean = false;
  SPData: any = {};
  SCData: any = {};
  confirmPage: boolean = false;
  confirmStatus: number ;
  otp: any;
  otpError: string ;
  endSessionSPError: string;
  disputeObj : any = {};
  disputeType: any = {};
  disputeNumber: number;
  pureData: any = {};
  disputeData: any = {};
  temp: any = {};
  cancelObj: any = {};
  inBetween: number = 50;
  afterSession: number = 50;
  terms: boolean = false;
  disputeRules: any = {};
  constructor(location: PlatformLocation,public activedRoute: ActivatedRoute , public econtractService: EcontractService, 
    public auth: AuthService , public router: Router, public logsService: LogsService, private sendNotify: SendNotifyService ) { 
    location.onPopState(() => {
      console.log("back button");
     this.router.navigateByUrl(`econtract/${this.econtract.cid}`);
  });
  }

//   @HostListener('document:backbutton', ['$event'])
//   onPopState(event : any) {
//   alert('Start page');
// }
addScript: boolean = false;
paypalLoad: boolean = true;

finalAmount: number = 50;

paypalConfig = {
  env: 'sandbox',
  client: {
    sandbox: 'AXMoecnNOuWyn4w2FtmPgHDRNM4Iyg6v-UdJarpQ6cjm5GK544U66tCGeQXNdHHBWZeBuOvVtVgiYs35',
   // production: '<your-production-key here>'
  },
  commit: true,
  payment: (data: any, actions: any) => {
    return actions.payment.create({
      payment: {
        transactions: [
          { amount: { total: this.econtract.amount, currency: 'INR' } }
        ]
      }
    });
  },
  onAuthorize: (data: any, actions: any) => {
    return actions.payment.execute().then((payment: any) => {
      //Do something when payment is successful.
      this.changeStatus(4);
    }) 
    .catch(
      ()=> {
        console.log("error");
      }
    )
  }
};

// ngAfterViewChecked(): void {
//   if (!this.addScript) {
//     this.addPaypalScript().then(() => {
//       paypal.Button.render(this.paypalConfig, '#paypal-checkout-btn');
//       this.paypalLoad = false;
//     })
//   }
// }

addPaypalScript() {
  this.addScript = true;
  return new Promise((resolve, reject) => {
    let scripttagElement = document.createElement('script');    
    scripttagElement.src = 'https://www.paypalobjects.com/api/checkout.js';
    scripttagElement.onload = resolve;
    document.body.appendChild(scripttagElement);
  })
}
  ngOnInit() {
    if(!this.auth._user.phoneVerified){
      this.router.navigateByUrl('/verify');
    }
    this.auth.showBack = true;
    this.loading = true;
    this.activedRoute.params.subscribe(
      (value)=>{
        this.cid = value.cid;
        this.fetchEcontractData();

        console.log(value);
      }
    )
  }
  editDisputeModel(){
    this.confirmPage = true;
    this.inBetween = this.econtract.disputeRules.inBetween;
    this.afterSession = this.econtract.disputeRules.afterSession;
    this.confirmStatus = 100; //JUST TO OPEN DISPUTE EDIT
  }
  fetchEcontractData(){
    this.loading2 = true;
    this.econtractService.getContractData(this.cid).subscribe(
      (data)=>{
        console.log(data);
     
        this.econtract = data;
        if (!this.addScript) {
          this.addPaypalScript().then(() => {
            paypal.Button.render(this.paypalConfig, '#paypal-checkout-btn');
            this.paypalLoad = false;
          })
        }
        this.pureData = data;
        this.econtract.editURL = '/econtract/edit/' + this.econtract.cid;
        this.temp = {};
        this.temp.latest = 5;
        this.econtract.dispute = this.temp;
        if(this.econtract.status >= 4 ){
      
          this.econtractService.getDisputeData(this.econtract).subscribe(
            (value) => {
              if(value){
                this.temp = value;
                this.disputeNumber = this.temp.latest;
                this.disputeData = value;

                this.econtract.dispute = value;
                this.loading2 = false;
              }else {
                this.temp = {};
                this.temp.latest = 5;
                this.econtract.dispute = this.temp;
                console.log(this.econtract);
                this.disputeNumber = 0;
                this.loading2 = false;
              }
              console.log(this.disputeNumber);
              console.log(this.econtract);
            }
          )
        }else {
          this.loading2 = false;
        }
        if(this.econtract){
          this.whoAreYou();
        } else {
          this.router.navigateByUrl('/');
        }
      
      }
    )
  }
  whoAreYou(){
    console.log(this.auth._user);
    if(this.auth._user.uid == this.econtract.sp){
      this.isSP = true;
      this.isSC = false;
      this.SPData = this.auth._user;
      if(this.econtract.sc){
        this.econtractService.getUserById(this.econtract.sc).subscribe(
          (value)=>{
            this.SCData = value;
            console.log(this.SCData);
            this.loading = false;
          }
        );
      }else {
        this.SCData.displayName = "Waiting for signUp";
        this.loading = false;
      }
    } 
      if(this.auth._user.uid == this.econtract.sc){
        this.isSC = true;
        this.isSP = false;
        this.SCData = this.auth._user;
        console.log(this.isSC);
        if(this.econtract.sp){
          this.econtractService.getUserById(this.econtract.sp).subscribe(
            (value)=>{
              this.SPData = value;
              console.log(this.SPData);
              this.loading = false;
            }
          );
        }else {
          this.SPData.displayName ="Waiting for signUp";
          this.SPData.phone = this.econtract.spPhone;
          this.loading = false;
        }
     
      }
      if(!this.isSC && !this.isSP){
        console.log('wapas ja bhai');
        this.router.navigateByUrl('/');
      }
    }
    openConfirmPage(newStatus: any){
      this.confirmPage = true;
      this.confirmStatus = newStatus;
    }
    changeStatus(newStatus: number){
      this.loading = true;
      this.confirmPage = false;
      this.pureData.dispute = {};
      const oldStatus = this.pureData.status;
      this.pureData.status = newStatus;
      if(newStatus == 6 || newStatus == 7){
        this.pureData.endedDateTime = new Date();
      } else if (newStatus == 15){
        this.disputeRules.inBetween = this.inBetween;
        this.disputeRules.afterSession = this.afterSession;
        this.pureData.disputeRules = this.disputeRules;
      }
      
      this.econtractService.changeStatus(this.pureData).then(
        () =>{
          
          this.logsService.econtractLog(this.econtract.cid,oldStatus,this.econtract.status);
          if(this.isSC){
            var userData = {
              name: this.SPData.displayName,
              email: this.SPData.email,
              phone: this.SPData.phone
            }
            var contract = {
              cid: this.econtract.cid,
              title: this.econtract.title,
              oldStatus: oldStatus,
              newStatus: this.econtract.status
            }
        
            this.sendNotify.sendStatusChangeNotification(this.econtract.cid , oldStatus , this.econtract.status, this.econtract.sp , this.SPData.email , this.econtract).then(
              () => {
                console.log('done');
              }
            )
            this.sendNotify.sendEmailSMS(userData,contract).then(
              () => {
                console.log('email and SMS done');
              }
            )
          
          } else if (this.isSP){
            var userData = {
              name: this.SCData.displayName,
              email: this.SCData.email,
              phone: this.SCData.phone
            }
            var contract = {
              cid: this.econtract.cid,
              title: this.econtract.title,
              oldStatus: oldStatus,
              newStatus: this.econtract.status
            }
            this.sendNotify.sendStatusChangeNotification(this.econtract.cid , oldStatus , this.econtract.status, this.econtract.sc , this.SCData.email , this.econtract).then(
              () => {
                console.log('done');
              }
            )
            this.sendNotify.sendEmailSMS(userData,contract).then(
              () => {
                console.log('email and SMS done');
              }
            )
          } 
          this.loading = false;
          console.log("status updated");
        }
      )
    }
    searchOTP($event: Event) {
      var today = new Date();
      var otp = this.otp;
      var otpString = (""+otp);
      var otplenght = otpString.length;
      if(otplenght == 4){
        if(this.econtract.otp == this.otp){
          this.econtract.startedDateTime = today;
          this.changeStatus(5);
        }else {
          this.otpError = "OTP is Incorrect !";
        }
      }
   }
   check() {
    var today = new Date();
    var otp = this.otp;
    var otpString = (""+otp);
    var otplenght = otpString.length;
     if(otplenght == 4){
      if(this.econtract.otp == this.otp){
        this.econtract.startedDateTime = today;
        this.changeStatus(5);
      }else {
        this.otpError = "OTP is Incorrect !";
      }
    } else {
      this.otpError = "OTP should be 4 digit long";
    }
   }
   endTheSessionSP(){
      var now = new Date();
      this.endSessionSPError = '';
      var startedTime = new Date(this.econtract.startedDateTime);
      var duration = this.econtract.totalHours;
      var start_date = moment(now)
      var end_date =  moment(startedTime);
      var diffMoment = moment.duration(start_date.diff(end_date));
      var Diffhours = diffMoment.asHours(); 
      var whenToEnd =  (duration - Diffhours).toFixed(2);
      if(Diffhours >= duration){
            this.openConfirmPage(6);
            this.endSessionSPError = '';
      } else {
            this.endSessionSPError = "You can end the session after " + whenToEnd + " Hours";
            console.log(this.endSessionSPError);
        } 
      console.log(Diffhours);
      // var durationInDays = duration/24;
      // var dateDiff = now.getDate() - startedTime.getDate();
      // var dateDiffInHours = dateDiff*24;
      // console.log(now.getDate(),startedTime.getDate());
      // if(dateDiff == 0){
      //   var hoursDiff = now.getHours() - startedTime.getHours()
      //   var minDiff = now.getMinutes() -  startedTime.getMinutes();
      //   var totalDiff =  hoursDiff + (minDiff/60);
      //   var whenToEnd =  (duration - totalDiff).toFixed(2);
      //   console.log(now,startedTime);
      //   console.log(totalDiff);
      //     if(totalDiff >= duration){
      //       this.openConfirmPage(6);
      //       this.endSessionSPError = '';
      //     } else {
      //       this.endSessionSPError = "You can end the session after " + whenToEnd + " Hours";
      //       console.log(this.endSessionSPError);
      //     }
      // }else {

      // }
   
      // console.log(now,startedTime);
      // console.log(totalDiff);
      //   if(totalDiff >= duration){
      //     this.openConfirmPage(6);
      //     this.endSessionSPError = '';
      //   } else {
      //     this.endSessionSPError = "You can end the session after " + whenToEnd + " Hours";
      //     console.log(this.endSessionSPError);
      //   }
   }

   createDispute(type: number){
    this.loading2 = true;
    this.changeStatus(9);
    this.disputeObj = this.disputeData;
    this.disputeType.createTime = new Date();
    this.disputeType.type = type;
    this.disputeType.active = true;
    this.disputeType.endTime = '';
    if(type == 1){
      this.disputeObj.type1 = this.disputeType;
    } else if(type == 2){
      this.disputeObj.type2 = this.disputeType;
    } else if(type == 3){
      this.disputeObj.type3 = this.disputeType;
    }
    this.disputeObj.cid = this.econtract.cid;
    this.disputeObj.latest = type;
    this.econtractService.disputeCreate(this.disputeObj).then(
      () => {
        this.loading2 = false;
        console.log("done");
      }
    )
   }

   resolveDispute(type: number){
     this.loading2 = true;
    this.econtract.disputeActive = false;
    if(this.disputeNumber == 1){
      this.pureData.disputeActive = false;
      this.disputeType.createTime = this.econtract.dispute.type1.createTime;
      this.changeStatus(4);
    } else if (this.disputeNumber == 2){
      this.pureData.disputeActive = false;
      this.disputeType.createTime = this.econtract.dispute.type2.createTime;
      this.changeStatus(5);
    } else if (this.disputeNumber == 3){
      this.disputeType.createTime = this.econtract.dispute.type3.createTime;
      this.pureData.disputeActive = false;
      this.changeStatus(8);
    }
    this.disputeType.type = type;
    this.disputeType.active = false;
    var today = new Date();
    this.disputeType.endTime = today;
    if(type == 1){
      this.disputeObj.type1 = this.disputeType;
    } else if (type == 2 ){
      this.disputeObj.type2 = this.disputeType;
    } else if (type == 3 ){
      this.disputeObj.type3 = this.disputeType;
    }
    this.disputeObj.cid = this.econtract.cid;
    this.econtractService.disputeResolve(this.disputeObj).then(
      () => {
        this.loading2 = false;
        console.log("done");
      }
    )
   }

   cancelContract(type: number){
    var disputeType = this.econtract.dispute.latest;
    this.cancelObj.time = new Date();
    this.cancelObj.fromStatus = this.econtract.status;
    this.pureData.status = type;
    this.pureData.cancelled = this.cancelObj;
    this.changeStatus(type);
   }

  
  
}
