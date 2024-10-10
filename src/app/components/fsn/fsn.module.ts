import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select'; // Import NgSelectModule
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/@shared/shared.module';
import { FsnRoutingModule } from '@app/components/fsn/fsn-routing.module';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatTabsModule} from '@angular/material/tabs';
import { ModalModule } from '../modal/modal.module'; // นำเข้า modal
import { CaseModule } from '../case/case.module'; // 

import { Fsn1600Component } from './fsn1600/fsn1600.component';
import { Fsn1800Component } from './fsn1800/fsn1800.component';
import { Fsn3500Component } from './fsn3500/fsn3500.component';
import { Fsn0900Component } from './fsn0900/fsn0900.component';
import { Fsn1000Component } from './fsn1000/fsn1000.component';
import { Fsn2000Component } from './fsn2000/fsn2000.component';
import { Fsn1001Component } from './fsn1001/fsn1001.component';
import { Fsn1400Component } from './fsn1400/fsn1400.component';
import { Fsn1410Component } from './fsn1410/fsn1410.component';


@NgModule({
  declarations: [
    Fsn1600Component,
    Fsn1800Component,
    Fsn3500Component,
    Fsn0900Component,
    Fsn1000Component,
    Fsn2000Component,
    Fsn1001Component,
    Fsn1400Component,
    Fsn1410Component,
  ],
  imports: [
    CommonModule,
    FsnRoutingModule,
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
export class FsnModule { }