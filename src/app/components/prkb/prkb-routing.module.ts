import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuardService } from '@app/auth-guard.service';

import { Prkb0500Component } from '@app/components/prkb/prkb0500/prkb0500.component';
import { Prkb0800Component } from '@app/components/prkb/prkb0800/prkb0800.component';
import { Prkb1000Component } from '@app/components/prkb/prkb1000/prkb1000.component';
import { Prkb1100Component } from '@app/components/prkb/prkb1100/prkb1100.component';
import { Prkb1300Component } from '@app/components/prkb/prkb1300/prkb1300.component';

const routes: Routes = [
  Shell.childRoutes([ {
    path: 'prkb0500',
    component: Prkb0500Component
  },{
    path: 'prkb0800',
    component: Prkb0800Component
  },{
    path: 'prkb1000',
    component: Prkb1000Component
  },{
    path: 'prkb1100',
    component: Prkb1100Component
  },{
    path: 'prkb1300',
    component: Prkb1300Component
  }])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrkbRoutingModule { }
