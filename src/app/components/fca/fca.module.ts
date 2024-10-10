import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/@shared/shared.module';
import { FcaRoutingModule } from '@app/components/fca/fca-routing.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';

import { ModalModule } from '../modal/modal.module'; // นำเข้า modal
import { CaseModule } from '../case/case.module'; // 

import { Fca0130Component } from './fca0130/fca0130.component';
import { Fca0150Component } from './fca0150/fca0150.component';
import { Fca0200Component } from './fca0200/fca0200.component';
import { Fca1000Component } from './fca1000/fca1000.component';
import { Fca2000Component } from './fca2000/fca2000.component';
import { Fca0220Component } from './fca0220/fca0220.component';
import { Fca0230Component } from './fca0230/fca0230.component';
import { Fca0231Component } from './fca0231/fca0231.component';
import { Fca0234Component } from './fca0234/fca0234.component';
import { Fca0300Component } from './fca0300/fca0300.component';
import { Fca0800Component } from './fca0800/fca0800.component';
// import { CaseHeaderComponent } from './case-header/case-header.component';
// import { CaseHeadComponent } from './case-head/case-head.component';
import { CaseJudgeComponent } from './case-judge/case-judge.component';
import { CaseConciliateComponent } from './case-conciliate/case-conciliate.component';
import { Fca0200HeadComponent } from './fca0200-head/fca0200-head.component';
import { Fca0800HeadComponent } from './fca0800-head/fca0800-head.component';
import { Fca0800MainComponent } from './fca0800-main/fca0800-main.component';
import { Fca0800Tab1Component } from './fca0800-tab1/fca0800-tab1.component';
import { Fca0800Tab2Component } from './fca0800-tab2/fca0800-tab2.component';
import { Fca0800Tab3Component } from './fca0800-tab3/fca0800-tab3.component';
import { Fca0800Tab4Component } from './fca0800-tab4/fca0800-tab4.component';
import { Fca0200MainComponent } from './fca0200-main/fca0200-main.component';
import { Fca0200Tab1Component } from './fca0200-tab1/fca0200-tab1.component';
import { Fca0200Tab2Component } from './fca0200-tab2/fca0200-tab2.component';
import { Fca0200Tab3Component } from './fca0200-tab3/fca0200-tab3.component';
import { Fca0200AppointmentComponent } from './fca0200-appointment/fca0200-appointment.component';
import { Prca2400Component } from './prca2400/prca2400.component';


@NgModule({
  declarations: [
    Fca0130Component,
    Fca0150Component,
    Fca0200Component,
    Fca1000Component,
    Fca2000Component,
    Fca0220Component,
    Fca0230Component,
    Fca0231Component,
    Fca0234Component,
    Fca0300Component,
    Fca0800Component,
    // CaseHeaderComponent,
    // CaseHeadComponent,
    CaseJudgeComponent,
    CaseConciliateComponent,
    Fca0200HeadComponent,
    Fca0800HeadComponent,
    Fca0800MainComponent,
    Fca0800Tab1Component,
    Fca0800Tab2Component,
    Fca0800Tab3Component,
    Fca0800Tab4Component,
    Fca0200MainComponent,
    Fca0200Tab1Component,
    Fca0200Tab2Component,
    Fca0200Tab3Component,
    Fca0200AppointmentComponent,
    Prca2400Component
  ],
  imports: [
    CommonModule,
    FcaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,MatAutocompleteModule,MatTabsModule,
    ModalModule,
    CaseModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [Fca0200Component,Fca0200Tab1Component,Fca0200MainComponent,Fca0200HeadComponent],
})
export class FcaModule { }