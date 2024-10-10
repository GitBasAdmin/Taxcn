import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuardService } from '@app/auth-guard.service';

import { Fsn1600Component } from './fsn1600/fsn1600.component';
import { Fsn1800Component } from './fsn1800/fsn1800.component';
import { Fsn3500Component } from './fsn3500/fsn3500.component';
import { Fsn0900Component } from './fsn0900/fsn0900.component';
import { Fsn1000Component } from './fsn1000/fsn1000.component';
import { Fsn2000Component } from './fsn2000/fsn2000.component';
import { Fsn1001Component } from './fsn1001/fsn1001.component';
import { Fsn1400Component } from './fsn1400/fsn1400.component';
import { Fsn1410Component } from './fsn1410/fsn1410.component';

const routes: Routes = [
  Shell.childRoutes([ 
    { path: 'fsn1600', component: Fsn1600Component ,canActivate: [AuthGuardService]},
    { path: 'fsn1800', component: Fsn1800Component ,canActivate: [AuthGuardService]},
    { path: 'fsn3500', component: Fsn3500Component ,canActivate: [AuthGuardService]},
    { path: 'fsn0900', component: Fsn0900Component ,canActivate: [AuthGuardService]},
    { path: 'fsn1000', component: Fsn1000Component ,canActivate: [AuthGuardService]},
    { path: 'fsn2000', component: Fsn2000Component ,canActivate: [AuthGuardService]},
    { path: 'fsn1001', component:Fsn1001Component,canActivate: [AuthGuardService]},
    { path: 'fsn1400', component:Fsn1400Component,canActivate: [AuthGuardService]},
    { path: 'fsn1410', component:Fsn1410Component,canActivate: [AuthGuardService]},
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FsnRoutingModule { }
