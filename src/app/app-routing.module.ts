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

const routes: Routes = [
  {
    path: 'loginuser',
    component: LoginComponent,
  },
  
  {
    path: '',
    component: LayoutComponent,


    children: [{
      path: '',
      component: ChartsComponent,

    }, 
   
    {
      path: 'servicespeed',
      component: ServiceSpeedComponent,

    },
    {
      path: 'microwave',
      component: MicrowaveComponent,

    },
    {
      path: 'microwaveRequestForm',
      component: MicrowaveFormComponent,
      

    },
    {
      path: 'copper',
      component: CopperComponent,

    },
    {
      path: 'copperRequestForm',
      component: CopperFormComponent,

    },
    {
      path: 'fiber',
      component: FiberComponent,

    },
    {
      path: 'fiberRequestForm',
      component: FiberFormComponent,

    },
    {
      path: 'status',
      component: statusComponent,

    },
    {
      path:'contacts',
      component:TeamcontactComponent,
    }
    ,
    {
      path:'logs',
      component:LogdataComponent,
    }
    
  
    
    
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
