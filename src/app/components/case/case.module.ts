import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/@shared/shared.module';
import { CaseRoutingModule } from '@app/components/case/case-routing.module';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';
import { ModalModule } from '../modal/modal.module'; // นำเข้า modal

import { CaseHeaderComponent } from './case-header/case-header.component';
import { CaseHeadComponent } from './case-head/case-head.component';


@NgModule({
  declarations: [
    CaseHeaderComponent,
    CaseHeadComponent
  ],
  imports: [
    CommonModule,
    CaseRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,MatAutocompleteModule,MatTabsModule,
    ModalModule
  ],
  exports: [
    CaseHeaderComponent,
    CaseHeadComponent
  ],
  schemas: [ ],
  providers: [],
})
export class CaseModule { }