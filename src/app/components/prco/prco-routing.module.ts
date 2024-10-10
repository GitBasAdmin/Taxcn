import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuardService } from '@app/auth-guard.service';
import { Prco0200Component } from '@app/components/prco/prco0200/prco0200.component';
import { Prco0300Component } from '@app/components/prco/prco0300/prco0300.component';
import { Prco1100Component } from '@app/components/prco/prco1100/prco1100.component';

const routes: Routes = [
  Shell.childRoutes([ {
    path: 'prco0200',
    component: Prco0200Component
  }, {
    path: 'prco0300',
    component: Prco0300Component
  }, {
    path: 'prco1100',
    component: Prco1100Component
  }])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrcoRoutingModule { }
