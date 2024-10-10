import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuardService } from '@app/auth-guard.service';
import { Prno3000Component } from '@app/components/prno/prno3000/prno3000.component';
import { Prno3700Component } from '@app/components/prno/prno3700/prno3700.component';
import { Prno3800Component } from '@app/components/prno/prno3800/prno3800.component';
import { Prno4000Component } from '@app/components/prno/prno4000/prno4000.component';
import { Prno5000Component } from '@app/components/prno/prno5000/prno5000.component';

const routes: Routes = [
  Shell.childRoutes([ {
    path: 'prno3000',
    component: Prno3000Component
  },{
    path: 'prno3700',
    component: Prno3700Component
  },{
    path: 'prno3800',
    component: Prno3800Component
  },{
    path: 'prno4000',
    component: Prno4000Component
  },{
    path: 'prno5000',
    component: Prno5000Component
  }])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrnoRoutingModule { }
