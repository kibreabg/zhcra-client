import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './feature/auth/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./feature/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'guidelines',
    loadChildren: () => import('./feature/guidelines/guidelines.module').then(m => m.GuidelinesModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'guidelinetypes',
    loadChildren: () => import('./feature/guideline-types/guideline-types.module').then(m => m.GuidelineTypesModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'memos',
    loadChildren: () => import('./feature/memos/memos.module').then(m => m.MemosModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'prescriptiontools',
    loadChildren: () => import('./feature/prescription-tools/prescription-tools.module').then(m => m.PrescriptionToolsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'quickaccesstools',
    loadChildren: () => import('./feature/quick-access-tools/quick-access-tools.module').then(m => m.QuickAccessToolsModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
