import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { PrpoRoutingModule } from '@app/components/prpo/prpo-routing.module';

import { Prpo0300Component } from '@app/components/prpo/prpo0300/prpo0300.component';
import { Prpo0500Component } from '@app/components/prpo/prpo0500/prpo0500.component';
import { Prpo0900Component } from '@app/components/prpo/prpo0900/prpo0900.component';
import { Prpo1400Component } from '@app/components/prpo/prpo1400/prpo1400.component';
import { Prpo1500Component } from '@app/components/prpo/prpo1500/prpo1500.component';
import { Prpo1700Component } from '@app/components/prpo/prpo1700/prpo1700.component';
import { Prpo1900Component } from '@app/components/prpo/prpo1900/prpo1900.component';


@NgModule({
  declarations: [
    Prpo0300Component,
    Prpo0500Component,
    Prpo0900Component,
    Prpo1400Component,
    Prpo1500Component,
    Prpo1700Component,
    Prpo1900Component
  ],
  imports: [
    CommonModule,
    PrpoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class PrpoModule { }

