import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select'; // Import NgSelectModule
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/@shared/shared.module';
import { PrapRoutingModule } from '@app/components/prap/prap-routing.module';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatTabsModule} from '@angular/material/tabs';
import { ModalModule } from '../modal/modal.module'; // นำเข้า modal
import { CaseModule } from '../case/case.module'; // 

import { Prap0900Component } from './prap0900/prap0900.component';
import { Prap6600Component } from './prap6600/prap6600.component';
import { Prap4800Component } from './prap4800/prap4800.component';
import { Prap4600Component } from './prap4600/prap4600.component';
import { Prap5500Component } from './prap5500/prap5500.component';
import { Prap0700Component } from './prap0700/prap0700.component';
import { Prap3040Component } from './prap3040/prap3040.component';
import { Prap0800Component } from './prap0800/prap0800.component';
import { Prap4900Component } from './prap4900/prap4900.component';
import { Prap3000Component } from './prap3000/prap3000.component';
import { Prap4200Component } from './prap4200/prap4200.component';
import { Prap4300Component } from './prap4300/prap4300.component';
import { Prap1500Component } from './prap1500/prap1500.component';

@NgModule({
  declarations: [
    Prap0900Component,
    Prap4800Component,
    Prap4600Component,
    Prap6600Component,
    Prap5500Component,
    Prap0700Component,
    Prap3040Component,
    Prap0800Component,
    Prap4900Component,
    Prap3000Component,
    Prap4200Component,
    Prap4300Component,
    Prap1500Component,
  ],
  imports: [
    CommonModule,
    PrapRoutingModule,
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
export class PrapModule { }