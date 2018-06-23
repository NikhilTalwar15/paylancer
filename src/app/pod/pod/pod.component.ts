import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/core/auth.service';
import { EcontractService } from 'app/firebase/econtract.service';
import { Router } from '@angular/router';
import { MessagingService } from '../../messaging.service';
import { PodService } from '../../firebase/pod.service';


@Component({
  selector: 'pod',
  templateUrl: './pod.component.html',
  styleUrls: ['./pod.component.scss']
})
export class PodComponent implements OnInit {
  loading: boolean = true;
  loading2: boolean = true;
  mainArray: any = [];
  logoBase: string = "../../assets/images/main/";
  message: any;
  orderlist: any = [];
  constructor(public auth: AuthService,public podService: PodService , public router: Router, private msgService: MessagingService) { }


  ngOnInit() {
    this.loading = true;
    if(!this.auth._user.phoneVerified){
      this.router.navigateByUrl('/verify');
    }
    this.podService.getOrderDataList().subscribe(
      (data) => {
        console.log(data);
        this.orderlist = data;
        this.loading = false;
      }
    )
  }

}
