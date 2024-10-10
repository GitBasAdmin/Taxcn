import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/@shared/shared.module';
import { FfnRoutingModule } from '@app/components/ffn/ffn-routing.module';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';

import { ModalModule } from '../modal/modal.module'; // นำเข้า modal
import { CaseModule } from '../case/case.module'; // 

import { Ffn0100Component } from './ffn0100/ffn0100.component';
import { Ffn0200Component } from './ffn0200/ffn0200.component';
import { Ffn0400Component } from './ffn0400/ffn0400.component';
import { Ffn0420Component } from './ffn0420/ffn0420.component';
import { Ffn0421Component } from './ffn0421/ffn0421.component';
import { Ffn0500Component } from './ffn0500/ffn0500.component';
import { Ffn0700Component } from './ffn0700/ffn0700.component';
import { Ffn0620Component } from './ffn0620/ffn0620.component';
import { Ffn0800Component } from './ffn0800/ffn0800.component';
import { Ffn0900Component } from './ffn0900/ffn0900.component';
import { Ffn1400Component } from './ffn1400/ffn1400.component';
import { Ffn1600Component } from './ffn1600/ffn1600.component';
import { Ffn1610Component } from './ffn1610/ffn1610.component';

@NgModule({
  declarations: [
    Ffn0100Component,
    Ffn0200Component,
    Ffn0400Component,
    Ffn0420Component,
    Ffn0420Component,
    Ffn0421Component,
    Ffn0500Component,
    Ffn0500Component,
    Ffn0700Component,
    Ffn0700Component,
    Ffn0620Component,
    Ffn0620Component,
    Ffn0800Component,
    Ffn0900Component,
    Ffn0900Component,
    Ffn1400Component,
    Ffn1400Component,
    Ffn1600Component,
    Ffn1600Component,
    Ffn1610Component
  ],
  imports: [
    CommonModule,
    FfnRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,MatAutocompleteModule,MatTabsModule,
    ModalModule,
    CaseModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [],
})
export class FfnModule { }