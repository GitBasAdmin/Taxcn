import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { CaseModule } from '../case/case.module'; // 

import { PrstRoutingModule } from '@app/components/prst/prst-routing.module';

import { Prst5500Component } from '@app/components/prst/prst5500/prst5500.component';
import { Prst6400Component } from '@app/components/prst/prst6400/prst6400.component';

@NgModule({
  declarations: [
    Prst5500Component,
    Prst6400Component
  ],
  imports: [
    CommonModule,
    PrstRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CaseModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [],
})
export class PrstModule { }