import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuardService } from '@app/auth-guard.service';

import { Prsn0100Component } from './prsn0100/prsn0100.component';
import { Prsn1200Component } from './prsn1200/prsn1200.component';
import { Prsn1900Component } from './prsn1900/prsn1900.component';
import { Prsn1100Component } from './prsn1100/prsn1100.component';
import { Prsn2100Component } from './prsn2100/prsn2100.component';
import { Prsn3400Component } from './prsn3400/prsn3400.component';

const routes: Routes = [
  Shell.childRoutes([ 
    { path: 'prsn1200', component:Prsn1200Component },
    { path: 'prsn0100', component:Prsn0100Component },
    { path: 'prsn1900', component:Prsn1900Component },
    { path: 'prsn1100', component:Prsn1100Component },
    { path: 'prsn2100', component:Prsn2100Component },
    { path: 'prsn3400', component:Prsn3400Component },
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrsnRoutingModule { }
