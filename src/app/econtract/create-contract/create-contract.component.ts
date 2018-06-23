import { Component, OnInit,ViewChild } from '@angular/core';
import { EcontractService } from 'app/firebase/econtract.service';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {DatePickerComponent} from 'ng2-date-picker';
import { Subject } from 'rxjs/Subject'
import { AuthService } from 'app/core/auth.service';
import { Router } from '@angular/router';
import { LogsService } from '../../firebase/logs.service';


@Component({
  selector: 'create-contract',
  templateUrl: './create-contract.component.html',
  styleUrls: ['./create-contract.component.scss']
})
export class CreateContractComponent implements OnInit {
  ServiceProvier: any= {}
  startDateForCheck: any = {}
  startTimeForCheck: any = {}
  contract: any = {}
  title: any ;
  amount: number; 
  startDate: any;
  startTime: any;
  endDate: any;
  endTime: any;
  ServiceConsumerPhone: any;
  ServiceProviderPhone: any;
  scName: any;
  spName: any;
  shareLink: any;
  userForm: FormGroup;
  config = {};
  titleError: string;
  amountError: string;
  startTimeError: string;
  startDateError: string;
  endTimeError : string;
  endDateError: string;
  PhoneNumberSCError : string;
  PhoneNumberSPError: string ;
  notValid: boolean = false;
  today: any = {};
  totalHours: number;
  totalHoursError: string = '';
  terms: boolean = false;
  sc: any;
  sp: any;
  startAt = new Subject()
  endAt = new Subject()
  lastKeypress: number = 0;
  searchInput: number;
  gotUser : boolean = false;
  usernotexist: boolean = false;
  displayStartTime: string;
  displayEndTime: string;
  lastStep: boolean = false;
  loading: boolean;
  userType: number;
  disabledButton : boolean = true;
  inBetween: number = 50;
  afterSession: number = 50;
  disputeRules: any = {};
  constructor(public econtractService: EcontractService , public auth: AuthService , public router: Router, logsService: LogsService) { }

  ngOnInit() {
    if(!this.auth._user.phoneVerified){
      this.router.navigateByUrl('/verify');
    }
    this.auth.showBack = true;
    this.inBetween = 50;
    this.afterSession = 50;
    // this.econtractService.getUsersData(this.startAt,this.endAt).valueChanges().subscribe(
    //   (data) =>{
    //     this.users = data;
    //   }
    // )
  }

  userTypeChecker(){
    this.sc = {};
    this.sp = {};
    this.gotUser = false;
    this.usernotexist = false;
    this.PhoneNumberSCError = '';
    this.PhoneNumberSPError = '';
    this.ServiceConsumerPhone = undefined;
    this.ServiceProviderPhone = undefined;
    this.disabledButton = false;
    console.log(this.userType);
  }
  @ViewChild('dayPicker') datePicker: DatePickerComponent;

  searchSC($event: any) {
     var phone = this.ServiceConsumerPhone;
     var PhoneString = (""+phone);
     var Phonelenght = PhoneString.length;
     this.sc = {};
     this.gotUser = false;
     this.usernotexist = false;
      if(Phonelenght == 10){
        this.getUsersDate(phone,1);
       } 
  }
  searchSP($event: any) {
    var phone = this.ServiceProviderPhone;
    var PhoneString = (""+phone);
    var Phonelenght = PhoneString.length;
    this.sc = {};
    this.gotUser = false;
    this.usernotexist = false;
     if(Phonelenght == 10){
       this.getUsersDate(phone,2);
      } 
 }
  triggerSearch(type: number){
    var phone = this.ServiceConsumerPhone;
    var PhoneString = (""+phone);
    var Phonelenght = PhoneString.length;
    this.sc = {};
    this.gotUser = false;
    this.usernotexist = false;
     if(Phonelenght == 10){
       this.getUsersDate(phone,1);
      } else {
        this.PhoneNumberSCError = 'Number should be 10 digits long'
      }
  }
  getUsersDate(q: any , type: number){
    this.PhoneNumberSCError = '';
    this.gotUser = false;
    this.scName = '';
    this.spName = '';
    this.usernotexist = false;
    this.loading = true;
    if(type == 1){
      this.econtractService.getUsersData(q).subscribe(
        (data)=>{
          console.log(data,data.length);
          if(data.length == 1){
            this.sc = data[0];
            if(this.sc.phone == this.auth._user.phone){
              this.PhoneNumberSCError = "Opps..it's your number ! Contract with yourself ? Nahh";
              console.log("same phone")
              this.notValid = true;
            } else {
              this.gotUser = true;
              this.usernotexist = false;
              this.PhoneNumberSCError = "";
              console.log(this.sc.displayName,"SC Name");
              this.scName = this.sc.displayName;
            }
          
          } else {
            this.usernotexist = true;
            this.PhoneNumberSCError = "";
            this.gotUser = false;
          }
          this.loading = false;
          console.log(this.sc);
        }
      );
    } else if (type == 2){
      this.econtractService.getUsersData(q).subscribe(
        (data)=>{
          console.log(data,data.length);
          if(data.length == 1){
            this.sp = data[0];
            if(this.sp.phone == this.auth._user.phone){
              this.PhoneNumberSPError = "Opps..it's your number ! Contract with yourself ? Nahh";
              console.log("same phone")
              this.notValid = true;
            } else {
              this.gotUser = true;
              this.usernotexist = false;
              this.PhoneNumberSPError = "";
              console.log(this.sp.displayName,"SP Name");
              this.spName = this.sp.displayName;
            }
          
          } else {
            this.usernotexist = true;
            this.PhoneNumberSPError = "";
            this.gotUser = false;
          }
          this.loading = false;
          console.log(this.sc);
        }
      );
    }
  
  }
  open() {
      this.datePicker.api.open();
  }

  close() {
       this.datePicker.api.close();
  }
   convertTime12to24(time12h : any) {
    const [time, modifier] = time12h.split(' ');
  
    let [hours, minutes] = time.split(':');
  
    if (hours === '12') {
      hours = '00';
    }
  
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
  
    return hours + ':' + minutes;
  }

  create(){
    if(this.startTime){
      this.displayStartTime = this.startTime;
      this.startTime = this.convertTime12to24(this.startTime);
    }
    // if(this.endTime){
    //   this.displayEndTime = this.endTime;
    //   this.endTime = this.convertTime12to24(this.endTime);
    // }
    if((this.sc.phone != this.ServiceConsumerPhone) && !this.usernotexist){
      this.triggerSearch(1);
    }

   
    console.log(this.startTime);
    this.evaluationOfContract();
      console.log(this.notValid);
      if(!this.notValid && (this.gotUser || this.usernotexist)){
        console.log("Last step to true");
        this.lastStep = true;
      }
    
  
    // this.econtractService.createEcontract(this.contract);
  }
  confirm(){
    this.updateDatabase();
    this.lastStep = false;
    if (this.userType == 2){
      this.disputeRules.inBetween = this.inBetween;
      this.disputeRules.afterSession = this.afterSession;
      this.contract.disputeRules = this.disputeRules;
    }
    this.econtractService.createEcontract(this.contract);
  }
  updateDatabase() {
    var today = new Date();
    this.contract.title = this.title;
    this.contract.amount = this.amount;
    this.contract.startDate = this.startDate;
    this.contract.startTime = this.startTime;
    // this.contract.endDate = this.endDate;
    // this.contract.endTime = this.endTime;
    this.contract.newTotalHours = false;
    this.contract.newStartDate = false;
    this.contract.newAmount = false;
    this.contract.newStartTime = false;
    if(this.userType != 1 && this.userType != 2){
      this.notValid = true;
    }
    if(this.userType == 1){
      this.contract.scPhone = this.ServiceConsumerPhone;
      this.contract.spPhone = this.auth._user.phone;
      this.contract.sp = this.auth._user.uid;
      this.contract.spName =  this.auth._user.displayName;
      this.contract.scName = this.scName;
      this.contract.status = 0;
      if(this.gotUser == true){
        this.contract.sc = this.sc.uid;
      } 
      if(this.usernotexist == true){
        this.contract.sc = null;
      }
    } else if (this.userType == 2 ){
      this.contract.scPhone = this.auth._user.phone;
      this.contract.spPhone = this.ServiceProviderPhone;
      this.contract.spName = this.spName;
      this.contract.sc = this.auth._user.uid;
      this.contract.scName = this.auth._user.displayName;
      this.contract.status = 16;
      if(this.gotUser == true){
        this.contract.sp = this.sp.uid;
      } 
      if(this.usernotexist == true){
        this.contract.sp = null;
      }
    }
    this.contract.totalHours = this.totalHours;
    this.contract.createTime = today;
    this.contract.newTotalHours = false;
    this.contract.newStartDate = false;
    this.contract.newAmount = false;
    this.contract.disputeRules = {};
 
    this.contract.active = 1;
    
    console.log(this.contract);
  }
  currentDateTime() {
    var todayDate = new Date();
    this.today.hours =  todayDate.getHours();
    this.today.minutes = todayDate.getMinutes();
    this.today.dateString = todayDate.toLocaleDateString(); 
    this.today.date = todayDate.getDate();
    this.today.month = todayDate.getMonth() + 1;
    this.today.year = todayDate.getFullYear();
    console.log(this.today);
  }
  evaluationOfContract(){
    this.titleError = '';
    this.amountError = '';
    this.startTimeError = '';
    this.startDateError = '';
    this.endDateError = '';
    this.endTimeError ='';
    this.PhoneNumberSCError = '';
    this.totalHoursError= '';
    this.notValid = false;

    if(!this.title){
      this.titleError = "Please Enter a title";
      this.notValid = true;
    } else if (this.title.lenght < 5) {
      this.notValid = true;
      this.titleError = "The lenght of the title should be greater then 5";
    }

    if(!this.amount){
      this.notValid = true;
      this.amountError = "Please Enter a amount"
    } else if(this.amount < 150) {
      this.notValid = true;
      this.amountError = "The amount should be greater then Rs.150";
    }
    if(!this.totalHours){
      this.notValid = true;
      this.totalHoursError = 'Please Enter total number of hours work';
    } else if(this.totalHours < 1){
      this.totalHoursError = 'Work time should me minimum 1hour long'
    }

    if(!this.startDate){
      this.notValid = true;
      this.startDateError = "Please Enter a starting Date";
    } else if(!this.startDateChecker(this.startDate)){
      this.notValid = true;
      this.startDateError = "You can't go into past :-P";
    } else {
      if(!this.startTime){
        this.notValid = true;
        this.startTimeError = "Please Enter a starting time";
      } else if (this.currentDateIsSameAsToday(this.startDate)){
        if(!this.startTimeChecker(this.startTime)){
          this.notValid = true;
          this.startTimeError = "Please select a time atleast 5mins after from current time";
        }
      }
     

      // if(!this.endDate){
      //   this.notValid = true;
      //   this.endDateError = "Please Enter a Ending Date";
      // } else if(!this.endDateChecker(this.endDate,this.startDate)){
      //   this.notValid = true;
      //   this.endDateError = "Your ending date should be greater then or equal to starting date";
      // } else if(this.sameDateChecker(this.endDate,this.startDate)){
      //   if(!this.endTime){
      //     this.notValid = true;
      //     this.endTimeError = "Please select a ending time";
      //   } else if (!this.endTimeChecker(this.endTime,this.startTime)){
      //     this.notValid = true;
      //     this.endDateError = "Ending time should be greater then starting time"
      //   } else if (!this.totalTimeIsValid(this.endTime,this.startTime)){
      //     this.notValid = true;
      //     this.endDateError = "The Session should be atleast 1hour long";
      //   } 
      // }
      // if(!this.endTime){
      //   this.notValid = true;
      //   this.endTimeError = "Please select a ending time";
      // }
    }

    if(this.userType == 1){
      if(!this.ServiceConsumerPhone) {
        this.notValid = true;
        this.PhoneNumberSCError = "Please Enter Service Consumer Phone Number";
      } else if(this.ServiceConsumerPhone.lenght){
        this.notValid = true;
        this.PhoneNumberSCError ="Phone Number Should be greater then 9 digits atleast";
      }
    } else if (this.userType == 2){
      if(!this.ServiceProviderPhone) {
        this.notValid = true;
        this.PhoneNumberSPError = "Please Enter Service Consumer Phone Number";
      } else if(this.ServiceProviderPhone.lenght){
        this.notValid = true;
        this.PhoneNumberSPError ="Phone Number Should be greater then 9 digits atleast";
      }
    }
   
    
  }

