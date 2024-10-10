import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select'; // Import NgSelectModule
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/@shared/shared.module';
import { PrknRoutingModule } from '@app/components/prkn/prkn-routing.module';

import { Prkn0100Component } from './prkn0100/prkn0100.component';

@NgModule({
  declarations: [
    Prkn0100Component
  ],
  imports: [
    CommonModule,
    PrknRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [],
})
export class PrknModule { }