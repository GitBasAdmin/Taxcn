import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuardService } from '@app/auth-guard.service';
import { Prci0500Component } from '@app/components/prci/prci0500/prci0500.component';
import { Prci0600Component } from '@app/components/prci/prci0600/prci0600.component';
import { Prci0700Component } from '@app/components/prci/prci0700/prci0700.component';
import { Prci1200Component } from '@app/components/prci/prci1200/prci1200.component';
import { Prci1300Component } from '@app/components/prci/prci1300/prci1300.component';
import { Prci1400Component } from '@app/components/prci/prci1400/prci1400.component';
import { Prci1500Component } from '@app/components/prci/prci1500/prci1500.component';
import { Prci1800Component } from '@app/components/prci/prci1800/prci1800.component';
import { Prci1900Component } from '@app/components/prci/prci1900/prci1900.component';
import { Prci2100Component } from '@app/components/prci/prci2100/prci2100.component';
import { Prci2200Component } from '@app/components/prci/prci2200/prci2200.component';
import { Prci2600Component } from '@app/components/prci/prci2600/prci2600.component';
import { Prci2700Component } from '@app/components/prci/prci2700/prci2700.component';
import { Prci2900Component } from '@app/components/prci/prci2900/prci2900.component';
import { Prci4000Component } from '@app/components/prci/prci4000/prci4000.component';

const routes: Routes = [
  Shell.childRoutes([ {
    path: 'prci0500',
    component: Prci0500Component
  },{
    path: 'prci0600',
    component: Prci0600Component
  },{
    path: 'prci0700',
    component: Prci0700Component
  },{
    path: 'prci1200',
    component: Prci1200Component
  },{
    path: 'prci1300',
    component: Prci1300Component
  },{
    path: 'prci1400',
    component: Prci1400Component
  },{
    path: 'prci1500',
    component: Prci1500Component
  },{
    path: 'prci1800',
    component: Prci1800Component
  },{
    path: 'prci1900',
    component: Prci1900Component
  },{
    path: 'prci2100',
    component: Prci2100Component
  },{
    path: 'prci2200',
    component: Prci2200Component
  },{
    path: 'prci2600',
    component: Prci2600Component
  },{
    path: 'prci2700',
    component: Prci2700Component
  },{
    path: 'prci2900',
    component: Prci2900Component
  },{
    path: 'prci4000',
    component: Prci4000Component
  }
])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrciRoutingModule { }
