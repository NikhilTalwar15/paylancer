import { Component, OnInit,ViewChild } from '@angular/core';
import { EcontractService } from 'app/firebase/econtract.service';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {DatePickerComponent} from 'ng2-date-picker';
import { Subject } from 'rxjs/Subject';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'app/core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  ServiceProvier: any= {}
  startDateForCheck: any = {}
  startTimeForCheck: any = {}
  contract: any = {}
  title: any ;
  amount: number; 
  startDate: any;
  startTime: any;
  namount: number; 
  nstartDate: any;
  nstartTime: any;
  ntotalHour: any;
  endDate: any;
  endTime: any;
  ServiceConsumerPhone: any;
  scName: any;
  shareLink: any;
  userForm: FormGroup;
  config = {};
  titleError: string;
  amountError: string;
  startTimeError: string;
  startDateError: string;
  endTimeError : string;
  endDateError: string;
  PhoneNumberError : string;
  notValid: boolean = false;
  today: any = {};
  totalHours: number;
  totalHoursError: string = '';
  cid: any= {};
  econtract: any = {};
  oldEcontract: any = {};
  loading: boolean;
  sc: any;
  startAt = new Subject()
  endAt = new Subject()
  lastKeypress: number = 0;
  searchInput: number;
  gotUser : boolean = false;
  usernotexist: boolean = false;
  displayStartTime: string;
  displayEndTime: string;
  lastStep: boolean = false;
  newEcontract: any = {};
  anyChanges: boolean = false;
  changesError: string;
  constructor(public router: Router,public activedRoute: ActivatedRoute ,public econtractService: EcontractService , public auth: AuthService) { }

  ngOnInit() {
    // this.econtractService.getUsersData(this.startAt,this.endAt).valueChanges().subscribe(
    //   (data) =>{
    //     this.users = data;
    //   }
    // )
    this.loading = true;
    this.activedRoute.params.subscribe(
      (value)=>{
        this.cid = value.cid;
        this.fetchEcontractData();
        console.log(value);
      }
    )
    
  }
  fetchEcontractData(){
    this.econtractService.getContractData(this.cid).subscribe(
      (data)=>{
        console.log(data);
        this.econtract = data;
        this.oldEcontract = data;
        this.newEcontract = data;
        this.econtract.backUrl = "/econtract/"+this.econtract.cid;
        this.title = this.econtract.title;
        this.startDate = this.econtract.startDate;
        this.startTime = this.econtract.startTime;
        this.amount = this.econtract.amount;
        this.totalHours = this.econtract.totalHours;
        this.ServiceConsumerPhone = this.econtract.scPhone;
        this.editingIntit();
        if(this.econtract){
          this.whoAreYou();
        } else {
          this.router.navigateByUrl('/');
        }
      return;
      }
    )
  }
  whoAreYou(){
      if(this.auth._user.uid == this.econtract.sc){
        if(this.econtract.status == 0 || this.econtract.status == 16){
          this.loading = false;
        } else {
          this.loading = false;
          this.router.navigateByUrl('/');
        }
      } else {
        this.loading = false;
        this.router.navigateByUrl('/');
      }
    }
  @ViewChild('dayPicker') datePicker: DatePickerComponent;

  search($event: any) {
     var phone = this.ServiceConsumerPhone;
     var PhoneString = (""+phone);
     var Phonelenght = PhoneString.length;
      if(Phonelenght == 10){
        this.getUsersDate(phone);
       } 
  }
  getUsersDate(q: any){
    this.PhoneNumberError = '';
    this.gotUser = false;
    this.scName = '';
    this.usernotexist = false;
    this.econtractService.getUsersData(q).subscribe(
      (data)=>{
        console.log(data,data.length);
        if(data.length == 1){
          this.sc = data[0];
          if(this.sc.phone == this.auth._user.phone){
            this.PhoneNumberError = "Opps..it's your number ! Contract with yourself ? Nahh";
            console.log("same phone")
            this.notValid = true;
          } else {
            this.gotUser = true;
            console.log(this.sc.displayName,"SC Name");
            this.scName = this.sc.displayName;
          }
        
        } else {
          this.usernotexist = true;
        }
        console.log(this.sc);
      }
    );
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
    console.log(this.startTime);
    this.evaluationOfContract();
    this.updateDatabase();
      console.log(this.notValid);
      if(!this.notValid && this.anyChanges){
        console.log("Last step to true");
        this.lastStep = true;
      }else if (!this.anyChanges){
        this.changesError ="There are no changes made";
      }
    
  
    // this.econtractService.createEcontract(this.contract);
  }
  editingIntit(){
    this.namount = this.amount;
    this.nstartDate = this.startDate;
    this.nstartTime = this.startTime;
    this.ntotalHour = this.totalHours;
  }
  confirm(){
    this.updateDatabase();
    this.lastStep = false;
    if(this.newEcontract.status == 0){
      this.newEcontract.status = 2;
    } else if (this.newEcontract.status == 16){
      this.newEcontract.status = 19;
    }
   
    this.econtractService.updateEditEcontract(this.newEcontract);
  }
  updateDatabase() {
    var today = new Date();
    this.anyChanges = false;
    console.log("blah blah");
   
    this.newEcontract.amount = this.amount;
    this.newEcontract.startDate = this.startDate;
    this.newEcontract.startTime = this.startTime;
    this.newEcontract.title = this.title;
    this.newEcontract.totalHours = this.totalHours;

    this.newEcontract.newTotalHours = false;
    this.newEcontract.newStartDate = false;
    this.newEcontract.newAmount = false;
    this.newEcontract.newStartTime = false;

    if(this.newEcontract.amount !== this.namount){
      this.newEcontract.newAmount = true;
      this.anyChanges = true;
  
    }
    if(this.newEcontract.startDate !== this.nstartDate){
      this.newEcontract.newStartDate = true;
      this.anyChanges = true;
    }
    if(this.newEcontract.startTime !== this.nstartTime){
      this.newEcontract.newStartTime = true;
      this.anyChanges = true;
    }
    if(this.newEcontract.totalHours !== this.ntotalHour){
      this.newEcontract.newTotalHours = true;
      this.anyChanges = true;
    }
    console.log(this.oldEcontract);
    console.log(this.newEcontract);
    console.log(this.namount);
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
    this.PhoneNumberError = '';
    this.notValid = false;

    // if(!this.title){
    //   this.titleError = "Please Enter a title";
    //   this.notValid = true;
    // } else if (this.title.lenght < 5) {
    //   this.notValid = true;
    //   this.titleError = "The lenght of the title should be greater then 5";
    // }

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

    // if(!this.ServiceConsumerPhone) {
    //   this.notValid = true;
    //   this.PhoneNumberError = "Please Enter Service Consumer Phone Number";
    // } else if(this.ServiceConsumerPhone.lenght){
    //   this.notValid = true;
    //   this.PhoneNumberError ="Phone Number Should be greater then 9 digits atleast";
    // }
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
    } else if (this.today.date > date){
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
