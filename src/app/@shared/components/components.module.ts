import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { CaseHeadComponent } from '@shared/components/case-head/case-head.component';
import { CasepHeadComponent } from '@shared/components/casep-head/casep-head.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [
    // CaseHeadComponent,
    CasepHeadComponent
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    DataTablesModule
  ],
  exports: [
    // CaseHeadComponent,
    CasepHeadComponent
  ]
})
export class ComponentsModule { }
