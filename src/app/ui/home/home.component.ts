import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/core/auth.service';
import { EcontractService } from 'app/firebase/econtract.service';
import { Router } from '@angular/router';
import { MessagingService } from '../../messaging.service';
import { PodService } from '../../firebase/pod.service';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  SCecontracts: any ;
  SPecontracts: any ;
  loading1: boolean = true;
  loading2: boolean = true;
  loading3: boolean = true;
  mainArray: any = [];
  logoBase: string = "../../assets/images/main/";
  message: any;
  orderlist: any;

  constructor(public podService: PodService ,public auth: AuthService,public econtractService: EcontractService , public router: Router, private msgService: MessagingService) { }

  ngOnInit() {
    if(!this.auth._user.phoneVerified){
      this.router.navigateByUrl('/verify');
    }
    this.loading3 = true;
    if(!this.auth._user.phoneVerified){
      this.router.navigateByUrl('/verify');
    }
    this.podService.getOrderDataList().subscribe(
      (data) => {
        console.log(data);
        this.orderlist = data;
        this.loading3 = false;
      }
    )
    this.msgService.getPermission()
    this.msgService.receiveMessage()
    this.message = this.msgService.currentMessage
    this.mainArray = [];
    this.auth.showBack = false;
    this.loading1 = true;
    this.loading2 = true;
    console.log(this.auth._user);
    this.econtractService.getUsersAllSC(1).subscribe(
      (list) => {
        this.SCecontracts = list;
        if(this.SCecontracts.length == 0){
          this.loading1 = false;
        }
        console.log("SCecontracts")
        for(var i =0 ; i < this.SCecontracts.length; i++){
          if(this.SCecontracts[i].cid){
            this.SCecontracts[i].url =  'econtract/'+this.SCecontracts[i].cid;

          if(this.auth._user.uid == this.SCecontracts[i].sc){
            //You are SC so fetch SP name
            this.SCecontracts[i].showName = this.SCecontracts[i].spName;
            this.loading1 = false;
            this.uiDataAdderSC();
            this.createMainArray(this.SCecontracts);
            console.log(this.SCecontracts);
          } else if(this.auth._user.phone == this.SCecontracts[i].scPhone && !this.SCecontracts[i].sc){
            console.log('This is true');  
            this.SCecontracts[i].sc = this.auth._user.uid;
            this.SCecontracts[i].scName = this.auth._user.displayName;
            this.econtractService.updateSCData(this.SCecontracts[i]).then(
              ()=>{
                this.loading1 = false;
                this.uiDataAdderSC();
                this.createMainArray(this.SCecontracts);
                console.log(this.SCecontracts);
              }
            );
          }
        }
        this.loading1 = false;
          }
      }
    );
    this.econtractService.getUsersAllSP(1).subscribe(
      (list) => {
        this.SPecontracts = list;
        if(this.SPecontracts.length == 0){
          this.loading2 = false;
        }
        console.log(this.SPecontracts);
        for(var i =0 ; i < this.SPecontracts.length; i++){
          if(this.SPecontracts[i].cid){
            this.SPecontracts[i].url =  'econtract/'+this.SPecontracts[i].cid;
            if(this.auth._user.uid == this.SPecontracts[i].uid){
              //You are Sp so fetch SC name
              this.SPecontracts[i].showName = this.SPecontracts[i].scName;
              this.loading2 = false;
              console.log(this.SPecontracts);
            }else if(this.auth._user.phone == this.SPecontracts[i].spPhone && !this.SPecontracts[i].sp){
              this.loading2 = true;
              this.SPecontracts[i].sp = this.auth._user.uid;
              this.SPecontracts[i].spName = this.auth._user.displayName;
              this.econtractService.updateSPData(this.SPecontracts[i]).then(
                () => {
                  this.loading2 = false;
                  this.uiDataAdderSP();
                  this.createMainArray(this.SPecontracts);
                }
              )
            }
          }
          this.loading2 = false;
          this.uiDataAdderSP();
          this.createMainArray(this.SPecontracts);
          
          console.log(list);
          }
      }
    );

  }

  createMainArray(array: any){
    // this.mainArray =  this.mainArray.concat(array);
    // console.log("Main Array");
    // console.log(this.mainArray);
    // console.log("Main Array");
  }

  uiDataAdderSP(){
    var status;
    for(var i =0 ; i < this.SPecontracts.length; i++){
      status = this.SPecontracts[i].status;
      if(status == 0){
        this.SPecontracts[i].statusMessage = "Waiting to accept";
        this.SPecontracts[i].logoUrl = this.logoBase +"grey_c.svg";
      } else if(status == 1){
        this.SPecontracts[i].statusMessage = "Accepted ! Waiting for payment";
        this.SPecontracts[i].logoUrl = this.logoBase +"blue_c.svg";
      } else if(status == 2){
        this.SPecontracts[i].statusMessage = "Changes are made ! Please Review";
        this.SPecontracts[i].logoUrl = this.logoBase +"grey_c.svg";
      } else if(status == 3){
        this.SPecontracts[i].statusMessage = "Contract is rejected";
        this.SPecontracts[i].logoUrl = this.logoBase + "red_c.svg";
      }else if(status == 4){
        this.SPecontracts[i].statusMessage = "Payment is Done !";
        this.SPecontracts[i].logoUrl = this.logoBase + "green_c.svg";
      } else if(status == 5){
        this.SPecontracts[i].statusMessage = "Session has been started";
        this.SPecontracts[i].logoUrl = this.logoBase + "blue_c.svg";
      }else if(status == 6){
        this.SPecontracts[i].statusMessage = "Session is being ended ! Waiting for Approval";
        this.SPecontracts[i].logoUrl = this.logoBase + "grey_c.svg";
      }else if(status == 7){
        this.SPecontracts[i].statusMessage = "SC has ended the session ! Payment will be done in 3days";
        this.SPecontracts[i].logoUrl = this.logoBase + "green_c.svg";
      }else if(status == 8){
        this.SPecontracts[i].statusMessage = "SC Arroved ! Payment will be done in 3days";
        this.SPecontracts[i].logoUrl = this.logoBase + "green_c.svg";
      }else if(status == 9){
        this.SPecontracts[i].statusMessage = "There is a dispute";
        this.SPecontracts[i].logoUrl = this.logoBase + "red_c.svg";
      }else if(status == 11){
        this.SPecontracts[i].statusMessage = "Contract was cancelled before start session ";
        this.SPecontracts[i].logoUrl = this.logoBase + "red_c.svg";
      }else if(status == 12){
        this.SPecontracts[i].statusMessage = "Contract was cancelled in between !";
        this.SPecontracts[i].logoUrl = this.logoBase + "red_c.svg";
      }else if(status == 13){
        this.SPecontracts[i].statusMessage = "Contract was cancelled after the session ! ";
        this.SPecontracts[i].logoUrl = this.logoBase + "red_c.svg";
      }else if(status == 14){
        this.SPecontracts[i].statusMessage = "Contract was cancelled by Paylancer !";
        this.SPecontracts[i].logoUrl = this.logoBase + "red_c.svg";
      } else if (status == 15){
        this.SPecontracts[i].statusMessage = "SC Created The Rules ! Review it" ;
        this.SPecontracts[i].logoUrl = this.logoBase + "grey_c.svg";
      }else if (status == 16){
        this.SPecontracts[i].statusMessage = "Waiting For SP To Accept" ;
        this.SPecontracts[i].logoUrl = this.logoBase + "grey_c.svg";
      }else if (status == 17){
        this.SPecontracts[i].statusMessage = "Waiting for payment" ;
        this.SPecontracts[i].logoUrl = this.logoBase + "blue_c.svg";
      }
      
    }
  }

  uiDataAdderSC(){
    var status;
    for(var i =0 ; i < this.SCecontracts.length; i++){
      status = this.SCecontracts[i].status;
      if(status == 0){
        this.SCecontracts[i].statusMessage = "Waiting to accept";
        this.SCecontracts[i].logoUrl = this.logoBase + "grey_c.svg";
      } else if(status == 1){
        this.SCecontracts[i].statusMessage = "Accepted ! Waiting for payment";
        this.SCecontracts[i].logoUrl = this.logoBase + "blue_c.svg";
      } else if(status == 2){
        this.SCecontracts[i].statusMessage = "You made some changes ! Waiting to accept";
        this.SCecontracts[i].logoUrl = this.logoBase + "grey_c.svg";
      } else if(status == 3){
        this.SCecontracts[i].statusMessage = "Contract is rejected";
        this.SCecontracts[i].logoUrl = this.logoBase + "red_c.svg";
      }else if(status == 4){
        this.SCecontracts[i].statusMessage = "Payment is Done !";
        this.SCecontracts[i].logoUrl = this.logoBase + "green_c.svg";
      } else if(status == 5){
        this.SCecontracts[i].statusMessage = "Session has been started";
        this.SCecontracts[i].logoUrl = this.logoBase + "blue_c.svg";
      }else if(status == 6){
        this.SCecontracts[i].statusMessage = "Session is being ended ! Waiting for Approval";
        this.SCecontracts[i].logoUrl = this.logoBase + "grey_c.svg";
      }else if(status == 7){
        this.SCecontracts[i].statusMessage = "SC has ended the session ! Payment will be done in 3days";
        this.SCecontracts[i].logoUrl = this.logoBase + "green_c.svg";
      }else if(status == 8){
        this.SCecontracts[i].statusMessage = "SC Arroved ! Payment will be done in 3days";
        this.SCecontracts[i].logoUrl = this.logoBase + "green_c.svg";
      }else if(status == 9){
        this.SCecontracts[i].statusMessage = "There is a dispute";
        this.SCecontracts[i].logoUrl = this.logoBase + "red_c.svg";
      }else if(status == 11){
        this.SCecontracts[i].statusMessage = "Contract was cancelled before start session ";
        this.SCecontracts[i].logoUrl = this.logoBase + "red_c.svg";
      }else if(status == 12){
        this.SCecontracts[i].statusMessage = "Contract was cancelled in between ! 50% will be given";
        this.SCecontracts[i].logoUrl = this.logoBase + "red_c.svg";
      }else if(status == 13){
        this.SCecontracts[i].statusMessage = "Contract was cancelled after the session ! 50% will be given";
        this.SCecontracts[i].logoUrl = this.logoBase + "red_c.svg";
      }else if(status == 14){
        this.SCecontracts[i].statusMessage = "Contract was cancelled by Paylancer ! 50% will be given";
        this.SCecontracts[i].logoUrl = this.logoBase + "red_c.svg";
      }else if (status == 15){
        this.SCecontracts[i].statusMessage = "Rules were set ! Waiting to approval" ;
        this.SCecontracts[i].logoUrl = this.logoBase + "grey_c.svg";
      }else if (status == 16){
        this.SCecontracts[i].statusMessage = "Waiting For SP To Accept" ;
        this.SCecontracts[i].logoUrl = this.logoBase + "grey_c.svg";
      }else if (status == 17){
        this.SCecontracts[i].statusMessage = "Waiting for payment" ;
        this.SCecontracts[i].logoUrl = this.logoBase + "blue_c.svg";
      }
      
    }
  }
}
