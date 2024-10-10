import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuardService } from '@app/auth-guard.service';

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


const routes: Routes = [
  Shell.childRoutes([ 
    { path: 'fkb0400', component: Fkb0400Component ,canActivate: [AuthGuardService]},
    { path: 'fkb0800', component: Fkb0800Component ,canActivate: [AuthGuardService]},
    { path: 'fkb9000', component: Fkb9000Component ,canActivate: [AuthGuardService]},
    { path: 'fkb0600', component: Fkb0600Component ,canActivate: [AuthGuardService]},
    { path: 'fkb0700', component: Fkb0700Component ,canActivate: [AuthGuardService]},
    { path: 'fkb0700_case', component: Fkb0700CaseComponent,canActivate: [AuthGuardService]},
    { path: 'fkb0610', component: Fkb0610Component ,canActivate: [AuthGuardService]},
    { path: 'fkb0900', component: Fkb0900Component ,canActivate: [AuthGuardService]},
    { path: 'fkb0310', component: Fkb0310Component ,canActivate: [AuthGuardService]},
    { path: 'fkb0301', component: Fkb0301Component ,canActivate: [AuthGuardService]},
    { path: 'fkb0200', component: Fkb0200Component ,canActivate: [AuthGuardService]},
    { path: 'fkb0500', component: Fkb0500Component ,canActivate: [AuthGuardService]},
    { path: 'fkb0510', component: Fkb0510Component ,canActivate: [AuthGuardService]},
    { path: 'fkb0100', component: Fkb0100Component ,canActivate: [AuthGuardService]},
  ])
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FkbRoutingModule { }
