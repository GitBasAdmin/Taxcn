import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/@shared/shared.module';
import { PrfnRoutingModule } from '@app/components/prfn/prfn-routing.module';

import { Prfn6000Component } from './prfn6000/prfn6000.component';
import { Prfn6200Component } from './prfn6200/prfn6200.component';
import { Prfn6400Component } from './prfn6400/prfn6400.component';
import { Prfn6500Component } from './prfn6500/prfn6500.component';
import { Prfn7410Component } from './prfn7410/prfn7410.component';
import { Prfn7420Component } from './prfn7420/prfn7420.component';
import { Prfn7430Component } from './prfn7430/prfn7430.component';
import { Prfn7440Component } from './prfn7440/prfn7440.component';
import { Prfn7450Component } from './prfn7450/prfn7450.component';
import { Prfn7460Component } from './prfn7460/prfn7460.component';
import { Prfn7470Component } from './prfn7470/prfn7470.component';
import { Prfn1200Component } from './prfn1200/prfn1200.component';
import { Prfn6100Component } from './prfn6100/prfn6100.component';
import { Prfn7200Component } from './prfn7200/prfn7200.component';
import { Prfn7300Component } from './prfn7300/prfn7300.component';


@NgModule({
  declarations: [
    Prfn6000Component,
    Prfn6200Component,
    Prfn6400Component,
    Prfn6500Component,
    Prfn7410Component,
    Prfn7420Component,
    Prfn7430Component,
    Prfn7440Component,
    Prfn7450Component,
    Prfn7460Component,
    Prfn7470Component,
    Prfn1200Component,
    Prfn6100Component,
    Prfn7200Component,
    Prfn7300Component,
  ],
  imports: [
    CommonModule,
    PrfnRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [],
})
export class PrfnModule { }