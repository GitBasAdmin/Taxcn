import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select'; // Import NgSelectModule
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/@shared/shared.module';
import { FstRoutingModule } from '@app/components/fst/fst-routing.module';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatTabsModule} from '@angular/material/tabs';
import { ModalModule } from '../modal/modal.module'; // นำเข้า modal
import { CaseModule } from '../case/case.module'; // 

import { Fst2300Component } from './fst2300/fst2300.component';
import { Fst2530Component } from './fst2530/fst2530.component';
import { Fst2300MainComponent } from './fst2300-main/fst2300-main.component';
import { Fst2300Tab1Component } from './fst2300-tab1/fst2300-tab1.component';
import { Fst2300Tab2Component } from './fst2300-tab2/fst2300-tab2.component';
import { Fst2400Component } from './fst2400/fst2400.component';
import { Fst2400MainComponent } from './fst2400-main/fst2400-main.component';
import { Fst2400Tab1Component } from './fst2400-tab1/fst2400-tab1.component';
import { Fst2400Tab2Component } from './fst2400-tab2/fst2400-tab2.component';
import { Fst1320Component } from './fst1320/fst1320.component';
import { Fst2320Component } from './fst2320/fst2320.component';
import { Fst1400Component } from './fst1400/fst1400.component';
import { Fst1400MainComponent } from './fst1400-main/fst1400-main.component';
import { Fst1400Tab1Component } from './fst1400-tab1/fst1400-tab1.component';
import { Fst1400Tab2Component } from './fst1400-tab2/fst1400-tab2.component';
import { Fst1400Tab3Component } from './fst1400-tab3/fst1400-tab3.component';
import { Fst1400Tab4Component } from './fst1400-tab4/fst1400-tab4.component';
import { Fst1410Component } from './fst1410/fst1410.component';
import { Fst2410Component } from './fst2410/fst2410.component';
import { Fst2420Component } from './fst2420/fst2420.component';
import { Fst1430Component } from './fst1430/fst1430.component';
import { Fst2430Component } from './fst2430/fst2430.component';
import { Fst2500Component } from './fst2500/fst2500.component';
import { Fst2510Component } from './fst2510/fst2510.component';
import { Fst2600Component } from './fst2600/fst2600.component';
import { Fst0100Component } from './fst0100/fst0100.component';
import { Fst0110Component } from './fst0110/fst0110.component';
import { Fst0200Component } from './fst0200/fst0200.component';
import { Fst0210Component } from './fst0210/fst0210.component';
import { Fst0220Component } from './fst0220/fst0220.component';
import { Fst0230Component } from './fst0230/fst0230.component';
import { Fst0240Component } from './fst0240/fst0240.component';
import { Fst0250Component } from './fst0250/fst0250.component';
import { Fst0260Component } from './fst0260/fst0260.component';
import { Fst0270Component } from './fst0270/fst0270.component';
import { Fst0290Component } from './fst0290/fst0290.component';
import { Fst0300Component } from './fst0300/fst0300.component';
import { Fst0310Component } from './fst0310/fst0310.component';


@NgModule({
  declarations: [
    Fst2300Component,Fst2300MainComponent,Fst2300Tab1Component,Fst2300Tab2Component,
    Fst2400Component,Fst2400MainComponent,Fst2400Tab1Component,Fst2400Tab2Component,
    Fst2530Component,
    Fst1320Component,
    Fst2320Component,
    Fst1400Component,Fst1400MainComponent,Fst1400Tab1Component,Fst1400Tab2Component,Fst1400Tab3Component,Fst1400Tab4Component,
    Fst1410Component,
    Fst2410Component,
    Fst2420Component,
    Fst1430Component,
    Fst2430Component,
    Fst2500Component,
    Fst2510Component,
    Fst2600Component,
    Fst0100Component,
    Fst0110Component,
    Fst0200Component,
    Fst0210Component,
    Fst0220Component,
    Fst0230Component,
    Fst0240Component,
    Fst0250Component,
    Fst0260Component,
    Fst0270Component,
    Fst0290Component,
    Fst0300Component,
    Fst0310Component,
  ],
  imports: [
    CommonModule,
    FstRoutingModule,
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
export class FstModule { }