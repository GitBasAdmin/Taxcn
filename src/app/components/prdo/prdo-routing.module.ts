import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuardService } from '@app/auth-guard.service';
import { Prdo0200Component } from '@app/components/prdo/prdo0200/prdo0200.component';
import { Prdo0500Component } from '@app/components/prdo/prdo0500/prdo0500.component';
import { Prdo0800Component } from '@app/components/prdo/prdo0800/prdo0800.component';
import { Prdo1200Component } from '@app/components/prdo/prdo1200/prdo1200.component';
import { Prdo1300Component } from '@app/components/prdo/prdo1300/prdo1300.component';
import { Prdo1500Component } from '@app/components/prdo/prdo1500/prdo1500.component';
import { Prdo1600Component } from '@app/components/prdo/prdo1600/prdo1600.component';
import { Prdo1800Component } from '@app/components/prdo/prdo1800/prdo1800.component';
import { Prdo2600Component } from '@app/components/prdo/prdo2600/prdo2600.component';


const routes: Routes = [
  Shell.childRoutes([ {
    path: 'prdo0200',
    component: Prdo0200Component
  },{
    path: 'prdo0500',
    component: Prdo0500Component
  },{
    path: 'prdo0800',
    component: Prdo0800Component
  },{
    path: 'prdo1200',
    component: Prdo1200Component
  },{
    path: 'prdo1300',
    component: Prdo1300Component
  },{
    path: 'prdo1500',
    component: Prdo1500Component
  },{
    path: 'prdo1600',
    component: Prdo1600Component
  },{
    path: 'prdo1800',
    component: Prdo1800Component
  },{
    path: 'prdo2600',
    component: Prdo2600Component
  }])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrdoRoutingModule { }
