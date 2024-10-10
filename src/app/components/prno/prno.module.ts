import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { PrnoRoutingModule } from '@app/components/prno/prno-routing.module';

import { Prno3000Component } from '@app/components/prno/prno3000/prno3000.component';
import { Prno3700Component } from '@app/components/prno/prno3700/prno3700.component';
import { Prno3800Component } from '@app/components/prno/prno3800/prno3800.component';
import { Prno4000Component } from '@app/components/prno/prno4000/prno4000.component';
import { Prno5000Component } from '@app/components/prno/prno5000/prno5000.component';

@NgModule({
  declarations: [
    Prno3000Component,
    Prno3700Component,
    Prno3800Component,
    Prno4000Component,
    Prno5000Component
  ],
  imports: [
    CommonModule,
    PrnoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class PrnoModule { }

