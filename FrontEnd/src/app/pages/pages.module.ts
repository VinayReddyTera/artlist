import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbNavModule, NgbDropdownModule, NgbModalModule, NgbTooltipModule , NgbCollapseModule, NgbToastModule} from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SimplebarAngularModule } from 'simplebar-angular';
import { LightboxModule } from 'ngx-lightbox';

import { PagesRoutingModule } from './pages-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { NgChartsModule } from 'ng2-charts';
import { AgGridModule } from 'ag-grid-angular';
import { timeRenderer } from './artist-dashboard/timeRenderer';
import { contactRenderer } from './artist-dashboard/contactRenderer';
import { BookInterviewComponent } from './book-interview/book-interview.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserHistoryComponent } from './user-history/user-history.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ArtistProfileComponent } from './artist-profile/artist-profile.component';
import { ArtistDetailsComponent } from './artist-details/artist-details.component';
import { ArtistHistoryComponent } from './artist-history/artist-history.component';
import { ArtistDashboardComponent } from './artist-dashboard/artist-dashboard.component';

@NgModule({
  declarations: [
    ArtistDashboardComponent,
    timeRenderer,
    contactRenderer,
    BookInterviewComponent,
    ArtistDetailsComponent,
    ArtistHistoryComponent,
    ArtistProfileComponent,
    UserDashboardComponent,
    UserHistoryComponent,
    UserProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    NgbModalModule,
    PagesRoutingModule,
    NgApexchartsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbNavModule,
    NgbTooltipModule,
    NgbCollapseModule,
    SimplebarAngularModule,
    LightboxModule,
    NgxSpinnerModule,
    ToastModule,
    ToolbarModule,
    TooltipModule,
    NgChartsModule,
    AgGridModule
  ]
})
export class PagesModule { }
