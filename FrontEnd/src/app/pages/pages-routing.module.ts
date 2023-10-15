import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserHistoryComponent } from './user-history/user-history.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ArtistProfileComponent } from './artist-profile/artist-profile.component';
import { ArtistHistoryComponent } from './artist-history/artist-history.component';
import { ArtistDashboardComponent } from './artist-dashboard/artist-dashboard.component';
import { AllArtistsComponent } from './all-artists/all-artists.component';
import { ArtistDataComponent } from './artist-data/artist-data.component';
import { SkillDataComponent } from './skill-data/skill-data.component';
import { NewRequestsComponent } from './new-requests/new-requests.component';
import { ArtistApproveComponent } from './artist-approve/artist-approve.component';

const routes: Routes = [
  {
    path: 'artist-dashboard',
    component: ArtistDashboardComponent,
    canActivate: [AuthGuard],
    data: {
      role: ['artist','access-artist-dashboard']
    }
  },
  {
    path: 'skill-data',
    component: SkillDataComponent,
    canActivate: [AuthGuard],
    data: {
      role: ['artist','access-skill-data']
    }
  },
  {
    path: 'new-requests',
    component: NewRequestsComponent,
    canActivate: [AuthGuard],
    data: {
      role: ['artist','access-new-requests']
    }
  },
  {
    path: 'artist-approve',
    component: ArtistApproveComponent,
    canActivate: [AuthGuard],
    data: {
      role: ['artist','access-artist-approve']
    }
  },
  {
    path: 'artist-profile',
    component: ArtistProfileComponent,
    canActivate: [AuthGuard],
    data: {
      role: ['admin', 'artist','access-artist-profile']
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
    path: 'user-dashboard',
    component: UserDashboardComponent,
    canActivate: [AuthGuard],
    data: {
      role: ['admin', 'user','access-user-dashboard']
    }
  },
  {
    path: 'all-artists',
    component: AllArtistsComponent,
    canActivate: [AuthGuard],
    data: {
      role: ['admin', 'user','access-all-artists']
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
    path: 'user-history',
    component: UserHistoryComponent,
    canActivate: [AuthGuard],
    data: {
      role: ['admin', 'user','access-user-history']
    }
  },
  {
    path: 'artist-data',
    component: ArtistDataComponent,
    canActivate: [AuthGuard],
    data: {
      role: ['admin', 'user','access-artist-data']
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
