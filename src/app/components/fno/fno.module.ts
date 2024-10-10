import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/@shared/shared.module';
import { FnoRoutingModule } from '@app/components/fno/fno-routing.module';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatTabsModule} from '@angular/material/tabs';
import { ModalModule } from '../modal/modal.module'; // นำเข้า modal
import { CaseModule } from '../case/case.module'; // 


import { Fno0900Component } from './fno0900/fno0900.component';
import { Fno0910Component } from './fno0910/fno0910.component';
import { Fno1000Component } from './fno1000/fno1000.component';
import { Fno1000v9Component } from './fno1000v9/fno1000v9.component';
import { Fno1000v10Component } from './fno1000v10/fno1000v10.component';
import { Fno1000v11Component } from './fno1000v11/fno1000v11.component';
import { Fno1000v12Component } from './fno1000v12/fno1000v12.component';
import { Fno1000v13Component } from './fno1000v13/fno1000v13.component';
import { Fno1000v14Component } from './fno1000v14/fno1000v14.component';
import { Fno1000v15Component } from './fno1000v15/fno1000v15.component';
import { Fno1000v16Component } from './fno1000v16/fno1000v16.component';
import { Fno1800Component } from './fno1800/fno1800.component';
import { Fno2300Component } from './fno2300/fno2300.component';
import { Fno2310Component } from './fno2310/fno2310.component';
import { Fno3001Component } from './fno3001/fno3001.component';
import { Fno3100Component } from './fno3100/fno3100.component';
import { Fno9000Component } from './fno9000/fno9000.component';



@NgModule({
  declarations: [
    Fno0900Component,
    Fno0910Component,
    Fno1000Component,
    Fno1000v9Component,
    Fno1000v10Component,
    Fno1000v11Component,
    Fno1000v12Component,
    Fno1000v13Component,
    Fno1000v14Component,
    Fno1000v15Component,
    Fno1000v16Component,
    Fno1800Component,
    Fno2300Component,
    Fno2310Component,
    Fno3001Component,
    Fno3100Component,
    Fno9000Component,
  ],
  imports: [
    CommonModule,
    FnoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,MatAutocompleteModule,MatTabsModule,
    ModalModule,
    CaseModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [],
})
export class FnoModule { }