import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/@shared/shared.module';
import { FkbRoutingModule } from '@app/components/fkb/fkb-routing.module';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatTabsModule} from '@angular/material/tabs';
import { ModalModule } from '../modal/modal.module'; // นำเข้า modal
import { CaseModule } from '../case/case.module'; // นำเข้า head

import { Fkb0100Component } from './fkb0100/fkb0100.component';
import { Fkb0400Component } from './fkb0400/fkb0400.component';
import { Fkb0800Component } from './fkb0800/fkb0800.component';
import { Fkb9000Component } from './fkb9000/fkb9000.component';
import { Fkb0600Component } from './fkb0600/fkb0600.component';
import { Fkb0700Component } from './fkb0700/fkb0700.component';
import { Fkb0700CaseComponent } from './fkb0700-case/fkb0700-case.component';
import { Fkb0610Component } from './fkb0610/fkb0610.component';
import { Fkb0900Component } from './fkb0900/fkb0900.component';
import { Fkb0310Component } from './fkb0310/fkb0310.component';
import { Fkb0301Component } from './fkb0301/fkb0301.component';
import { Fkb0200Component } from './fkb0200/fkb0200.component';
import { Fkb0500Component } from './fkb0500/fkb0500.component';
import { Fkb0510Component } from './fkb0510/fkb0510.component';



@NgModule({
  declarations: [
    Fkb0200Component,
    Fkb0500Component,
    Fkb0510Component,
    Fkb0100Component,
    Fkb0400Component,
    Fkb0800Component,
    Fkb9000Component,
    Fkb0600Component,
    Fkb0700Component,
    Fkb0700CaseComponent,
    Fkb0610Component,
    Fkb0900Component,
    Fkb0310Component,
    Fkb0301Component,
  ],
  imports: [
    CommonModule,
    FkbRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,MatAutocompleteModule,MatTabsModule,
    ModalModule,
    CaseModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [],
})
export class FkbModule { }