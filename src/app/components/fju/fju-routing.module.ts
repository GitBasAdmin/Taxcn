import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuardService } from '@app/auth-guard.service';

import { Fju0100Component } from './fju0100/fju0100.component';
import { Fju0100HeadComponent } from './fju0100-head/fju0100-head.component';
import { Fju0100MainComponent } from './fju0100-main/fju0100-main.component';
import { Fju0100Tab1Component } from './fju0100-tab1/fju0100-tab1.component';
import { Fju0100Tab2Component } from './fju0100-tab2/fju0100-tab2.component';
import { Fju0600Component } from './fju0600/fju0600.component';
import { Fju0600HistoryComponent } from './fju0600-history/fju0600-history.component';
import { Fju6000Component } from './fju6000/fju6000.component';
import { Fju0200Component } from './fju0200/fju0200.component';
import { Fju0800Component } from './fju0800/fju0800.component';
import { Fju0500Component } from './fju0500/fju0500.component';
import { Fju0630Component } from './fju0630/fju0630.component';
import { Fju0900Component } from './fju0900/fju0900.component';
import { Fju1000Component } from './fju1000/fju1000.component';
import { Fju0610Component } from './fju0610/fju0610.component';
import { Fju0620Component } from './fju0620/fju0620.component';


const routes: Routes = [
  Shell.childRoutes([ 
    { path: 'fju0100', component: Fju0100Component ,canActivate: [AuthGuardService]},
    { path: 'fju0100_head', component: Fju0100HeadComponent ,canActivate: [AuthGuardService]},
    { path: 'fju0100_main', component: Fju0100MainComponent ,canActivate: [AuthGuardService]},
    { path: 'fju0100_tab1', component: Fju0100Tab1Component ,canActivate: [AuthGuardService]},
    { path: 'fju0100_tab2', component: Fju0100Tab2Component ,canActivate: [AuthGuardService]},

    { path: 'fju0200', component: Fju0200Component ,canActivate: [AuthGuardService]},
    { path: 'fju0600', component: Fju0600Component ,canActivate: [AuthGuardService]},
    { path: 'fju0600_history', component: Fju0600HistoryComponent ,canActivate: [AuthGuardService]},
    { path: 'fju6000', component: Fju6000Component ,canActivate: [AuthGuardService]},
    { path: 'fju0800', component: Fju0800Component ,canActivate: [AuthGuardService]},
    { path: 'fju0500', component: Fju0500Component ,canActivate: [AuthGuardService]},
    { path: 'fju0630', component: Fju0630Component ,canActivate: [AuthGuardService]},
    { path: 'fju0900', component: Fju0900Component ,canActivate: [AuthGuardService]},
    { path: 'fju1000', component: Fju1000Component ,canActivate: [AuthGuardService]},
    { path: 'fju0610', component: Fju0610Component ,canActivate: [AuthGuardService]},
    { path: 'fju0620', component: Fju0620Component ,canActivate: [AuthGuardService]},
  ])
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FjuRoutingModule { }
