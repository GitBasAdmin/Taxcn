import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select'; // Import NgSelectModule
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/@shared/shared.module';
import { FudRoutingModule } from '@app/components/fud/fud-routing.module';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatTabsModule} from '@angular/material/tabs';
import { ModalModule } from '../modal/modal.module'; // นำเข้า modal
import { CaseModule } from '../case/case.module'; // 

import { Fud0100Component } from './fud0100/fud0100.component';
import { Fud0100MainComponent } from './fud0100-main/fud0100-main.component';
import { Fud0100Tab1Component } from './fud0100-tab1/fud0100-tab1.component';
import { Fud0100Tab2Component } from './fud0100-tab2/fud0100-tab2.component';
import { Fud0100Tab3Component } from './fud0100-tab3/fud0100-tab3.component';
import { Fud0100Tab4Component } from './fud0100-tab4/fud0100-tab4.component';
import { Fud0100Tab5Component } from './fud0100-tab5/fud0100-tab5.component';
import { Fud0110Component } from './fud0110/fud0110.component';
import { Fud0111Component } from './fud0111/fud0111.component';
import { Fud0113Component } from './fud0113/fud0113.component';
import { Fud0114Component } from './fud0114/fud0114.component';
import { Fud0120Component } from './fud0120/fud0120.component';
import { Fud0130Component } from './fud0130/fud0130.component';
import { Fud1700Component } from './fud1700/fud1700.component';
import { Fud9000Component } from './fud9000/fud9000.component';


@NgModule({
  declarations: [
    Fud0100Component,Fud0100MainComponent,Fud0100Tab1Component,Fud0100Tab2Component,Fud0100Tab3Component,Fud0100Tab4Component,Fud0100Tab5Component,
    Fud0110Component,
    Fud0111Component,
    Fud0113Component,
    Fud0114Component,
    Fud0120Component,
    Fud0130Component,
    Fud1700Component,
    Fud9000Component
  ],
  imports: [
    CommonModule,
    FudRoutingModule,
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
export class FudModule { }