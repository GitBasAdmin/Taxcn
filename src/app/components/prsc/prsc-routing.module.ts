import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuardService } from '@app/auth-guard.service';
import { Prsc0100Component } from '@app/components/prsc/prsc0100/prsc0100.component';
import { Prsc0200Component } from '@app/components/prsc/prsc0200/prsc0200.component';
import { Prsc0201Component } from '@app/components/prsc/prsc0201/prsc0201.component';
import { Prsc0400Component } from '@app/components/prsc/prsc0400/prsc0400.component';
import { Prsc0700Component } from '@app/components/prsc/prsc0700/prsc0700.component';
import { Prsc0800Component } from '@app/components/prsc/prsc0800/prsc0800.component';
import { Prsc0900Component } from '@app/components/prsc/prsc0900/prsc0900.component';

const routes: Routes = [
  Shell.childRoutes([ {
    path: 'prsc0100',
    component: Prsc0100Component
  },{
    path: 'prsc0200',
    component: Prsc0200Component
  },{
    path: 'prsc0201',
    component: Prsc0201Component
  },{
    path: 'prsc0400',
    component: Prsc0400Component
  },{
    path: 'prsc0700',
    component: Prsc0700Component
  },{
    path: 'prsc0800',
    component: Prsc0800Component
  },{
    path: 'prsc0900',
    component: Prsc0900Component
  }])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrscRoutingModule { }
