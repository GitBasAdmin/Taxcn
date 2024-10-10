import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuardService } from '@app/auth-guard.service';
import { Prmg0100Component } from '@app/components/prmg/prmg0100/prmg0100.component';
import { Prmg0200Component } from '@app/components/prmg/prmg0200/prmg0200.component';
import { Prmg0300Component } from '@app/components/prmg/prmg0300/prmg0300.component';
import { Prmg0400Component } from '@app/components/prmg/prmg0400/prmg0400.component';
import { Prmg0700Component } from '@app/components/prmg/prmg0700/prmg0700.component';
import { Prmg0500Component } from '@app/components/prmg/prmg0500/prmg0500.component';
import { Prmg2800Component } from '@app/components/prmg/prmg2800/prmg2800.component';

const routes: Routes = [
  Shell.childRoutes([ {
    path: 'prmg0100',
    component: Prmg0100Component
  },{
    path: 'prmg0200',
    component: Prmg0200Component
  },{
    path: 'prmg0300',
    component: Prmg0300Component
  },{
    path: 'prmg0400',
    component: Prmg0400Component
  },{
    path: 'prmg0700',
    component: Prmg0700Component
  },{
    path: 'prmg0500',
    component: Prmg0500Component
  },{
    path: 'prmg2800',
    component: Prmg2800Component
  }])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrmgRoutingModule { }
