import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuardService } from '@app/auth-guard.service';

import { Fpo0100Component } from '@app/components/fpo/fpo0100/fpo0100.component';
import { Fpo0110Component } from '@app/components/fpo/fpo0110/fpo0110.component';
import { Fpo0200Component } from '@app/components/fpo/fpo0200/fpo0200.component';
import { Fpo0400Component } from '@app/components/fpo/fpo0400/fpo0400.component';
import { Fpo0500Component } from '@app/components/fpo/fpo0500/fpo0500.component';
const routes: Routes = [
  Shell.childRoutes([{
    path: 'fpo0100',
    component: Fpo0100Component, canActivate: [AuthGuardService], 
  }, {
    path: 'fpo0110',
    component: Fpo0110Component, canActivate: [AuthGuardService],
  }, {
    path: 'fpo0200',
    component: Fpo0200Component, canActivate: [AuthGuardService],
  }, {
    path: 'fpo0400',
    component: Fpo0400Component, canActivate: [AuthGuardService],
  }, {
    path: 'fpo0500',
    component: Fpo0500Component, canActivate: [AuthGuardService],
  }])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FpoRoutingModule { }
