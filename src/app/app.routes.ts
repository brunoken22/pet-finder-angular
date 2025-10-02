import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home';
import { LoginPage } from './pages/login/login';
import { SignupPage } from './pages/signup/signup';
import { AccountPage } from './pages/account/account';
import { MyReportPage } from './pages/myReport/myReport';
import { NewReportPage } from './pages/newReport/newReport';
import { ModifyDataPage } from './pages/account/modify_data/modify_data';
import { ModifyPasswordPage } from './pages/account/modify_password/modify_password';
import { authGuard } from './core/guards/auth-guard';
import { ModifyReportPage } from './pages/modifyReport/modifyReport';
import { notAuthGuard } from './core/guards/no_auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'login',
    canMatch: [notAuthGuard],
    component: LoginPage,
  },
  {
    canMatch: [notAuthGuard],
    path: 'signup',
    component: SignupPage,
  },
  {
    canMatch: [authGuard],
    path: 'account',
    component: AccountPage,
    children: [
      { path: '', redirectTo: 'modifyData', pathMatch: 'full' },
      { path: 'modifyData', component: ModifyDataPage },
      { path: 'modifyPassword', component: ModifyPasswordPage },
    ],
  },

  {
    canMatch: [authGuard],
    path: 'myReport',
    component: MyReportPage,
  },
  {
    canMatch: [authGuard],
    path: 'newReport',
    component: NewReportPage,
  },
  {
    canMatch: [authGuard],
    path: 'modifyReport/:id',
    component: ModifyReportPage,
  },
];
