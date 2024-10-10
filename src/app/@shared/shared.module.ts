import { NgModule } from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgSelectModule, NgSelectConfig } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
//import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { ComponentsModule } from '@shared/components/components.module';
@NgModule({
  imports: [
    
  ],
  exports: [
    NgxSpinnerModule,
    NgSelectModule,
    DataTablesModule,
    NgbModule,
    ComponentsModule
    //AutocompleteLibModule
  ],
  providers: [
    //NgSelectModule,
  ]
})
export class SharedModule { }
