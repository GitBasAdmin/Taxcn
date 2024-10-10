import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuardService } from '@app/auth-guard.service';

import { Fap0100Component } from './fap0100/fap0100.component';
import { Fap0111Component } from './fap0111/fap0111.component';
import { Fap0110Component } from './fap0110/fap0110.component';
import { Fap0110ColorComponent } from './fap0110-color/fap0110-color.component';
import { Fap0130Component } from './fap0130/fap0130.component';
import { Fap0140Component } from './fap0140/fap0140.component';
import { Fap0150Component } from './fap0150/fap0150.component';
import { Fap1400Component } from './fap1400/fap1400.component';
import { Fap0200Component } from './fap0200/fap0200.component';
import { Fap0700Component } from './fap0700/fap0700.component';
import { Fap0300Component } from './fap0300/fap0300.component';
import { Fap1000Component } from './fap1000/fap1000.component';
import { JudgeAppointComponent } from './judge-appoint/judge-appoint.component';


const routes: Routes = [
  Shell.childRoutes([ 
    { path: 'fap0100', component: Fap0100Component ,canActivate: [AuthGuardService]},
    { path: 'fap0111', component: Fap0111Component ,canActivate: [AuthGuardService]},
    { path: 'fap0110', component: Fap0110Component ,canActivate: [AuthGuardService]},
    { path: 'fap0110-color', component: Fap0110ColorComponent ,canActivate: [AuthGuardService]},
    { path: 'fap0130', component: Fap0130Component ,canActivate: [AuthGuardService]},
    { path: 'fap0140', component: Fap0140Component ,canActivate: [AuthGuardService]},
    { path: 'fap0150', component: Fap0150Component ,canActivate: [AuthGuardService]},
    { path: 'fap1400', component: Fap1400Component ,canActivate: [AuthGuardService]},
    { path: 'fap0200', component: Fap0200Component ,canActivate: [AuthGuardService]},
    { path: 'fap0700', component: Fap0700Component ,canActivate: [AuthGuardService]},
    { path: 'fap0300', component: Fap0300Component ,canActivate: [AuthGuardService]},
    { path: 'fap1000', component: Fap1000Component ,canActivate: [AuthGuardService]},
    { path: 'judge_appoint', component: JudgeAppointComponent ,canActivate: [AuthGuardService]},
  ])
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FapRoutingModule { }