  currentDateIsSameAsToday(startDate: any) {
    var today = new Date(this.today.dateString);
    var todayDate = today.toLocaleDateString();
    var inputGiven = new Date(startDate);
    var inputDate = inputGiven.toLocaleDateString();
    console.log(todayDate , inputDate)
      if(todayDate == inputDate){
        console.log("Its the Same date");
        return true;
      } else {
        console.log("Its not the same date")
        return false;
      }
  }
  totalTimeIsValid(endTime: any , startTime: any){
    var hms = startTime   
    var a = hms.split(':'); 
    var minutes = (+a[1]);
    var hours = (+a[0]); 

    var ehms = endTime;   
    var ea = ehms.split(':'); 
    var endMinutes = (+ea[1]);
    var endHours = (+ea[0]); 
    
    var hourDiffernce = endHours - hours;
    var minutesDiffernce = endMinutes - minutes ; 
    var totalTime = (hourDiffernce * 60 ) + minutesDiffernce ;

    if(totalTime < 60) {
      return false;
    } else {
      return true ;
    }


  }
  sameDateChecker(endDate: any , startDate: any){
    if(endDate == startDate){
      console.log('same date');
      return true;
    } else {
      return false ;
    }

  }
  endTimeChecker(endTime: any , startTime: any){
    var hms = startTime   
    var a = hms.split(':'); 
    var minutes = (+a[1]);
    var hours = (+a[0]); 

    var ehms = endTime;   
    var ea = ehms.split(':'); 
    var endMinutes = (+ea[1]);
    var endHours = (+ea[0]); 
    
    var validState = true;
    if(hours > endHours) {
      validState = false;
    } else if (hours == endHours){
      if(minutes > endMinutes) {
        validState = false;
      }
    }
    return validState;
  }
  endDateChecker(endDate: any , startDate: any){
    var inputDate = new Date(endDate);
    var year = inputDate.getFullYear();
    var month = inputDate.getMonth() + 1;
    var date = inputDate.getDate();

    var startDateInput = new Date(startDate);
    var startHour =  startDateInput.getHours();
    var startMinutes = startDateInput.getMinutes();
    this.today.dateString = startDateInput.toLocaleDateString(); 
    var startCalcDate = startDateInput.getDate();
    var startMonth = startDateInput.getMonth() + 1;
    var startYear = startDateInput.getFullYear();
    var validState = true;
    if(startYear > year) {
      validState = false ;
      
    } else if (startMonth > month) {
      validState = false;
    } else if (startCalcDate > date && startMonth >= month){
      validState = false;
    }
    return validState;
  }
  startDateChecker(startDate: any){
    this.currentDateTime();
    var inputDate = new Date(startDate);
    var year = inputDate.getFullYear();
    var month = inputDate.getMonth()+1;
    var date = inputDate.getDate();
    var validState = true;
    console.log(year,month,date);
    console.log(this.today);
    if(this.today.year > year) {
      validState = false ;
    } else if (this.today.month > month) {
      validState = false;
    } else if (this.today.month == month && this.today.date > date){
      validState = false;
    }
    return validState;
  }
  startTimeChecker(startTime : any){
    this.currentDateTime();
    console.log(startTime)
    var hms = startTime;   
    var a = hms.split(':'); 
    var minutes = (+a[1]);
    var hours = (+a[0]); 
    var validState = true;
    console.log(this.today.hours);
    if(this.today.hours > hours) {
      console.log('check');
      validState = false;
    } else if(this.today.hours == hours){
     if (this.today.minutes > minutes) {
        validState = false ;
      } 
    } 
    return validState;
  }
}
