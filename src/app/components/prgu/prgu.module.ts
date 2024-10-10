import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select'; // Import NgSelectModule
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/@shared/shared.module';
import { PrguRoutingModule } from '@app/components/prgu/prgu-routing.module';

import { Prgu2400Component } from './prgu2400/prgu2400.component';
import { Prgu2500Component } from './prgu2500/prgu2500.component';
import { Prgu2600Component } from './prgu2600/prgu2600.component';
import { Prgu2900Component } from './prgu2900/prgu2900.component';
import { Prgu3100Component } from './prgu3100/prgu3100.component';
import { Prgu0300Component } from './prgu0300/prgu0300.component';
import { Prgu0400Component } from './prgu0400/prgu0400.component';
import { Prgu0410Component } from './prgu0410/prgu0410.component';

@NgModule({
  declarations: [
    Prgu2400Component,
    Prgu2500Component,
    Prgu2600Component,
    Prgu2900Component,
    Prgu3100Component,
    Prgu0300Component,
    Prgu0400Component,
    Prgu0410Component,
  ],
  imports: [
    CommonModule,
    PrguRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [],
})
export class PrguModule { }