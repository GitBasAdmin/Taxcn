import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuardService } from '@app/auth-guard.service';

import { Fsc0100Component } from './fsc0100/fsc0100.component';
import { Fsc0200Component } from './fsc0200/fsc0200.component';
import { Fsc0500Component } from './fsc0500/fsc0500.component';
import { Fsc0600Component } from './fsc0600/fsc0600.component';
import { Fsc0300Component } from './fsc0300/fsc0300.component';

const routes: Routes = [
  Shell.childRoutes([ 
    { path: 'fsc0100', component: Fsc0100Component ,canActivate: [AuthGuardService]},
    { path: 'fsc0200', component: Fsc0200Component ,canActivate: [AuthGuardService]},
    { path: 'fsc0500', component: Fsc0500Component ,canActivate: [AuthGuardService]},
    { path: 'fsc0600', component: Fsc0600Component ,canActivate: [AuthGuardService]},
    { path: 'fsc0300', component: Fsc0300Component ,canActivate: [AuthGuardService]},
  ])
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FscRoutingModule { }
