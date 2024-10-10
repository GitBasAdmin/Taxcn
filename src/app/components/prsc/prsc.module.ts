import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { PrscRoutingModule } from '@app/components/prsc/prsc-routing.module';

import { Prsc0100Component } from '@app/components/prsc/prsc0100/prsc0100.component';
import { Prsc0200Component } from '@app/components/prsc/prsc0200/prsc0200.component';
import { Prsc0201Component } from '@app/components/prsc/prsc0201/prsc0201.component';
import { Prsc0400Component } from '@app/components/prsc/prsc0400/prsc0400.component';
import { Prsc0700Component } from '@app/components/prsc/prsc0700/prsc0700.component';
import { Prsc0800Component } from '@app/components/prsc/prsc0800/prsc0800.component';
import { Prsc0900Component } from '@app/components/prsc/prsc0900/prsc0900.component';

@NgModule({
  declarations: [
    Prsc0100Component,
    Prsc0200Component,
    Prsc0201Component,
    Prsc0400Component,
    Prsc0700Component,
    Prsc0800Component,
    Prsc0900Component
  ],
  imports: [
    CommonModule,
    PrscRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class PrscModule { }

