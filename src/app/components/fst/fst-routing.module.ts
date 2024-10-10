import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuardService } from '@app/auth-guard.service';

import { Fst2300Component } from './fst2300/fst2300.component';
import { Fst2530Component } from './fst2530/fst2530.component';
import { Fst2400Component } from './fst2400/fst2400.component';
import { Fst1320Component } from './fst1320/fst1320.component';
import { Fst2320Component } from './fst2320/fst2320.component';
import { Fst1400Component } from './fst1400/fst1400.component';
import { Fst1410Component } from './fst1410/fst1410.component';
import { Fst2410Component } from './fst2410/fst2410.component';
import { Fst2420Component } from './fst2420/fst2420.component';
import { Fst1430Component } from './fst1430/fst1430.component';
import { Fst2430Component } from './fst2430/fst2430.component';
import { Fst2500Component } from './fst2500/fst2500.component';
import { Fst2510Component } from './fst2510/fst2510.component';
import { Fst2600Component } from './fst2600/fst2600.component';
import { Fst0100Component } from './fst0100/fst0100.component';
import { Fst0110Component } from './fst0110/fst0110.component';
import { Fst0200Component } from './fst0200/fst0200.component';
import { Fst0210Component } from './fst0210/fst0210.component';
import { Fst0220Component } from './fst0220/fst0220.component';
import { Fst0230Component } from './fst0230/fst0230.component';
import { Fst0240Component } from './fst0240/fst0240.component';
import { Fst0250Component } from './fst0250/fst0250.component';
import { Fst0260Component } from './fst0260/fst0260.component';
import { Fst0270Component } from './fst0270/fst0270.component';
import { Fst0290Component } from './fst0290/fst0290.component';
import { Fst0300Component } from './fst0300/fst0300.component';
import { Fst0310Component } from './fst0310/fst0310.component';

const routes: Routes = [
  Shell.childRoutes([ 
    { path: 'fst2300', component: Fst2300Component ,canActivate: [AuthGuardService]},
    { path: 'fst2530', component: Fst2530Component ,canActivate: [AuthGuardService]},
    { path: 'fst2400', component: Fst2400Component ,canActivate: [AuthGuardService]},
    { path: 'fst1320', component: Fst1320Component ,canActivate: [AuthGuardService]},
    { path: 'fst2320', component: Fst2320Component ,canActivate: [AuthGuardService]},
    { path: 'fst1400', component: Fst1400Component ,canActivate: [AuthGuardService]},
    { path: 'fst1410', component: Fst1410Component ,canActivate: [AuthGuardService]},
    { path: 'fst2410', component: Fst2410Component ,canActivate: [AuthGuardService]},
    { path: 'fst2420', component: Fst2420Component ,canActivate: [AuthGuardService]},
    { path: 'fst1430', component: Fst1430Component ,canActivate: [AuthGuardService]},
    { path: 'fst2430', component: Fst2430Component ,canActivate: [AuthGuardService]},
    { path: 'fst2500', component: Fst2500Component ,canActivate: [AuthGuardService]},
    { path: 'fst2510', component: Fst2510Component ,canActivate: [AuthGuardService]},
    { path: 'fst2600', component: Fst2600Component ,canActivate: [AuthGuardService]},
    { path: 'fst0100', component: Fst0100Component ,canActivate: [AuthGuardService]},
    { path: 'fst0110', component: Fst0110Component ,canActivate: [AuthGuardService]},
    { path: 'fst0200', component: Fst0200Component ,canActivate: [AuthGuardService]},
    { path: 'fst0210', component: Fst0210Component ,canActivate: [AuthGuardService]},
    { path: 'fst0220', component: Fst0220Component ,canActivate: [AuthGuardService]},
    { path: 'fst0230', component: Fst0230Component ,canActivate: [AuthGuardService]},
    { path: 'fst0240', component: Fst0240Component ,canActivate: [AuthGuardService]},
    { path: 'fst0250', component: Fst0250Component ,canActivate: [AuthGuardService]},
    { path: 'fst0260', component: Fst0260Component ,canActivate: [AuthGuardService]},
    { path: 'fst0270', component: Fst0270Component ,canActivate: [AuthGuardService]},
    { path: 'fst0290', component: Fst0290Component ,canActivate: [AuthGuardService]},
    { path: 'fst0300', component: Fst0300Component ,canActivate: [AuthGuardService]},
    { path: 'fst0310', component: Fst0310Component ,canActivate: [AuthGuardService]},
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FstRoutingModule { }
