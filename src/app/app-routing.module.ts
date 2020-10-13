import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuickAccessToolsComponent } from './quick-access-tools/quick-access-tools.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guard/auth.guard';
import { ZhcraComponent } from './zhcra/zhcra.component';
import { GuidelinesComponent } from './guidelines/guidelines.component';
import { GuidelineTypeComponent } from './guideline-type/guideline-type.component';
import { MemoComponent } from './memo/memo.component';
import { PrescriptionToolComponent } from './prescription-tool/prescription-tool.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'zhcra',
    component: ZhcraComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'quickaccesstools', component: QuickAccessToolsComponent, canActivate: [AuthGuard] },
      { path: 'guidelines', component: GuidelinesComponent, canActivate: [AuthGuard] },
      { path: 'guidelinetypes', component: GuidelineTypeComponent, canActivate: [AuthGuard] },
      { path: 'memos', component: MemoComponent, canActivate: [AuthGuard] },
      { path: 'prescriptiontool', component: PrescriptionToolComponent, canActivate: [AuthGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
