import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select'; // Import NgSelectModule
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/@shared/shared.module';
import { FguRoutingModule } from '@app/components/fgu/fgu-routing.module';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';
import { ModalModule } from '../modal/modal.module'; // นำเข้า modal
import { CaseModule } from '../case/case.module'; // 


import { Fgu0100Component } from './fgu0100/fgu0100.component';
import { Fgu0100MainComponent } from './fgu0100-main/fgu0100-main.component';
import { Fgu0100Tab1Component } from './fgu0100-tab1/fgu0100-tab1.component';
import { Fgu0100Tab2Component } from './fgu0100-tab2/fgu0100-tab2.component';
import { Fgu0100Tab3Component } from './fgu0100-tab3/fgu0100-tab3.component';
import { Fgu0100Tab4Component } from './fgu0100-tab4/fgu0100-tab4.component';
import { Fgu0100Tab5Component } from './fgu0100-tab5/fgu0100-tab5.component';
import { Fgu0110Component } from './fgu0110/fgu0110.component';
import { Fgu0120Component } from './fgu0120/fgu0120.component';
import { Fgu0130Component } from './fgu0130/fgu0130.component';
import { Fgu0140Component } from './fgu0140/fgu0140.component';
import { Fgu0150Component } from './fgu0150/fgu0150.component';
import { Fgu0160Component } from './fgu0160/fgu0160.component';
import { Fgu0170Component } from './fgu0170/fgu0170.component';
import { Fgu0180Component } from './fgu0180/fgu0180.component';
import { Fgu0190Component } from './fgu0190/fgu0190.component';
import { Fgu0195Component } from './fgu0195/fgu0195.component';
import { Fgu0196Component } from './fgu0196/fgu0196.component';
import { Fgu0197Component } from './fgu0197/fgu0197.component';
import { GuarHeadComponent } from './guar-head/guar-head.component';

@NgModule({
  declarations: [
    Fgu0100Component,
    Fgu0100MainComponent,
    Fgu0100Tab1Component,
    Fgu0100Tab2Component,
    Fgu0100Tab3Component,
    Fgu0100Tab4Component,
    Fgu0100Tab5Component,
    Fgu0110Component,Fgu0120Component,
    Fgu0130Component,Fgu0140Component,Fgu0150Component,
    Fgu0160Component,Fgu0170Component,Fgu0180Component,
    Fgu0190Component,Fgu0195Component,Fgu0196Component,
    Fgu0197Component,GuarHeadComponent
  ],
  imports: [
    CommonModule,
    FguRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,MatAutocompleteModule,MatTabsModule,
    ModalModule,
    CaseModule,
    NgSelectModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [],
})
export class FguModule { }