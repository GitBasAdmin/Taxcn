import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuardService } from '@app/auth-guard.service';

import { Pras0100Component } from './pras0100/pras0100.component';

const routes: Routes = [
  Shell.childRoutes([ 
    { path: 'pras1000', component:Pras0100Component },
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrasRoutingModule { }
