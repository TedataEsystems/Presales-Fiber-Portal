import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../navigation/footer/footer.component';
import { NavlistComponent } from '../navigation/navlist/navlist.component';
import { HeaderComponent } from '../navigation/header/header.component';
import { LayoutComponent } from './layout.component';
import { ChartsComponent } from 'src/app/components/charts/charts.component';
import { EditComponent } from 'src/app/components/edit/edit.component';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';
import { MaterialModule } from '../../modules/material/material.module';
import { Title } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DeleteComponent } from '../msg/delete/delete.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LoaderComponent } from '../loader/loader.component';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { MicrowaveComponent } from 'src/app/components/microwave/microwave.component';
import { MicrowaveFormComponent } from 'src/app/components/microwave-form/microwave-form.component';
import { CopperComponent } from 'src/app/components/copper/copper.component';
import { CopperFormComponent } from 'src/app/components/copper-form/copper-form.component';
import { FiberComponent } from 'src/app/components/fiber/fiber.component';
import { ServiceSpeedComponent } from 'src/app/components/service-speed/service-speed.component';
import { TeamcontactComponent } from 'src/app/components/teamcontact/teamcontact.component';
import { statusComponent } from 'src/app/components/status/status.component';
import { FiberFormComponent } from 'src/app/components/fiber-form/fiber-form.component';
import { ServicespeedService } from 'src/app/shared/services/servicespeed.service';
import {statusService} from'src/app/shared/services/status.service';
import {TeamcontactService} from'src/app/shared/services/teamContact.service';
import {FileuploadService} from'src/app/shared/services/fileupload.service';
import { ConfigureService } from 'src/app/shared/services/configure.service';
import { AmiriFontService } from 'src/app/shared/services/amiri-font.service';
import { HttpClientModule } from '@angular/common/http';
import { LogdataComponent } from 'src/app/components/logdata/logdata.component';
import { LogDataService } from '../../services/log-data.service';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ChartsModule } from 'ng2-charts';
import { FeedbackComponent } from 'src/app/components/feedback/feedback.component';
import { SectorsComponent } from 'src/app/Settings/sectors/sectors.component';
import { ForwardedToComponent } from 'src/app/components/forwarded-to/forwarded-to.component';
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { QueueValidationComponent } from '../../../components/queue-validation/queue-validation.component';
import { ViewFeedbackComponent } from 'src/app/components/view-feedback/view-feedback.component';

@NgModule({
  declarations: [
    DashboardComponent,
    EditComponent,
    ChartsComponent,
    LayoutComponent,
    HeaderComponent,
    NavlistComponent,
    FooterComponent,
    DeleteComponent,
    LoaderComponent,
    MicrowaveComponent,
    MicrowaveFormComponent,
    CopperComponent,
    CopperFormComponent,
    FiberComponent,
    FiberFormComponent,
    ServiceSpeedComponent,
    statusComponent,
    TeamcontactComponent,
    LogdataComponent,
    FeedbackComponent,
    SectorsComponent,
    ForwardedToComponent,
    QueueValidationComponent,
    ViewFeedbackComponent

  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
     ChartsModule,
    ReactiveFormsModule,
    RouterModule,
    FlexLayoutModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatMomentModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    RichTextEditorModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
  ],
  providers:[AmiriFontService,Title,ServicespeedService,ConfigureService,statusService,FileuploadService,TeamcontactService,LogDataService]
})
export class LayoutModule { }
