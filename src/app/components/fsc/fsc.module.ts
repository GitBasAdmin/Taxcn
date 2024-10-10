import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select'; // Import NgSelectModule
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/@shared/shared.module';
import { FscRoutingModule } from '@app/components/fsc/fsc-routing.module';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatTabsModule} from '@angular/material/tabs';
import { ModalModule } from '../modal/modal.module'; // นำเข้า modal
import { CaseModule } from '../case/case.module'; // 

import { Fsc0100Component } from './fsc0100/fsc0100.component';
import { Fsc0100HeadComponent } from './fsc0100-head/fsc0100-head.component';
import { Fsc0100MainComponent } from './fsc0100-main/fsc0100-main.component';
import { Fsc0100Tab1Component } from './fsc0100-tab1/fsc0100-tab1.component';
import { Fsc0100Tab2Component } from './fsc0100-tab2/fsc0100-tab2.component';
import { Fsc0200Component } from './fsc0200/fsc0200.component';
import { Fsc0200HeadComponent } from './fsc0200-head/fsc0200-head.component';
import { Fsc0200MainComponent } from './fsc0200-main/fsc0200-main.component';
import { Fsc0200Tab1Component } from './fsc0200-tab1/fsc0200-tab1.component';
import { Fsc0200Tab2Component } from './fsc0200-tab2/fsc0200-tab2.component';
import { Fsc0500Component } from './fsc0500/fsc0500.component';
import { Fsc0600Component } from './fsc0600/fsc0600.component';
import { Fsc0300Component } from './fsc0300/fsc0300.component';


@NgModule({
  declarations: [
    Fsc0100Component,
    Fsc0100HeadComponent,
    Fsc0100MainComponent,
    Fsc0100Tab1Component,
    Fsc0100Tab2Component,
    Fsc0200Component,
    Fsc0200HeadComponent,
    Fsc0200MainComponent,
    Fsc0200Tab1Component,
    Fsc0200Tab2Component,
    Fsc0500Component,
    Fsc0600Component,
    Fsc0300Component,
  ],
  imports: [
    CommonModule,
    FscRoutingModule,
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
export class FscModule { }