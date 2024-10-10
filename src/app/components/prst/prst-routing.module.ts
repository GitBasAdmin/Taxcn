import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuardService } from '@app/auth-guard.service';
import { Prst5500Component } from '@app/components/prst/prst5500/prst5500.component';
import { Prst6400Component } from '@app/components/prst/prst6400/prst6400.component';

const routes: Routes = [
  Shell.childRoutes([ {
    path: 'prst5500',
    component: Prst5500Component
  },{
    path: 'prst6400',
    component: Prst6400Component
  }])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrstRoutingModule { }
