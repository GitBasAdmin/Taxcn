import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuardService } from '@app/auth-guard.service';

import { Prkn0100Component } from './prkn0100/prkn0100.component';

const routes: Routes = [
  Shell.childRoutes([ 
    { path: 'prkn0100', component:Prkn0100Component},
  ])
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrknRoutingModule { }
