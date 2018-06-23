import { Component ,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthService } from '../../core/auth.service';
@Component({
  selector: 'user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
})
export class UserLoginComponent  implements OnInit{

  constructor(public auth: AuthService,
              private router: Router) { }

  /// Social Login
    ngOnInit() {
      this.afterSignIn();
      // console.log(this.auth.user);
      if(this.auth._user.uid){
        if(this.auth._user.isPhoneVerified){
          this.router.navigateByUrl('/');
        }else {
          this.router.navigateByUrl('/verify');
        }
      }
      // if(this.auth.user && this.auth.isPhoneVerified) {
      //   console.log(this.auth.user);
      // }
    }
  signInWithGithub() {
    this.auth.githubLogin()
    .then(() => this.afterSignIn());
  }

  signInWithGoogle() {
    this.auth.googleLogin()
      .then(() => {
        this.afterSignIn();
      } );
  }

  signInWithFacebook() {
    this.auth.facebookLogin()
      .then(() => this.afterSignIn());
  }

  signInWithTwitter() {
    this.auth.twitterLogin()
      .then(() => this.afterSignIn());
  }

  /// Anonymous Sign In

  signInAnonymously() {
    this.auth.anonymousLogin()
      .then(() => this.afterSignIn());
  }

  /// Shared

  private afterSignIn() {
    // Do after login stuff here, such router redirects, toast messages, etc.
    console.log(this.auth._user);
    if(this.auth._user && this.auth._user.phoneVerified) {
      console.log(this.auth.user);
      this.router.navigate(['/']);
    } else if(!this.auth._user.phoneVerified) {
        this.router.navigate(['verify']);
    }
    
  }

}
