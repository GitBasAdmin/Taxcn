import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuardService } from '@app/auth-guard.service';

import { Fmg0300Component } from './fmg0300/fmg0300.component';
import { Fmg0200Component } from './fmg0200/fmg0200.component';
import { Fmg0100Component } from './fmg0100/fmg0100.component';
import { Fmg0101Component } from './fmg0101/fmg0101.component';
import { Fmg0101PrintComponent } from './fmg0101_print/fmg0101_print.component';
import { Fmg0102Component } from './fmg0102/fmg0102.component';
import { Fmg0105Component } from './fmg0105/fmg0105.component';
import { Fmg0106Component } from './fmg0106/fmg0106.component';
import { Fmg0120Component } from './fmg0120/fmg0120.component';
import { Fmg1300Component } from './fmg1300/fmg1300.component';
import { Fmg2000Component } from './fmg2000/fmg2000.component';
import { Fmg2100Component } from './fmg2100/fmg2100.component';
import { Fmg2300Component } from './fmg2300/fmg2300.component';
import { Fmg5000Component } from './fmg5000/fmg5000.component';
import { Fmg1203Component } from './fmg1203/fmg1203.component';
import { Fmg1204Component } from './fmg1204/fmg1204.component';
import { Fmg2301Component } from './fmg2301/fmg2301.component';


const routes: Routes = [
  Shell.childRoutes([ 
    { path: 'fmg0300', component: Fmg0300Component ,canActivate: [AuthGuardService]},
    { path: 'fmg0200', component: Fmg0200Component ,canActivate: [AuthGuardService]},
    { path: 'fmg0100', component: Fmg0100Component ,canActivate: [AuthGuardService]},
    { path: 'fmg0101', component: Fmg0101Component ,canActivate: [AuthGuardService]},
    { path: 'fmg0101_print', component: Fmg0101PrintComponent ,canActivate: [AuthGuardService]},
    { path: 'fmg0102', component: Fmg0102Component ,canActivate: [AuthGuardService]},
    { path: 'fmg0105', component: Fmg0105Component ,canActivate: [AuthGuardService]},
    { path: 'fmg0106', component: Fmg0106Component ,canActivate: [AuthGuardService]},
    { path: 'fmg0120', component: Fmg0120Component ,canActivate: [AuthGuardService]},
    { path: 'fmg1300', component: Fmg1300Component ,canActivate: [AuthGuardService]},
    { path: 'fmg2000', component: Fmg2000Component ,canActivate: [AuthGuardService]},
    { path: 'fmg2100', component: Fmg2100Component ,canActivate: [AuthGuardService]},
    { path: 'fmg2300', component: Fmg2300Component ,canActivate: [AuthGuardService]},
    { path: 'fmg5000', component: Fmg5000Component ,canActivate: [AuthGuardService]},
    { path: 'fmg1203', component:Fmg1203Component,canActivate: [AuthGuardService]},
    { path: 'fmg1204', component:Fmg1204Component,canActivate: [AuthGuardService]},
    { path: 'fmg2301', component: Fmg2301Component,canActivate: [AuthGuardService]},
  ])
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FmgRoutingModule { }
