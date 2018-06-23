import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/core/auth.service';
import { EcontractService } from 'app/firebase/econtract.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessagingService } from '../../messaging.service';
import { PodService } from '../../firebase/pod.service';

declare let paypal: any;
@Component({
  selector: 'orderpage',
  templateUrl: './orderpage.component.html',
  styleUrls: ['./orderpage.component.scss']
})
export class OrderpageComponent implements OnInit {
  loading: boolean;
  oid: any;
  orderData: any = {};
  confirmPage: boolean;
  newStatusValue : number ;

  constructor(public auth: AuthService, public activedRoute: ActivatedRoute, public podService: PodService , public router: Router, private msgService: MessagingService) { }
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
            { amount: { total: this.orderData.cost, currency: 'INR' } }
          ]
        }
      });
    },
    onAuthorize: (data: any, actions: any) => {
      return actions.payment.execute().then((payment: any) => {
        //Do something when payment is successful.
        this.updateStatusValue(2);
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
    this.loading = true;
    this.confirmPage = false;
    if(!this.auth._user.phoneVerified){
      this.router.navigateByUrl('/verify');
    }
    this.auth.showBack = true;
    this.loading = true;
    this.activedRoute.params.subscribe(
      (value)=>{
        console.log(value);
        this.oid = value.oid;
        this.fetchOrderData();
      }
    )
  }

  fetchOrderData(){
    this.podService.getOrderData(this.oid).subscribe(
      (data)=> {
        console.log(data);
      
        this.orderData = data;
        // Render the Paypal Button when the data is there
        if (!this.addScript) {
          this.addPaypalScript().then(() => {
            paypal.Button.render(this.paypalConfig, '#paypal-checkout-btn');
            this.paypalLoad = false;
          })
        }
        this.loading = false;
      }
    )
  }

  changeStatus(newstatus: any){
    this.newStatusValue = newstatus ;
    this.confirmPage = true;
  }
  updateStatusValue(newStatus: any){
    this.orderData.status = newStatus;
    this.podService.updateOrderData(this.orderData).then(
      () => {
        console.log('updated done');
      }
    )
  }

}
