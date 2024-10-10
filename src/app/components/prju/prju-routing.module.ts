import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuardService } from '@app/auth-guard.service';
import { Prju0200Component } from '@app/components/prju/prju0200/prju0200.component';
import { Prju0300Component } from '@app/components/prju/prju0300/prju0300.component';
import { Prju0700Component } from '@app/components/prju/prju0700/prju0700.component';
import { Prju0800Component } from '@app/components/prju/prju0800/prju0800.component';
import { Prju1100Component } from '@app/components/prju/prju1100/prju1100.component';
import { Prju1200Component } from '@app/components/prju/prju1200/prju1200.component';
import { Prju2000Component } from '@app/components/prju/prju2000/prju2000.component';
import { Prju2400Component } from '@app/components/prju/prju2400/prju2400.component';

const routes: Routes = [
  Shell.childRoutes([ {
    path: 'prju0200',
    component: Prju0200Component
  },{
    path: 'prju0300',
    component: Prju0300Component
  },{
    path: 'prju0700',
    component: Prju0700Component
  },{
    path: 'prju0800',
    component: Prju0800Component
  },{
    path: 'prju1100',
    component: Prju1100Component
  },{
    path: 'prju1200',
    component: Prju1200Component
  },{
    path: 'prju2000',
    component: Prju2000Component
  },{
    path: 'prju2400',
    component: Prju2400Component
  }])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrjuRoutingModule { }
