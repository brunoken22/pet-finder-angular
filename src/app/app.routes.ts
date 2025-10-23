import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home';
import { LoginPage } from './pages/login/login';
import { SignupPage } from './pages/signup/signup';
import { authGuard } from './core/guards/auth-guard';
import { notAuthGuard } from './core/guards/no_auth-guard';
import { ReportPage } from './pages/report/report';
import { locationReportGuard } from './core/guards/location-report';
// import { LoadingPages } from './components/loadingPages/loadingPages';
import NotFound from './pages/notFound/notFound';
import { AccountPage } from './pages/user/account/account';
import { ModifyDataPage } from './pages/user/account/modify_data/modify_data';
import { ModifyPasswordPage } from './pages/user/account/modify_password/modify_password';
import { MyReportPage } from './pages/user/myReport/myReport';
import { NewReportPage } from './pages/user/newReport/newReport';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'login',
    canMatch: [notAuthGuard],
    title: 'Iniciar cuenta | Pet Finder',
    component: LoginPage,
  },
  {
    canMatch: [notAuthGuard],
    path: 'signup',
    title: 'Crear cuenta | Pet Finder',
    component: SignupPage,
  },
  {
    canMatch: [locationReportGuard],
    path: 'report',
    title: 'Reporte de mascotas | Pet Finder',
    component: ReportPage,
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
    title: 'Mis reportes | Pet Finder',
  },
  {
    canMatch: [authGuard],
    path: 'newReport',
    component: NewReportPage,
    title: 'Nuevo reporte | Pet Finder',
  },
  {
    canMatch: [authGuard],
    path: 'modifyReport/:id',
    title: 'NModificar Reporte | Pet Finder',
    loadComponent: () =>
      import('./pages/user/modifyReport/modifyReport').then((c) => c.ModifyReportPage),
    data: {
      renderMode: 'server',
    },
  },
  {
    path: '**',
    title: 'No existe | Pet Finder',
    component: NotFound,
  },
];
