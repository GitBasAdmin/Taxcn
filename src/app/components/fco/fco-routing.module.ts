import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuardService } from '@app/auth-guard.service';

import { Fco1300Component } from './fco1300/fco1300.component';
import { Fco0100Component } from './fco0100/fco0100.component';
import { Fco0200Component } from './fco0200/fco0200.component';
import { Fco0300Component } from './fco0300/fco0300.component';
import { Fco0300CaseComponent } from './fco0300-case/fco0300-case.component';
import { Fco0300NewCaseComponent } from './fco0300-new-case/fco0300-new-case.component';
import { Fco0400Component } from './fco0400/fco0400.component';
import { Fco0500Component } from './fco0500/fco0500.component';
import { Fco0600Component } from './fco0600/fco0600.component';
import { Fco0700Component } from './fco0700/fco0700.component';
import { Fco0800Component } from './fco0800/fco0800.component';
import { Fco0900Component } from './fco0900/fco0900.component';
import { Fco1400Component } from './fco1400/fco1400.component';
import { Fco1600Component } from './fco1600/fco1600.component';


const routes: Routes = [
  Shell.childRoutes([ 
    { path: 'fco1300', component: Fco1300Component ,canActivate: [AuthGuardService]},
    { path: 'fco0100', component: Fco0100Component ,canActivate: [AuthGuardService]},
    { path: 'fco0200', component: Fco0200Component ,canActivate: [AuthGuardService]},
    { path: 'fco0300', component: Fco0300Component ,canActivate: [AuthGuardService]},
    { path: 'fco0300_case', component: Fco0300CaseComponent ,canActivate: [AuthGuardService]},
    { path: 'fco0300_new_case', component: Fco0300NewCaseComponent ,canActivate: [AuthGuardService]},
    { path: 'fco0400', component: Fco0400Component ,canActivate: [AuthGuardService]},
    { path: 'fco0500', component: Fco0500Component ,canActivate: [AuthGuardService]},
    { path: 'fco0600', component: Fco0600Component ,canActivate: [AuthGuardService]},
    { path: 'fco0700', component: Fco0700Component ,canActivate: [AuthGuardService]},
    { path: 'fco0800', component: Fco0800Component ,canActivate: [AuthGuardService]},
    { path: 'fco0900', component: Fco0900Component ,canActivate: [AuthGuardService]},
    { path: 'fco1400', component: Fco1400Component ,canActivate: [AuthGuardService]},
    { path: 'fco1600', component: Fco1600Component ,canActivate: [AuthGuardService]}
  ])
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FcoRoutingModule { }
