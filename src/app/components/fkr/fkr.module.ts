import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select'; // Import NgSelectModule
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/@shared/shared.module';
import { FkrRoutingModule } from '@app/components/fkr/fkr-routing.module';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatTabsModule} from '@angular/material/tabs';
import { ModalModule } from '../modal/modal.module'; // นำเข้า modal
import { CaseModule } from '../case/case.module'; // 


import { Fkr0100Component } from './fkr0100/fkr0100.component';
import { Fkr0200Component } from './fkr0200/fkr0200.component';
import { Fkr0300Component } from './fkr0300/fkr0300.component';


@NgModule({
  declarations: [
    Fkr0100Component,
    Fkr0200Component,
    Fkr0300Component
  ],
  imports: [
    CommonModule,
    FkrRoutingModule,
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
export class FkrModule { }