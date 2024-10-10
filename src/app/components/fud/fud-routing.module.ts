import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuardService } from '@app/auth-guard.service';

import { Fud0100Component } from './fud0100/fud0100.component';
import { Fud0110Component } from './fud0110/fud0110.component';
import { Fud0111Component } from './fud0111/fud0111.component';
import { Fud0113Component } from './fud0113/fud0113.component';
import { Fud0114Component } from './fud0114/fud0114.component';
import { Fud0120Component } from './fud0120/fud0120.component';
import { Fud0130Component } from './fud0130/fud0130.component';
import { Fud1700Component } from './fud1700/fud1700.component';
import { Fud9000Component } from './fud9000/fud9000.component';

const routes: Routes = [
  Shell.childRoutes([ 
    { path: 'fud0100', component: Fud0100Component ,canActivate: [AuthGuardService]},
  { path: 'fud0110', component: Fud0110Component ,canActivate: [AuthGuardService]},
  { path: 'fud0111', component: Fud0111Component ,canActivate: [AuthGuardService]},
  { path: 'fud0113', component: Fud0113Component ,canActivate: [AuthGuardService]},
  { path: 'fud0114', component: Fud0114Component ,canActivate: [AuthGuardService]},
  { path: 'fud0120', component: Fud0120Component ,canActivate: [AuthGuardService]},
  { path: 'fud0130', component: Fud0130Component ,canActivate: [AuthGuardService]},
  { path: 'fud1700', component: Fud1700Component ,canActivate: [AuthGuardService]},
  { path: 'fud9000', component: Fud9000Component ,canActivate: [AuthGuardService]},
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FudRoutingModule { }
