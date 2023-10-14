import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';

import { SignupComponent } from './signup/signup.component';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthGuard } from 'src/app/pages/services/auth.guard';

const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,canActivate:[AuthGuard]
    },
    {
        path: 'signup/:type',
        component: SignupComponent,canActivate:[AuthGuard]
    },
    {
        path: 'reset-password',
        component: PasswordresetComponent,canActivate:[AuthGuard]
    },
    {
        path: 'reset-password/:mail',
        component: ResetPasswordComponent,canActivate:[AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
