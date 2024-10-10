import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuardService } from '@app/auth-guard.service';

import { Prgu2400Component } from './prgu2400/prgu2400.component';
import { Prgu2500Component } from './prgu2500/prgu2500.component';
import { Prgu2600Component } from './prgu2600/prgu2600.component';
import { Prgu2900Component } from './prgu2900/prgu2900.component';
import { Prgu3100Component } from './prgu3100/prgu3100.component';
import { Prgu0300Component } from './prgu0300/prgu0300.component';
import { Prgu0400Component } from './prgu0400/prgu0400.component';
import { Prgu0410Component } from './prgu0410/prgu0410.component';

const routes: Routes = [
  Shell.childRoutes([ 
    { path: 'prgu2400', component:Prgu2400Component },
  { path: 'prgu2500', component:Prgu2500Component },
  { path: 'prgu2600', component:Prgu2600Component },
  { path: 'prgu2900', component:Prgu2900Component },
  { path: 'prgu3100', component:Prgu3100Component },
  { path: 'prgu0300', component:Prgu0300Component },
  { path: 'prgu0400', component:Prgu0400Component },
  { path: 'prgu0410', component:Prgu0410Component },
  ])
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrguRoutingModule { }
