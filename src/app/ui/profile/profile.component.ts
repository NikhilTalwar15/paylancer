import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  male: boolean = true;
  female: boolean = false;
  gender: string;
  displayName: string ;
  nameError: string;
  dataobj: any = {};
  profession: string = '';
  loading: boolean;
  constructor(public auth: AuthService , public router: Router) { }

  ngOnInit() {
    this.auth.showBack = true;
    if(!this.auth._user.phoneVerified){
      this.router.navigateByUrl('/verify');
    }
    this.loading = true;
    this.auth.globalLoader = false;
    this.setMale();
    this.displayName = this.auth._user.displayName;
    this.gender = this.auth._user.gender;
    this.profession = this.auth._user.profession;
    if(this.gender == "Male"){
      this.setMale();
    }else {
      this.setFemale();
    }
    this.loading = false;
  }
  setMale(){
    this.male = true;
    this.female = false;
    this.gender = "Male";
  }
  setFemale(){
    this.male = false;
    this.female = true;
    this.gender = "Female";
  }

  submitDetails(){
    if(!this.displayName){
      this.nameError = "";
      this.nameError = "Please Enter you name";
    } else if (this.displayName.length <= 3){
      this.nameError = "";
      this.nameError = "Your Name should have alteast 4 charaters";
    } else {
      this.loading = true;
      this.nameError = "";
      this.dataobj = this.auth._user;
      this.dataobj.displayName = this.displayName;
      this.dataobj.profession = this.profession;
      this.dataobj.gender = this.gender;
      console.log(this.dataobj);
      this.auth.updateToUserData(this.dataobj).then(
        () => {
          this.loading = false;
          this.router.navigateByUrl('/');
        }
      )

    }
  }


}
