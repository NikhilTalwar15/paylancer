import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateContractComponent } from './create-contract/create-contract.component';
import { Routes } from '@angular/router/';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EcontractService } from 'app/firebase/econtract.service';
import {  ReactiveFormsModule } from '@angular/forms';
import { MomentModule } from 'angular2-moment';
import {DpDatePickerModule} from 'ng2-date-picker';
import { EcontractComponent } from './econtract/econtract.component';
import { EditComponent } from './edit/edit.component';

// const routes: Routes = [
//   { path: 'create', component: CreateContractComponent },
//   { path: ':cid' , component: EcontractComponent}
// ];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DpDatePickerModule,
    MomentModule,
    RouterModule
    // RouterModule.forChild(routes)
  ],
  declarations: [EditComponent],
  providers: []
})
export class EcontractModule { }
