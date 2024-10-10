import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuardService } from '@app/auth-guard.service';
import { Prpo0300Component } from '@app/components/prpo/prpo0300/prpo0300.component';
import { Prpo0500Component } from '@app/components/prpo/prpo0500/prpo0500.component';
import { Prpo0900Component } from '@app/components/prpo/prpo0900/prpo0900.component';
import { Prpo1400Component } from '@app/components/prpo/prpo1400/prpo1400.component';
import { Prpo1500Component } from '@app/components/prpo/prpo1500/prpo1500.component';
import { Prpo1700Component } from '@app/components/prpo/prpo1700/prpo1700.component';
import { Prpo1900Component } from '@app/components/prpo/prpo1900/prpo1900.component';

const routes: Routes = [
  Shell.childRoutes([ {
    path: 'prpo0300',
    component: Prpo0300Component
  },{
    path: 'prpo0500',
    component: Prpo0500Component
  },{
    path: 'prpo0900',
    component: Prpo0900Component
  },{
    path: 'prpo1400',
    component: Prpo1400Component
  },{
    path: 'prpo1500',
    component: Prpo1500Component
  },{
    path: 'prpo1700',
    component: Prpo1700Component
  },{
    path: 'prpo1900',
    component: Prpo1900Component
  }
])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrpoRoutingModule { }
