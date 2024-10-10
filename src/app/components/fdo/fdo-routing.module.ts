import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { Fdo0100Component } from '@app/components/fdo/fdo0100/fdo0100.component';
import { Fdo0200Component } from '@app/components/fdo/fdo0200/fdo0200.component';
import { Fdo9000Component } from '@app/components/fdo/fdo9000/fdo9000.component';
import { Fdo0400Component } from '@app/components/fdo/fdo0400/fdo0400.component';
import { Fdo0500Component } from '@app/components/fdo/fdo0500/fdo0500.component';
import { AuthGuardService } from '@app/auth-guard.service';

const routes: Routes = [
  
  Shell.childRoutes([{
    path: 'fdo0100',
    component: Fdo0100Component,canActivate: [AuthGuardService],
  }, {
    path: 'fdo0200',
    component: Fdo0200Component,canActivate: [AuthGuardService],
  },{
    path: 'fdo0400',
    component: Fdo0400Component,
  },{
    path: 'fdo0500',
    component: Fdo0500Component
  }, {
    path: 'fdo9000',
    component: Fdo9000Component,
  }])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FdoRoutingModule { }
