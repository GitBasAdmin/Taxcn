import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/@shared/shared.module';
import { FknRoutingModule } from '@app/components/fkn/fkn-routing.module';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';

import { ModalModule } from '../modal/modal.module'; // นำเข้า modal
import { CaseModule } from '../case/case.module'; // 

import { Fkn0100Component } from './fkn0100/fkn0100.component';
import { Fkn0200Component } from './fkn0200/fkn0200.component';
import { Fkn0202Component } from './fkn0202/fkn0202.component';
import { Fkn0220Component } from './fkn0220/fkn0220.component';
import { Fkn0300Component } from './fkn0300/fkn0300.component';
import { Fkn0400Component } from './fkn0400/fkn0400.component';
import { Fkn0500Component } from './fkn0500/fkn0500.component';
import { Fkn0710Component } from './fkn0710/fkn0710.component';
import { Fkn0720Component } from './fkn0720/fkn0720.component';
import { Fkn0720Tab1Component } from './fkn0720-tab1/fkn0720-tab1.component';
import { Fkn0720Tab2Component } from './fkn0720-tab2/fkn0720-tab2.component';
import { Fkn0730Component } from './fkn0730/fkn0730.component';
import { Fkn0800Component } from './fkn0800/fkn0800.component';
import { Fkn0801Component } from './fkn0801/fkn0801.component';
import { Fkn0820Component } from './fkn0820/fkn0820.component';
import { Fkn0900Component } from './fkn0900/fkn0900.component';
import { Fkn0900PappealComponent } from './fkn0900-pappeal/fkn0900-pappeal.component';
import { Fkn0900PappointmentComponent } from './fkn0900-pappointment/fkn0900-pappointment.component';
import { Fkn0900PcaseComponent } from './fkn0900-pcase/fkn0900-pcase.component';
import { Fkn0900PcaseAlleStatComponent } from './fkn0900-pcase-alle-stat/fkn0900-pcase-alle-stat.component';
import { Fkn0900PcaseLitigantComponent } from './fkn0900-pcase-litigant/fkn0900-pcase-litigant.component';
import { Fkn0900PjudgementComponent } from './fkn0900-pjudgement/fkn0900-pjudgement.component';
import { Fkn0900PnoticeComponent } from './fkn0900-pnotice/fkn0900-pnotice.component';
import { Fkn0900PreceiptComponent } from './fkn0900-preceipt/fkn0900-preceipt.component';
import { Fkn0900PrequestComponent } from './fkn0900-prequest/fkn0900-prequest.component';
import { Fkn1100Component } from './fkn1100/fkn1100.component';
import { Fkn1200Component } from './fkn1200/fkn1200.component';
import { ManualIndexComponent } from './manual_index/manual_index.component';

@NgModule({
  declarations: [
    Fkn0100Component,
    Fkn0200Component,
    Fkn0202Component,
    Fkn0220Component,
    Fkn0300Component,
    Fkn0400Component,
    Fkn0500Component,
    Fkn0710Component,
    Fkn0720Component,
    Fkn0720Tab1Component,
    Fkn0720Tab2Component,
    Fkn0730Component,
    Fkn0800Component,
    Fkn0801Component,
    Fkn0820Component,
    Fkn0900Component,
    Fkn0900PappealComponent,
    Fkn0900PappointmentComponent,
    Fkn0900PcaseComponent,
    Fkn0900PcaseAlleStatComponent,
    Fkn0900PcaseLitigantComponent,
    Fkn0900PjudgementComponent,
    Fkn0900PnoticeComponent,
    Fkn0900PreceiptComponent,
    Fkn0900PrequestComponent,
    Fkn1100Component,
    Fkn1200Component,
    ManualIndexComponent
  ],
  imports: [
    CommonModule,
    FknRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,MatAutocompleteModule,MatTabsModule,
    ModalModule,
    CaseModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [],
})
export class FknModule { }