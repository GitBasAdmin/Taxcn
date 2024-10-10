import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { PrciRoutingModule } from '@app/components/prci/prci-routing.module';

import { Prci0500Component } from '@app/components/prci/prci0500/prci0500.component';
import { Prci0600Component } from '@app/components/prci/prci0600/prci0600.component';
import { Prci0700Component } from '@app/components/prci/prci0700/prci0700.component';
import { Prci1200Component } from '@app/components/prci/prci1200/prci1200.component';
import { Prci1300Component } from '@app/components/prci/prci1300/prci1300.component';
import { Prci1400Component } from '@app/components/prci/prci1400/prci1400.component';
import { Prci1500Component } from '@app/components/prci/prci1500/prci1500.component';
import { Prci1800Component } from '@app/components/prci/prci1800/prci1800.component';
import { Prci1900Component } from '@app/components/prci/prci1900/prci1900.component';
import { Prci2100Component } from '@app/components/prci/prci2100/prci2100.component';
import { Prci2200Component } from '@app/components/prci/prci2200/prci2200.component';
import { Prci2600Component } from '@app/components/prci/prci2600/prci2600.component';
import { Prci2700Component } from '@app/components/prci/prci2700/prci2700.component';
import { Prci2900Component } from '@app/components/prci/prci2900/prci2900.component';
import { Prci4000Component } from '@app/components/prci/prci4000/prci4000.component';

@NgModule({
  declarations: [
    Prci0500Component,
    Prci0600Component,
    Prci0700Component,
    Prci1200Component,
    Prci1300Component,
    Prci1400Component,
    Prci1500Component,
    Prci1800Component,
    Prci1900Component,
    Prci2100Component,
    Prci2200Component,
    Prci2600Component,
    Prci2700Component,
    Prci2900Component,
    Prci4000Component
  ],
  imports: [
    CommonModule,
    PrciRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class PrciModule { }

