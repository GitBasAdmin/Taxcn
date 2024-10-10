import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { PrkbRoutingModule } from '@app/components/prkb/prkb-routing.module';

import { Prkb0500Component } from '@app/components/prkb/prkb0500/prkb0500.component';
import { Prkb0800Component } from '@app/components/prkb/prkb0800/prkb0800.component';
import { Prkb1000Component } from '@app/components/prkb/prkb1000/prkb1000.component';
import { Prkb1100Component } from '@app/components/prkb/prkb1100/prkb1100.component';
import { Prkb1300Component } from '@app/components/prkb/prkb1300/prkb1300.component';

@NgModule({
  declarations: [
    Prkb0500Component,
    Prkb0800Component,
    Prkb1000Component,
    Prkb1100Component,
    Prkb1300Component
  ],
  imports: [
    CommonModule,
    PrkbRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class PrkbModule { }

