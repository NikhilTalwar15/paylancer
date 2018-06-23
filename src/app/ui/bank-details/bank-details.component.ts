import { Component, OnInit } from '@angular/core';
import { BankService } from '../../firebase/bank.service';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.scss']
})
export class BankDetailsComponent implements OnInit {

  bankDetails: any = {};
  bankNameError: string = '';
  userNameError: string = '';
  accountError: string = '';
  ifcError: string = '';
  valid : boolean = false;
  loading: boolean ;
  constructor(public bankService: BankService, public auth: AuthService , public router: Router) { }

  ngOnInit() {
    if(!this.auth._user.phoneVerified){
      this.loading = false;
      this.router.navigateByUrl('/verify');
    }
    this.auth.showBack = true;
    this.loading = true;
   this.getBankData();
  }

  getBankData(){
   var obj = this.bankService.getBankDetails().subscribe(
      (data)=> {
        console.log(data);
        if(data){
          this.bankDetails = data;
          console.log(this.bankDetails);
        };
        this.loading = false;
      });
  }
  saveDetails(){
    this.valid = true;
    if(!this.bankDetails.bankName){
      this.bankNameError = "Please Enter A Bank Name";
      this.valid = false;
    }
    if(!this.bankDetails.userName){
      this.userNameError = "Please Enter User Name";
      this.valid = false;
    }
    if(!this.bankDetails.accountNo){
      this.accountError = "Please Enter account number";
      this.valid = false;
    }
    if(!this.bankDetails.ifcCode){
      this.ifcError = "Please Enter IFC Code of Your Bank";
      this.valid = false;
    }
    if(this.valid){
      if(this.auth._user.bankDetails){
        this.bankService.updateBankDetails(this.bankDetails);
      }else {
        this.bankService.addBankDetails(this.bankDetails);
      }
    }
  }

}
