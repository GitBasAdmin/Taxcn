import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuardService } from '@app/auth-guard.service';

import { Fci0100Component } from './fci0100/fci0100.component';
import { Fci0300Component } from './fci0300/fci0300.component';
import { Fci0900Component } from './fci0900/fci0900.component';


const routes: Routes = [
  Shell.childRoutes([ 
    { path: 'fci0100', component: Fci0100Component ,canActivate: [AuthGuardService]},
    { path: 'fci0300', component: Fci0300Component ,canActivate: [AuthGuardService]},
    { path: 'fci0900', component: Fci0900Component ,canActivate: [AuthGuardService]}
  ])
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FciRoutingModule { }
