import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'notify-com',
  templateUrl: './notify-com.component.html',
  styleUrls: ['./notify-com.component.scss']
})
export class NotifyComComponent implements OnInit {

  notifications: any = [];
  notificationsToSetSeen: any = [];
  constructor(public auth: AuthService , private router : Router) { }
  ngOnInit() {
    this.auth.showBack = true;
    this.getAllNotification();
  }

  getAllNotification(){
    this.auth.fetchNotification().subscribe(
      (list) => {
        this.notifications = list;
        console.log(list);
        this.auth.fetchNotificationToSetSeen();
      }
    );
  }
  routeToUrl(cid: string){
    console.log(cid);
    this.router.navigateByUrl("/econtect/"+cid);
  }

  ngOnDestroy(){
    console.log('distorying');
  }
  
}
