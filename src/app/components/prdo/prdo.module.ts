import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { PrdoRoutingModule } from '@app/components/prdo/prdo-routing.module';

import { Prdo0200Component } from '@app/components/prdo/prdo0200/prdo0200.component';
import { Prdo0500Component } from '@app/components/prdo/prdo0500/prdo0500.component';
import { Prdo0800Component } from '@app/components/prdo/prdo0800/prdo0800.component';
import { Prdo1200Component } from '@app/components/prdo/prdo1200/prdo1200.component';
import { Prdo1300Component } from '@app/components/prdo/prdo1300/prdo1300.component';
import { Prdo1500Component } from '@app/components/prdo/prdo1500/prdo1500.component';
import { Prdo1600Component } from '@app/components/prdo/prdo1600/prdo1600.component';
import { Prdo1800Component } from '@app/components/prdo/prdo1800/prdo1800.component';
import { Prdo2600Component } from '@app/components/prdo/prdo2600/prdo2600.component';



@NgModule({
  declarations: [
    Prdo0200Component,
    Prdo0500Component,
    Prdo0800Component,
    Prdo1200Component,
    Prdo1300Component,
    Prdo1500Component,
    Prdo1600Component,
    Prdo1800Component,
    Prdo2600Component
  ],
  imports: [
    CommonModule,
    PrdoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class PrdoModule { }

