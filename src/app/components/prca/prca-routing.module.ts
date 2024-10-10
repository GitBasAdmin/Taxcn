import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuardService } from '@app/auth-guard.service';
import { Prca0500Component } from '@app/components/prca/prca0500/prca0500.component';
import { Prca0800Component } from '@app/components/prca/prca0800/prca0800.component';
import { Prca1800Component } from '@app/components/prca/prca1800/prca1800.component';
import { Prca1910Component } from '@app/components/prca/prca1910/prca1910.component';
import { Prca2100Component } from '@app/components/prca/prca2100/prca2100.component';
import { Prca3000Component } from '@app/components/prca/prca3000/prca3000.component';

const routes: Routes = [
  Shell.childRoutes([ {
    path: 'prca0500',
    component: Prca0500Component
  },{
    path: 'prca0800',
    component: Prca0800Component
  },{
    path: 'prca1800',
    component: Prca1800Component
  },{
    path: 'prca1910',
    component: Prca1910Component
  },{
    path: 'prca2100',
    component: Prca2100Component
  },{
    path: 'prca3000',
    component: Prca3000Component
  }])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrcaRoutingModule { }
