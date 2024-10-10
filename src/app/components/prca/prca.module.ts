import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { PrcaRoutingModule } from '@app/components/prca/prca-routing.module';

import { Prca0500Component } from '@app/components/prca/prca0500/prca0500.component';
import { Prca0800Component } from '@app/components/prca/prca0800/prca0800.component';
import { Prca1800Component } from '@app/components/prca/prca1800/prca1800.component';
import { Prca1910Component } from '@app/components/prca/prca1910/prca1910.component';
import { Prca2100Component } from '@app/components/prca/prca2100/prca2100.component';
import { Prca3000Component } from '@app/components/prca/prca3000/prca3000.component';



@NgModule({
  declarations: [
    Prca0500Component,
    Prca0800Component,
    Prca1800Component,
    Prca1910Component,
    Prca2100Component,
    Prca3000Component
  ],
  imports: [
    CommonModule,
    PrcaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class PrcaModule { }

