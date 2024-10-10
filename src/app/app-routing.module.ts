import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  } ,
  {
    path: '',
    loadChildren: ()=>import('./login/login.module').then(m => m.LoginModule),
  },
  {
    path: '',
    loadChildren: ()=>import('./components/case/case.module').then(m => m.CaseModule),
  },
  {
    path: '',
    loadChildren: ()=>import('./components/fap/fap.module').then(m => m.FapModule),
  },
  {
    path: '',
    loadChildren: ()=>import('./components/fca/fca.module').then(m => m.FcaModule),
  },
  {
    path: '',
    loadChildren: ()=>import('./components/fci/fci.module').then(m => m.FciModule),
  },
  {
    path: '',
    loadChildren: ()=>import('./components/fco/fco.module').then(m => m.FcoModule),
  },
  {
    path: '',
    loadChildren: ()=>import('./components/fct/fct.module').then(m => m.FctModule),
  },
  {
    path: '',
    loadChildren: ()=>import('./components/fdo/fdo.module').then(m => m.FdoModule),
  },
  {
    path: '',
    loadChildren: ()=>import('./components/ffn/ffn.module').then(m => m.FfnModule),
  },
  {
    path: '',
    loadChildren: ()=>import('./components/fgu/fgu.module').then(m => m.FguModule),
  },
  {
    path: '',
    loadChildren: ()=>import('./components/fju/fju.module').then(m => m.FjuModule),
  },
  {
    path: '',
    loadChildren: ()=>import('./components/fkb/fkb.module').then(m => m.FkbModule),
  },
  {
    path: '',
    loadChildren: ()=>import('./components/fkn/fkn.module').then(m => m.FknModule),
  },
  {
    path: '',
    loadChildren: ()=>import('./components/fkr/fkr.module').then(m => m.FkrModule),
  },
  {
    path: '',
    loadChildren: ()=>import('./components/fmg/fmg.module').then(m => m.FmgModule),
  },
  {
    path: '',
    loadChildren: ()=>import('./components/fno/fno.module').then(m => m.FnoModule),
  },
  {
    path: '',
    loadChildren: ()=>import('./components/fpo/fpo.module').then(m => m.FpoModule),
  },
  {
    path: '',
    loadChildren: ()=>import('./components/fsc/fsc.module').then(m => m.FscModule),
  },
  {
    path: '',
    loadChildren: ()=>import('./components/fsn/fsn.module').then(m => m.FsnModule),
  },
  {
    path: '',
    loadChildren: ()=>import('./components/fst/fst.module').then(m => m.FstModule),
  },
  {
    path: '',
    loadChildren: ()=>import('./components/fud/fud.module').then(m => m.FudModule),
  },
  // ------------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------------
  {
    path: '',
    loadChildren: ()=>import('./components/modal/modal.module').then(m => m.ModalModule),
  },
  // ------------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------------
  {
    path: '',
    loadChildren: ()=>import('./components/prap/prap.module').then(m => m.PrapModule),
  },
  {
    path: '',
    loadChildren: ()=>import('./components/pras/pras.module').then(m => m.PrasModule),
  },{
    path: '',
    loadChildren: ()=>import('./components/prca/prca.module').then(m => m.PrcaModule),
  },
  {
    path: '',
    loadChildren: ()=>import('@app/components/prci/prci.module').then(m => m.PrciModule),
  },
  {
    path: '',
    loadChildren: ()=>import('@app/components/prco/prco.module').then(m => m.PrcoModule),
  },
  {
    path: '',
    loadChildren: ()=>import('@app/components/prdo/prdo.module').then(m => m.PrdoModule),
  },
  {
    path: '',
    loadChildren: ()=>import('@app/components/prfn/prfn.module').then(m => m.PrfnModule),
  },
  {
    path: '',
    loadChildren: ()=>import('@app/components/prgu/prgu.module').then(m => m.PrguModule),
  },
  {
    path: '',
    loadChildren: ()=>import('@app/components/prju/prju.module').then(m => m.PrjuModule),
  }, 
  {
    path: '',
    loadChildren: ()=>import('@app/components/prkb/prkb.module').then(m => m.PrkbModule),
  },
  {
    path: '',
    loadChildren: ()=>import('@app/components/prkn/prkn.module').then(m => m.PrknModule),
  },
  {
    path: '',
    loadChildren: ()=>import('@app/components/prkr/prkr.module').then(m => m.PrkrModule),
  }, 
  {
    path: '',
    loadChildren: ()=>import('@app/components/prmg/prmg.module').then(m => m.PrmgModule),
  },
  {
    path: '',
    loadChildren: ()=>import('@app/components/prno/prno.module').then(m => m.PrnoModule),
  },
  {
    path: '',
    loadChildren: ()=>import('@app/components/prpo/prpo.module').then(m => m.PrpoModule),
  },
  {
    path: '',
    loadChildren: ()=>import('@app/components/prsc/prsc.module').then(m => m.PrscModule),
  }, 
  {
    path: '',
    loadChildren: ()=>import('@app/components/prsn/prsn.module').then(m => m.PrsnModule),
  }, 
  {
    path: '',
    loadChildren: ()=>import('@app/components/prst/prst.module').then(m => m.PrstModule),
  },
  {
    path: '',
    loadChildren: ()=>import('@app/components/prud/prud.module').then(m => m.PrudModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
