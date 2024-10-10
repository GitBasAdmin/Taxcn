import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuardService } from '@app/auth-guard.service';

import { CaseHeaderComponent } from './case-header/case-header.component';
import { CaseHeadComponent } from './case-head/case-head.component';

const routes: Routes = [
  Shell.childRoutes([ {
    path: 'case_header',
    component: CaseHeaderComponent,canActivate: [AuthGuardService]
  },{
    path: 'case_head',
    component: CaseHeadComponent,canActivate: [AuthGuardService],
  }
])
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CaseRoutingModule { }
