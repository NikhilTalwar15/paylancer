import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserLoginComponent } from './ui/user-login/user-login.component';
import { ItemsListComponent } from './items/items-list/items-list.component';
import { ReadmePageComponent } from './ui/readme-page/readme-page.component';
import { NotesListComponent } from './notes/notes-list/notes-list.component';


import { AuthGuard } from './core/auth.guard';
import { CoreModule } from './core/core.module';
import { HomeComponent } from 'app/ui/home/home.component';
import { ConfirmOtpComponent } from 'app/ui/confirm-otp/confirm-otp.component';
import { CreateContractComponent } from 'app/econtract/create-contract/create-contract.component';
import { EcontractComponent } from 'app/econtract/econtract/econtract.component';
import { EditComponent } from 'app/econtract/edit/edit.component';
import { InActiveComponent } from 'app/ui/in-active/in-active.component';
import { BankDetailsComponent } from './ui/bank-details/bank-details.component';
import { ProfileComponent } from './ui/profile/profile.component';
import { NotifyComComponent } from './notify-com/notify-com.component';
import { PodComponent } from './pod/pod/pod.component';
import { OrderpageComponent } from './pod/orderpage/orderpage.component';

const routes: Routes = [
  { path: '', component: HomeComponent , canActivate: [AuthGuard]  },
  { path: 'login', component: UserLoginComponent },
  { path: 'items', component: ItemsListComponent, canActivate: [AuthGuard] },
  { path: 'notes', component: NotesListComponent,  canActivate: [AuthGuard] },
  { path: 'inactive', component: InActiveComponent,  canActivate: [AuthGuard] },
  { path: 'bankDetails', component: BankDetailsComponent,  canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent,  canActivate: [AuthGuard] },
  { path: 'uploads', loadChildren: './uploads/shared/upload.module#UploadModule', canActivate: [AuthGuard] },
  {path: 'econtract/create' , component: CreateContractComponent ,canActivate: [AuthGuard]},
  {path: 'econtract/:cid' , component: EcontractComponent ,canActivate: [AuthGuard]},
  {path: 'econtract/edit/:cid' , component: EditComponent ,canActivate: [AuthGuard]},
  { path: 'verify' , component: ConfirmOtpComponent , canActivate: [AuthGuard]},
  { path: 'notification' , component: NotifyComComponent , canActivate: [AuthGuard]},
  { path: 'payod/:oid' , component: OrderpageComponent , canActivate: [AuthGuard]},
  { path: 'payod' , component: PodComponent , canActivate: [AuthGuard]}
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule { }
