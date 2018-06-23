import { Component, ChangeDetectorRef, Input ,HostListener  } from '@angular/core';
import { AuthService } from 'app/core/auth.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss'],
  host: {
    '(document:click)': 'onClick($event)'
  }
})
@HostListener('document:click', ['$event'])
export class TopNavComponent implements OnInit{

  // @Input()
  show = false;
  temp: any = {};
  allNotify: any = [];
  totalNotify: number;
  loading: boolean;
  
  constructor(public auth: AuthService , private changeDetector:ChangeDetectorRef){

  }
  ngOnInit(){
    this.loading = true;
    console.log(this.auth.user);
    this.getTheNumber();
  }

  toggleCollapse() {
    this.show = !this.show;
  }

  signOut() {
    console.log('sign out');
    this.toggleCollapse();
    this.auth.signOut();
  }
  ngAfterViewChecked(){
    this.changeDetector.detectChanges();
  }

  onClick(event: Event) {
    this.temp = event;
    var foundMenu = false;
    for(var x = 0 ; x < this.temp.path.length ; x++){
      if(this.temp.path[x].id == "menuOpener"){
        foundMenu = true;
      }
    }
    if(foundMenu == false){
      this.show = false;
    }
 }
 getTheNumber() {
   this.auth.newNotificationList().subscribe(
     (list) =>{
       console.log(list);
        this.allNotify = list;
        this.totalNotify = this.allNotify.length;
        this.loading = false;
     });
 }
}
