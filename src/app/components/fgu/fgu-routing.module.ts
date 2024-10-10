import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuardService } from '@app/auth-guard.service';

import { Fgu0100Component } from './fgu0100/fgu0100.component';
import { Fgu0100MainComponent } from './fgu0100-main/fgu0100-main.component';
import { Fgu0100Tab1Component } from './fgu0100-tab1/fgu0100-tab1.component';
import { Fgu0100Tab2Component } from './fgu0100-tab2/fgu0100-tab2.component';
import { Fgu0100Tab3Component } from './fgu0100-tab3/fgu0100-tab3.component';
import { Fgu0100Tab4Component } from './fgu0100-tab4/fgu0100-tab4.component';
import { Fgu0100Tab5Component } from './fgu0100-tab5/fgu0100-tab5.component';
import { Fgu0110Component } from './fgu0110/fgu0110.component';
import { Fgu0120Component } from './fgu0120/fgu0120.component';
import { Fgu0130Component } from './fgu0130/fgu0130.component';
import { Fgu0140Component } from './fgu0140/fgu0140.component';
import { Fgu0150Component } from './fgu0150/fgu0150.component';
import { Fgu0160Component } from './fgu0160/fgu0160.component';
import { Fgu0170Component } from './fgu0170/fgu0170.component';
import { Fgu0180Component } from './fgu0180/fgu0180.component';
import { Fgu0190Component } from './fgu0190/fgu0190.component';
import { Fgu0195Component } from './fgu0195/fgu0195.component';
import { Fgu0196Component } from './fgu0196/fgu0196.component';
import { Fgu0197Component } from './fgu0197/fgu0197.component';
import { GuarHeadComponent } from './guar-head/guar-head.component';

const routes: Routes = [
  Shell.childRoutes([ 
    { path: 'fgu0100', component: Fgu0100Component ,canActivate: [AuthGuardService]},
    { path: 'fgu0110', component: Fgu0110Component ,canActivate: [AuthGuardService]},
    { path: 'fgu0120', component: Fgu0120Component ,canActivate: [AuthGuardService]},
    { path: 'fgu0130', component: Fgu0130Component ,canActivate: [AuthGuardService]},
    { path: 'fgu0140', component: Fgu0140Component ,canActivate: [AuthGuardService]},
    { path: 'fgu0150', component: Fgu0150Component ,canActivate: [AuthGuardService]},
    { path: 'fgu0160', component: Fgu0160Component ,canActivate: [AuthGuardService]},
    { path: 'fgu0170', component: Fgu0170Component ,canActivate: [AuthGuardService]},
    { path: 'fgu0180', component: Fgu0180Component ,canActivate: [AuthGuardService]},
    { path: 'fgu0190', component: Fgu0190Component ,canActivate: [AuthGuardService]},
    { path: 'fgu0195', component: Fgu0195Component ,canActivate: [AuthGuardService]},
    { path: 'fgu0196', component: Fgu0196Component ,canActivate: [AuthGuardService]},
    { path: 'fgu0197', component: Fgu0197Component ,canActivate: [AuthGuardService]},
    { path: 'guar_head', component: GuarHeadComponent ,canActivate: [AuthGuardService]},
    {
      path: 'fgu0100_main',
      component: Fgu0100MainComponent,canActivate: [AuthGuardService],
    },{
      path: 'fgu0100_main',
      component: Fgu0100Tab1Component,canActivate: [AuthGuardService],
    },{
      path: 'fgu0100_tab1',
      component: Fgu0100Tab2Component,canActivate: [AuthGuardService],
    },{
      path: 'fgu0100_tab2',
      component: Fgu0100Tab3Component,canActivate: [AuthGuardService],
    },{
      path: 'fgu0100_tab3',
      component: Fgu0100Tab4Component,canActivate: [AuthGuardService],
    },{
      path: 'fgu0100_tab4',
      component: Fgu0100Tab5Component,canActivate: [AuthGuardService],
    }
  ])
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FguRoutingModule { }
