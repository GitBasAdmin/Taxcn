import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { PrjuRoutingModule } from '@app/components/prju/prju-routing.module';

import { Prju0200Component } from '@app/components/prju/prju0200/prju0200.component';
import { Prju0300Component } from '@app/components/prju/prju0300/prju0300.component';
import { Prju0700Component } from '@app/components/prju/prju0700/prju0700.component';
import { Prju0800Component } from '@app/components/prju/prju0800/prju0800.component';
import { Prju1100Component } from '@app/components/prju/prju1100/prju1100.component';
import { Prju1200Component } from '@app/components/prju/prju1200/prju1200.component';
import { Prju2000Component } from '@app/components/prju/prju2000/prju2000.component';
import { Prju2400Component } from '@app/components/prju/prju2400/prju2400.component';

@NgModule({
  declarations: [
    Prju0200Component,
    Prju0300Component,
    Prju0700Component,
    Prju0800Component,
    Prju1100Component,
    Prju1200Component,
    Prju2000Component,
    Prju2400Component
  ],
  imports: [
    CommonModule,
    PrjuRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class PrjuModule { }

