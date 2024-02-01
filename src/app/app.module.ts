import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from './shared/components/layout/layout.module';

import { LoginModule } from './shared/components/login/login.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './shared/interceptors/interceptor-service.interceptor'


@NgModule({
  declarations: [
    AppComponent,




  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
   LayoutModule,
   LoginModule


  ],
  providers: [
     { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },

            ],
  bootstrap: [AppComponent]
})
export class AppModule { }
