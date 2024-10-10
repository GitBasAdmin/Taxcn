import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/@shared/shared.module';
import { FjuRoutingModule } from '@app/components/fju/fju-routing.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';

import { ModalModule } from '../modal/modal.module'; // นำเข้า modal
import { CaseModule } from '../case/case.module'; // 

// import { NgSelectModule } from '@ng-select/ng-select'; // Import NgSelectModule

import { Fju0100Component } from './fju0100/fju0100.component';
import { Fju0100HeadComponent } from './fju0100-head/fju0100-head.component';
import { Fju0100MainComponent } from './fju0100-main/fju0100-main.component';
import { Fju0100Tab1Component } from './fju0100-tab1/fju0100-tab1.component';
import { Fju0100Tab2Component } from './fju0100-tab2/fju0100-tab2.component';
import { Fju0600Component } from './fju0600/fju0600.component';
import { Fju0600HistoryComponent } from './fju0600-history/fju0600-history.component';
import { Fju6000Component } from './fju6000/fju6000.component';
import { Fju0200Component } from './fju0200/fju0200.component';
import { Fju0800Component } from './fju0800/fju0800.component';
import { Fju0500Component } from './fju0500/fju0500.component';
import { Fju0630Component } from './fju0630/fju0630.component';
import { Fju0900Component } from './fju0900/fju0900.component';
import { Fju1000Component } from './fju1000/fju1000.component';
import { Fju0610Component } from './fju0610/fju0610.component';
import { Fju0620Component } from './fju0620/fju0620.component';


@NgModule({
  declarations: [
    Fju0100Component,
    Fju0100HeadComponent,Fju0100MainComponent,Fju0100Tab1Component,Fju0100Tab2Component,
    Fju0200Component,
    Fju0800Component,
    Fju0500Component,
    Fju0600Component,
    Fju0600HistoryComponent,
    Fju0630Component,
    Fju0900Component,
    Fju1000Component,
    Fju6000Component,
    Fju0610Component,
    Fju0620Component,
  ],
  imports: [
    CommonModule,
    FjuRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,MatAutocompleteModule,MatTabsModule,
    ModalModule,
    CaseModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [Fju0100Component,Fju0100HeadComponent,Fju0100MainComponent,Fju0100Tab1Component,Fju0100Tab2Component],
})
export class FjuModule { }