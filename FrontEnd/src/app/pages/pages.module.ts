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
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserHistoryComponent } from './user-history/user-history.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ArtistProfileComponent } from './artist-profile/artist-profile.component';
import { ArtistHistoryComponent } from './artist-history/artist-history.component';
import { ArtistDashboardComponent } from './artist-dashboard/artist-dashboard.component';
import { AllArtistsComponent } from './all-artists/all-artists.component';
import { ArtistDataComponent } from './artist-data/artist-data.component';
import { ArtistApproveComponent } from './artist-approve/artist-approve.component';
import { SkillDataComponent } from './skill-data/skill-data.component';
import { NewRequestsComponent } from './new-requests/new-requests.component';
import { SpeedDialModule } from 'primeng/speeddial';
import { AddSkillComponent } from './add-skill/add-skill.component';
import { ChipsModule } from 'primeng/chips';
import { dateRenderer } from './dateRenderer';
import { genreRenderer } from './skill-data/genreRenderer';
import { editRenderer } from './skill-data/editRenderer';
import { AddApproverComponent } from './add-approver/add-approver.component';
import { AllApproversComponent } from './all-approvers/all-approvers.component';
import { TagHistoryComponent } from './tag-history/tag-history.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { editRenderer1 } from './all-approvers/editRenderer';
import { contactDetailsRenderer } from './all-approvers/contactRenderer';
import { editRendererArtistApprove } from './artist-approve/editRenderer';
import { genreRendererArtistApprove } from './artist-approve/genreRenderer';
import { ArtistValidateComponent } from './artist-validate/artist-validate.component';
import { genreRendererTagHistory } from './tag-history/genreRenderer';
import { EventPipe } from './artist-data/event.pipe';
import { CalendarModule } from 'primeng/calendar';
import { slotRenderer } from './user-history/slotRenderer';
import { userHistoryTimeRenderer } from './user-history/userHistoryTimeRenderer';
import { feedbackRenderer } from './user-history/feedback';
import { artistfeedbackRenderer } from './artist-history/feedbackRenderer';
import { approverRenderer } from './new-requests/approverRenderer';
import { UserApproverRenderer } from './user-history/userApproverRenderer';
import { PaginatorModule } from 'primeng/paginator';
import { RatingModule } from 'primeng/rating';
import { pricingRenderer } from './skill-data/pricingRenderer';
import { CommissionComponent } from './commission/commission.component';
import { AllCommissionsComponent } from './all-commissions/all-commissions.component';
import { commissionRenderer } from './all-commissions/commissionRenderer';
import { payCommissionRenderer } from './all-commissions/payCommission';
import { refundRenderer } from './user-history/refundRenderer';
import { RefundsComponent } from './refunds/refunds.component';
import { userRenderer } from './refunds/userContact';
import { artistRenderer } from './refunds/artistContact';
import { refundAcceptRenderer } from './refunds/refundAccept';
import { TransactionsComponent } from './transactions/transactions.component';
import { PendingWithdrawsComponent } from './pending-withdraws/pending-withdraws.component';
import { pendingRenderer } from './pending-withdraws/pending-contact';
import { historyRenderer } from './pending-withdraws/viewHistory';
import { withdrawPayRenderer } from './pending-withdraws/pay';
import { StatusPipe } from './user-history/status.pipe';
import { WalletTransactionsComponent } from './wallet-transactions/wallet-transactions.component';
import { GooglePayButtonModule } from '@google-pay/button-angular';

@NgModule({
  declarations: [
    ArtistDashboardComponent,
    timeRenderer,
    contactRenderer,
    ArtistHistoryComponent,
    ArtistProfileComponent,
    UserDashboardComponent,
    UserHistoryComponent,
    UserProfileComponent,
    AllArtistsComponent,
    ArtistDataComponent,
    ArtistApproveComponent,
    SkillDataComponent,
    NewRequestsComponent,
    AddSkillComponent,
    dateRenderer,
    genreRenderer,
    editRenderer,
    editRenderer1,
    editRendererArtistApprove,
    genreRendererArtistApprove,
    contactDetailsRenderer,
    AddApproverComponent,
    AllApproversComponent,
    TagHistoryComponent,
    ArtistValidateComponent,
    genreRendererTagHistory,
    EventPipe,
    slotRenderer,
    userHistoryTimeRenderer,
    feedbackRenderer,
    artistfeedbackRenderer,
    approverRenderer,
    UserApproverRenderer,
    pricingRenderer,
    CommissionComponent,
    AllCommissionsComponent,
    commissionRenderer,
    payCommissionRenderer,
    refundRenderer,
    RefundsComponent,
    userRenderer,
    artistRenderer,
    refundAcceptRenderer,
    TransactionsComponent,
    PendingWithdrawsComponent,
    pendingRenderer,
    historyRenderer,
    withdrawPayRenderer,
    StatusPipe,
    WalletTransactionsComponent
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
    AgGridModule,
    SpeedDialModule,
    ChipsModule,
    MultiSelectModule,
    CalendarModule,
    PaginatorModule,
    RatingModule,
    GooglePayButtonModule
  ]
})
export class PagesModule { }
