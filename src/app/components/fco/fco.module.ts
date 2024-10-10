import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/@shared/shared.module';
import { FcoRoutingModule } from '@app/components/fco/fco-routing.module';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatTabsModule} from '@angular/material/tabs';
import { ModalModule } from '../modal/modal.module'; // นำเข้า modal
import { CaseModule } from '../case/case.module'; // 

import { Fco1300Component } from './fco1300/fco1300.component';
import { Fco0100Component } from './fco0100/fco0100.component';
import { Fco0200Component } from './fco0200/fco0200.component';
import { Fco0300Component } from './fco0300/fco0300.component';
import { Fco0300CaseComponent } from './fco0300-case/fco0300-case.component';
import { Fco0300NewCaseComponent } from './fco0300-new-case/fco0300-new-case.component';
import { Fco0400Component } from './fco0400/fco0400.component';
import { Fco0400MainComponent } from './fco0400-main/fco0400-main.component';
import { Fco0400Tab1Component } from './fco0400-tab1/fco0400-tab1.component';
import { Fco0400Tab2Component } from './fco0400-tab2/fco0400-tab2.component';
import { Fco0500Component } from './fco0500/fco0500.component';
import { Fco0600Component } from './fco0600/fco0600.component';
import { Fco0700Component } from './fco0700/fco0700.component';
import { Fco0800Component } from './fco0800/fco0800.component';
import { Fco0900Component } from './fco0900/fco0900.component';
import { Fco1400Component } from './fco1400/fco1400.component';
import { Fco1600Component } from './fco1600/fco1600.component';


@NgModule({
  declarations: [
    Fco1300Component,
    Fco0300Component,Fco0300CaseComponent,Fco0300NewCaseComponent,
    Fco0400Component,Fco0400MainComponent,Fco0400Tab1Component,Fco0400Tab2Component,
    Fco0100Component,Fco0200Component,
    Fco0500Component,
    Fco0600Component,
    Fco0700Component,
    Fco0800Component,
    Fco0900Component,
    Fco1400Component,
    Fco1600Component,
  ],
  imports: [
    CommonModule,
    FcoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,MatAutocompleteModule,MatTabsModule,
    ModalModule,
    CaseModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [],
})
export class FcoModule { }