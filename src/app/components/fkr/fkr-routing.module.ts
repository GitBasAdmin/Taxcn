import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuardService } from '@app/auth-guard.service';

import { Fkr0100Component } from './fkr0100/fkr0100.component';
import { Fkr0200Component } from './fkr0200/fkr0200.component';
import { Fkr0300Component } from './fkr0300/fkr0300.component';

const routes: Routes = [
  Shell.childRoutes([ 
    { path: 'fkr0100', component: Fkr0100Component ,canActivate: [AuthGuardService]},
    { path: 'fkr0200', component: Fkr0200Component ,canActivate: [AuthGuardService]},
    { path: 'fkr0300', component: Fkr0300Component ,canActivate: [AuthGuardService]},
  ])
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FkrRoutingModule { }
