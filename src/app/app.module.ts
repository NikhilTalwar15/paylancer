import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

///// Start FireStarter

// Core
import { CoreModule } from './core/core.module';

// Shared/Widget
import { SharedModule } from './shared/shared.module';

// Feature Modules
import { ItemModule } from './items/shared/item.module';
import { UploadModule } from './uploads/shared/upload.module';
import { UiModule } from './ui/shared/ui.module';
import { NotesModule } from './notes/notes.module';
///// End FireStarter

import { environment } from '../environments/environment';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { AngularFireModule } from 'angularfire2';
export const firebaseConfig = environment.firebase;
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { HomeComponent } from './ui/home/home.component';
import { EcontractModule } from 'app/econtract/econtract.module';
import { ConfirmOtpComponent } from './ui/confirm-otp/confirm-otp.component';
import { TextMaskModule } from 'angular2-text-mask';
import { CreateContractComponent } from 'app/econtract/create-contract/create-contract.component';
import { EcontractComponent } from 'app/econtract/econtract/econtract.component';
import { FirebaseModule } from 'app/firebase/firebase.module';
import { EcontractService } from 'app/firebase/econtract.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { InActiveComponent } from './ui/in-active/in-active.component';
import { BankDetailsComponent } from './ui/bank-details/bank-details.component';
import { BankService } from './firebase/bank.service';
import { ProfileComponent } from './ui/profile/profile.component';
import { LogsService } from './firebase/logs.service';
import { MessagingService } from './messaging.service';
import { SendNotifyService } from './notification/send-notify.service';
import { NotifyComComponent } from './notify-com/notify-com.component';
import { PodComponent } from './pod/pod/pod.component';
import { PodService } from './firebase/pod.service';
import { OrderpageComponent } from './pod/orderpage/orderpage.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ConfirmOtpComponent,
    CreateContractComponent,
    EcontractComponent,
    InActiveComponent,
    BankDetailsComponent,
    ProfileComponent,
    NotifyComComponent,
    PodComponent,
    OrderpageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    ItemModule,
    UiModule,
    NotesModule,
    EcontractModule,
    AngularFireModule.initializeApp(firebaseConfig),
    TextMaskModule,
    FirebaseModule,
    DeviceDetectorModule.forRoot(),
    // environment.production ? ServiceWorkerModule.register('/ngsw-worker.js') : [],
  ],
  bootstrap: [
    AppComponent,
  ],
  providers: [EcontractService, BankService , LogsService , MessagingService , SendNotifyService , PodService]
})
export class AppModule { }
