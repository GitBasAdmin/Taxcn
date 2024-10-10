import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { PrudRoutingModule } from '@app/components/prud/prud-routing.module';

import { Prud0200Component } from '@app/components/prud/prud0200/prud0200.component';
import { Prud0300Component } from '@app/components/prud/prud0300/prud0300.component';
import { Prud0410Component } from '@app/components/prud/prud0410/prud0410.component';
import { Prud0420Component } from '@app/components/prud/prud0420/prud0420.component';
import { Prud0500Component } from '@app/components/prud/prud0500/prud0500.component';
import { Prud0600Component } from '@app/components/prud/prud0600/prud0600.component';
import { Prud0900Component } from '@app/components/prud/prud0900/prud0900.component';
import { Prud1100Component } from '@app/components/prud/prud1100/prud1100.component';
import { Prud2000Component } from '@app/components/prud/prud2000/prud2000.component';
import { Prud2100Component } from '@app/components/prud/prud2100/prud2100.component';
import { Prud2600Component } from '@app/components/prud/prud2600/prud2600.component'; 

@NgModule({
  declarations: [
    Prud0200Component,
    Prud0300Component,
    Prud0410Component,
    Prud0420Component,
    Prud0500Component,
    Prud0600Component,
    Prud0900Component,
    Prud1100Component,
    Prud2000Component,
    Prud2100Component,
    Prud2600Component, 
  ],
  imports: [
    CommonModule,
    PrudRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class PrudModule { }

