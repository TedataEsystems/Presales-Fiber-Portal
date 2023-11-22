import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CopperFormComponent } from './components/copper-form/copper-form.component';
import { CopperComponent } from './components/copper/copper.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FiberFormComponent } from './components/fiber-form/fiber-form.component';
import { FiberComponent } from './components/fiber/fiber.component';
import { MicrowaveFormComponent } from './components/microwave-form/microwave-form.component';
import { MicrowaveComponent } from './components/microwave/microwave.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { LoginComponent } from './shared/components/login/login.component';
import { ServiceSpeedComponent } from './components/service-speed/service-speed.component';
import { statusComponent } from './components/status/status.component';
import { TeamcontactComponent } from './components/teamcontact/teamcontact.component';
import { ChartsComponent } from './components/charts/charts.component';
import { LogdataComponent } from './components/logdata/logdata.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { SectorsComponent } from './Settings/sectors/sectors.component';
import { AuthGuardGuard } from './shared/Guard/auth-guard.guard';
import { HomeAuthGuard } from './shared/Guard/home-auth.guard';

const routes: Routes = [
  {
    path: 'loginuser',
    component: LoginComponent,
  },

  {
    path: '',
    component: LayoutComponent,

    children: [
      {
        path: '',
        component: ChartsComponent,
        canActivate:[HomeAuthGuard,AuthGuardGuard]
      },

      {
        path: 'servicespeed',
        component: ServiceSpeedComponent,
        canActivate:[AuthGuardGuard]
      },
      {
        path: 'microwave',
        component: MicrowaveComponent,
        canActivate:[AuthGuardGuard]
      },
      {
        path: 'microwaveRequestForm',
        component: MicrowaveFormComponent,
        canActivate:[AuthGuardGuard]
      },
      {
        path: 'copper',
        component: CopperComponent,
        canActivate:[AuthGuardGuard]
      },
      {
        path: 'copperRequestForm',
        component: CopperFormComponent,
        canActivate:[AuthGuardGuard]
      },
      {
        path: 'fiber',
        component: FiberComponent,
        canActivate:[AuthGuardGuard]
      },
      {
        path: 'fiberRequestForm',
        component: FiberFormComponent,
        canActivate:[AuthGuardGuard]
      },
      {
        path: 'feedBack',
        component: FeedbackComponent,
        canActivate:[AuthGuardGuard]
      },
      {
        path: 'status',
        component: statusComponent,
        canActivate:[AuthGuardGuard]
      },
      {
        path: 'contacts',
        component: TeamcontactComponent,
        canActivate:[AuthGuardGuard]
      },
      {
        path: 'logs',
        component: LogdataComponent,
        canActivate:[AuthGuardGuard]
      },
      {
        path: 'sectors',
        component: SectorsComponent,
        canActivate:[AuthGuardGuard]
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
