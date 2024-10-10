import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AuthGuardService } from '@app/auth-guard.service';


import { Fca0130Component } from './fca0130/fca0130.component';
import { Fca0150Component } from './fca0150/fca0150.component';
import { Fca0200Component } from './fca0200/fca0200.component';
import { Fca0200MainComponent } from './fca0200-main/fca0200-main.component';
import { Fca0200Tab1Component } from './fca0200-tab1/fca0200-tab1.component';
import { Fca0200Tab2Component } from './fca0200-tab2/fca0200-tab2.component';
import { Fca0200Tab3Component } from './fca0200-tab3/fca0200-tab3.component';
import { Fca1000Component } from './fca1000/fca1000.component';
import { Fca2000Component } from './fca2000/fca2000.component';
import { Fca0220Component } from './fca0220/fca0220.component';
import { Fca0230Component } from './fca0230/fca0230.component';
import { Fca0231Component } from './fca0231/fca0231.component';
import { Fca0234Component } from './fca0234/fca0234.component';
import { Fca0300Component } from './fca0300/fca0300.component';
import { Fca0800Component } from './fca0800/fca0800.component';
// import { CaseHeaderComponent } from './case-header/case-header.component';
// import { CaseHeadComponent } from './case-head/case-head.component';
import { CaseJudgeComponent } from './case-judge/case-judge.component';
import { CaseConciliateComponent } from './case-conciliate/case-conciliate.component';
import { Fca0200HeadComponent } from './fca0200-head/fca0200-head.component';
import { Fca0800HeadComponent } from './fca0800-head/fca0800-head.component';
import { Fca0800MainComponent } from './fca0800-main/fca0800-main.component';
import { Fca0800Tab1Component } from './fca0800-tab1/fca0800-tab1.component';
import { Fca0800Tab2Component } from './fca0800-tab2/fca0800-tab2.component';
import { Fca0800Tab3Component } from './fca0800-tab3/fca0800-tab3.component';
import { Fca0800Tab4Component } from './fca0800-tab4/fca0800-tab4.component';

import { Fca0200AppointmentComponent } from './fca0200-appointment/fca0200-appointment.component';
import { Prca2400Component } from './prca2400/prca2400.component';

const routes: Routes = [
  Shell.childRoutes([ {
    path: 'fca0130',
    component: Fca0130Component,canActivate: [AuthGuardService],
  },{
    path: 'fca0150',
    component: Fca0150Component,canActivate: [AuthGuardService],
  },{
    path: 'fca0200',
    component: Fca0200Component,canActivate: [AuthGuardService],
  },{
    path: 'fca1000',
    component: Fca1000Component,canActivate: [AuthGuardService],
  },{
    path: 'fca2000',
    component: Fca2000Component,canActivate: [AuthGuardService],
  },{ 
    path: 'fca0220', 
    component: Fca0220Component,canActivate: [AuthGuardService]
  },{
    path: 'fca0230',
    component: Fca0230Component,canActivate: [AuthGuardService],
  },{ 
    path: 'fca0231', 
    component: Fca0231Component,canActivate: [AuthGuardService]
  },{
    path: 'fca0234',
    component: Fca0234Component,canActivate: [AuthGuardService],
  },{
    path: 'fca0300',
    component: Fca0300Component,canActivate: [AuthGuardService],
  },{
    path: 'fca0800',
    component: Fca0800Component,canActivate: [AuthGuardService],
  }/*,{
    path: 'case_header',
    component: CaseHeaderComponent,canActivate: [AuthGuardService],
  },{
    path: 'case_head',
    component: CaseHeadComponent,canActivate: [AuthGuardService],
  }*/,{
    path: 'case_judge',
    component: CaseJudgeComponent,canActivate: [AuthGuardService],
  },
  { path: 'case-conciliate', 
    component:CaseConciliateComponent,canActivate: [AuthGuardService]
  },{
    path: 'fca0200_head',
    component: Fca0200HeadComponent,canActivate: [AuthGuardService],
  },{
    path: 'fca0800_head',
    component: Fca0800HeadComponent,canActivate: [AuthGuardService],
  },{
    path: 'fca0800_main',
    component: Fca0800MainComponent,canActivate: [AuthGuardService],
  },{
    path: 'fca0800_tab1',
    component: Fca0800Tab1Component,canActivate: [AuthGuardService],
  },{
    path: 'fca0800_tab2',
    component: Fca0800Tab2Component,canActivate: [AuthGuardService],
  },{
    path: 'fca0800_tab3',
    component: Fca0800Tab3Component,canActivate: [AuthGuardService],
  },{
    path: 'fca0800_tab4',
    component: Fca0800Tab4Component,canActivate: [AuthGuardService],
  },{
    path: 'fca0200_main',
    component: Fca0200MainComponent,canActivate: [AuthGuardService],
  },{
    path: 'fca0200_tab1',
    component: Fca0200Tab1Component,canActivate: [AuthGuardService],
  },{
    path: 'fca0200_tab2',
    component: Fca0200Tab2Component,canActivate: [AuthGuardService],
  },{
    path: 'fca0200_tab3',
    component: Fca0200Tab3Component,canActivate: [AuthGuardService],
  },{
    path: 'fca0200_tab4',
    component: Fca0200AppointmentComponent,canActivate: [AuthGuardService],
  },{
    path: 'fca0200_tab4',
    component: Fca0200AppointmentComponent,canActivate: [AuthGuardService],
  },{ 
    path: 'prca2400', 
    component: Prca2400Component ,canActivate: [AuthGuardService]}
])
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FcaRoutingModule { }
