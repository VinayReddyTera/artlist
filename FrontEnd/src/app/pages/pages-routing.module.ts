import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookInterviewComponent } from './book-interview/book-interview.component';
import { AuthGuard } from './services/auth.guard';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserHistoryComponent } from './user-history/user-history.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ArtistProfileComponent } from './artist-profile/artist-profile.component';
import { ArtistHistoryComponent } from './artist-history/artist-history.component';
import { ArtistDetailsComponent } from './artist-details/artist-details.component';
import { ArtistDashboardComponent } from './artist-dashboard/artist-dashboard.component';

const routes: Routes = [
  {
    path: 'artist-profile',
    component: ArtistProfileComponent,
    canActivate: [AuthGuard],
    data: {
      role: ['admin', 'artist','access-artist-profile']
    }
  },
  {
    path: 'artist-dashboard',
    component: ArtistDashboardComponent,
    canActivate: [AuthGuard],
    data: {
      role: ['artist','access-artist-dashboard']
    }
  },
  {
    path: 'artist-history',
    component: ArtistHistoryComponent,
    canActivate: [AuthGuard],
    data: {
      role: ['admin', 'artist','access-artist-history']
    }
  },
  {
    path: 'bookInterview',
    component: BookInterviewComponent,
    canActivate: [AuthGuard],
    data: {
      role: ['admin', 'user','access-bookInterview']
    }
  },
  {
    path: 'user-dashboard',
    component: UserDashboardComponent,
    canActivate: [AuthGuard],
    data: {
      role: ['admin', 'user','access-user-dashboard']
    }
  },
  {
    path: 'user-history',
    component: UserHistoryComponent,
    canActivate: [AuthGuard],
    data: {
      role: ['admin', 'user','access-user-history']
    }
  },
  {
    path: 'artist-details',
    component: ArtistDetailsComponent,
    canActivate: [AuthGuard],
    data: {
      role: ['admin', 'user','access-artist-details']
    }
  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
    data: {
      role: ['admin', 'user','access-user-profile']
    }
  },
  {
    path: '**',
    component: UserDashboardComponent,
    canActivate: [AuthGuard],
    data: {
      role: ['user','access-user-dashboard']
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
