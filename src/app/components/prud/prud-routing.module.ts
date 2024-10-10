import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuardService } from '@app/auth-guard.service';
import { Prud0200Component } from '@app/components/prud/prud0200/prud0200.component';
import { Prud0300Component } from '@app/components/prud/prud0300/prud0300.component';
import { Prud0410Component } from '@app/components/prud/prud0410/prud0410.component';
import { Prud0420Component } from '@app/components/prud/prud0420/prud0420.component';
import { Prud0500Component } from '@app/components/prud/prud0500/prud0500.component';
import { Prud0600Component } from '@app/components/prud/prud0600/prud0600.component';
import { Prud0900Component } from '@app/components/prud/prud0900/prud0900.component';
import { Prud1100Component } from '@app/components/prud/prud1100/prud1100.component';
import { Prud2000Component } from '@app/components/prud/prud2000/prud2000.component';
import { Prud2100Component } from '@app/components/prud/prud2100/prud2100.component';
import { Prud2600Component } from '@app/components/prud/prud2600/prud2600.component'; 

const routes: Routes = [
  Shell.childRoutes([ {
    path: 'prud0200',
    component: Prud0200Component
  }, {
    path: 'prud0300',
    component: Prud0300Component
  }, {
    path: 'prud0410',
    component: Prud0410Component
  }, {
    path: 'prud0420',
    component: Prud0420Component
  }, {
    path: 'prud0500',
    component: Prud0500Component
  }, {
    path: 'prud0600',
    component: Prud0600Component
  }, {
    path: 'prud0900',
    component: Prud0900Component
  }, {
    path: 'prud1100',
    component: Prud1100Component
  }, {
    path: 'prud2000',
    component: Prud2000Component
  }, {
    path: 'prud2100',
    component: Prud2100Component
  },  {
    path: 'prud2600',
    component: Prud2600Component
  }])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrudRoutingModule { }
