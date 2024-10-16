import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { ModifyPasswordComponent } from './modify-password/modify-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { TaskManagerComponent } from './task-manager/task-manager.component';
import { YourBoardComponent } from './your-board/your-board.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent},
  { path: 'profile', component: ProfileComponent },
  { path: 'modify-password', component: ModifyPasswordComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent},
  { path: 'task-manager/:name', component: TaskManagerComponent},
  { path: 'your-board', component: YourBoardComponent}
];
