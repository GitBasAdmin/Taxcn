import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select'; // Import NgSelectModule
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/@shared/shared.module';
import { FapRoutingModule } from '@app/components/fap/fap-routing.module';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatTabsModule} from '@angular/material/tabs';
import { ModalModule } from '../modal/modal.module'; // นำเข้า modal
import { CaseModule } from '../case/case.module'; // 

import { Fap0100Component } from './fap0100/fap0100.component';
import { Fap0111Component } from './fap0111/fap0111.component';
import { Fap0110Component } from './fap0110/fap0110.component';
import { Fap0110ColorComponent } from './fap0110-color/fap0110-color.component';
import { Fap0130Component } from './fap0130/fap0130.component';
import { Fap0140Component } from './fap0140/fap0140.component';
import { Fap0150Component } from './fap0150/fap0150.component';
import { Fap1400Component } from './fap1400/fap1400.component';
import { Fap0200Component } from './fap0200/fap0200.component';
import { Fap0700Component } from './fap0700/fap0700.component';
import { Fap0300Component } from './fap0300/fap0300.component';
import { Fap1000Component } from './fap1000/fap1000.component';
import { JudgeAppointComponent } from './judge-appoint/judge-appoint.component';

@NgModule({
  declarations: [
    Fap0100Component,
    Fap0111Component,
    Fap0110Component,
    Fap0110ColorComponent,
    Fap0130Component,
    Fap0140Component,
    Fap0150Component,
    Fap1400Component,
    Fap0200Component,
    Fap0700Component,
    Fap0300Component,
    Fap1000Component,
    JudgeAppointComponent
  ],
  imports: [
    CommonModule,
    FapRoutingModule,
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
export class FapModule { }