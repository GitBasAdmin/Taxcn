import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { PrmgRoutingModule } from '@app/components/prmg/prmg-routing.module';

import { Prmg0100Component } from '@app/components/prmg/prmg0100/prmg0100.component';
import { Prmg0200Component } from '@app/components/prmg/prmg0200/prmg0200.component';
import { Prmg0300Component } from '@app/components/prmg/prmg0300/prmg0300.component';
import { Prmg0400Component } from '@app/components/prmg/prmg0400/prmg0400.component';
import { Prmg0700Component } from '@app/components/prmg/prmg0700/prmg0700.component';
import { Prmg0500Component } from '@app/components/prmg/prmg0500/prmg0500.component';
import { Prmg2800Component } from '@app/components/prmg/prmg2800/prmg2800.component';

@NgModule({
  declarations: [
    Prmg0100Component,
    Prmg0200Component,
    Prmg0300Component,
    Prmg0400Component,
    Prmg0700Component,
    Prmg0500Component,
    Prmg2800Component
  ],
  imports: [
    CommonModule,
    PrmgRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class PrmgModule { }

