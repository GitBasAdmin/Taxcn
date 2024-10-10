import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { PrcoRoutingModule } from '@app/components/prco/prco-routing.module';

import { Prco0200Component } from '@app/components/prco/prco0200/prco0200.component';
import { Prco0300Component } from '@app/components/prco/prco0300/prco0300.component';
import { Prco1100Component } from '@app/components/prco/prco1100/prco1100.component';


@NgModule({
  declarations: [
    Prco0200Component,
    Prco0300Component,
    Prco1100Component,
  ],
  imports: [
    CommonModule,
    PrcoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class PrcoModule { }

