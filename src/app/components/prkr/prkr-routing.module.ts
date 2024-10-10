import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuardService } from '@app/auth-guard.service';

import { Prkr0100Component } from '@app/components/prkr/prkr0100/prkr0100.component';
import { Prkr0500Component } from '@app/components/prkr/prkr0500/prkr0500.component';
import { Prkr0700Component } from '@app/components/prkr/prkr0700/prkr0700.component';
import { Prkr0800Component } from '@app/components/prkr/prkr0800/prkr0800.component';
import { Prkr0900Component } from '@app/components/prkr/prkr0900/prkr0900.component';
import { Prkr1000Component } from '@app/components/prkr/prkr1000/prkr1000.component';

const routes: Routes = [
  Shell.childRoutes([ {
    path: 'prkr0100',
    component: Prkr0100Component
  },{
    path: 'prkr0500',
    component: Prkr0500Component
  },{
    path: 'prkr0700',
    component: Prkr0700Component
  },{
    path: 'prkr0800',
    component: Prkr0800Component
  },{
    path: 'prkr0900',
    component: Prkr0900Component
  },{
    path: 'prkr1000',
    component: Prkr1000Component
  }])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrkrRoutingModule { }
