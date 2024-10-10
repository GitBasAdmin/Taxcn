import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { PrkrRoutingModule } from '@app/components/prkr/prkr-routing.module';

import { Prkr0100Component } from '@app/components/prkr/prkr0100/prkr0100.component';
import { Prkr0500Component } from '@app/components/prkr/prkr0500/prkr0500.component';
import { Prkr0700Component } from '@app/components/prkr/prkr0700/prkr0700.component';
import { Prkr0800Component } from '@app/components/prkr/prkr0800/prkr0800.component';
import { Prkr0900Component } from '@app/components/prkr/prkr0900/prkr0900.component';
import { Prkr1000Component } from '@app/components/prkr/prkr1000/prkr1000.component';

@NgModule({
  declarations: [
    Prkr0100Component,
    Prkr0500Component,
    Prkr0700Component,
    Prkr0800Component,
    Prkr0900Component,
    Prkr1000Component
  ],
  imports: [
    CommonModule,
    PrkrRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class PrkrModule { }

