import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuardService } from '@app/auth-guard.service';


import { Ffn0100Component } from './ffn0100/ffn0100.component';
import { Ffn0200Component } from './ffn0200/ffn0200.component';
import { Ffn0400Component } from './ffn0400/ffn0400.component';
import { Ffn0420Component } from './ffn0420/ffn0420.component';
import { Ffn0421Component } from './ffn0421/ffn0421.component';
import { Ffn0500Component } from './ffn0500/ffn0500.component';
import { Ffn0700Component } from './ffn0700/ffn0700.component';
import { Ffn0620Component } from './ffn0620/ffn0620.component';
import { Ffn0800Component } from './ffn0800/ffn0800.component';
import { Ffn0900Component } from './ffn0900/ffn0900.component';
import { Ffn1400Component } from './ffn1400/ffn1400.component';
import { Ffn1600Component } from './ffn1600/ffn1600.component';
import { Ffn1610Component } from './ffn1610/ffn1610.component';


const routes: Routes = [
  Shell.childRoutes([ 
    { path: 'ffn0100', component: Ffn0100Component ,canActivate: [AuthGuardService]},
    { path: 'ffn0200', component: Ffn0200Component ,canActivate: [AuthGuardService]},
    { path: 'ffn0400', component: Ffn0400Component ,canActivate: [AuthGuardService]},
    { path: 'ffn0420', component: Ffn0420Component ,canActivate: [AuthGuardService]},
    { path: 'ffn0421', component: Ffn0421Component ,canActivate: [AuthGuardService]},
    { path: 'ffn0500', component: Ffn0500Component ,canActivate: [AuthGuardService]},
    { path: 'ffn0620', component: Ffn0620Component ,canActivate: [AuthGuardService]},
    { path: 'ffn0700', component: Ffn0700Component ,canActivate: [AuthGuardService]},
    { path: 'ffn0800', component: Ffn0800Component ,canActivate: [AuthGuardService]},
    { path: 'ffn0900', component: Ffn0900Component,canActivate: [AuthGuardService]},
    { path: 'ffn1400', component: Ffn1400Component ,canActivate: [AuthGuardService]},
    { path: 'ffn1600', component: Ffn1600Component ,canActivate: [AuthGuardService]},
    { path: 'ffn1610', component: Ffn1610Component ,canActivate: [AuthGuardService]},
  ])
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FfnRoutingModule { }
