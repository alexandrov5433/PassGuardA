import { Routes } from '@angular/router';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { HomeComponent } from './main/home/home.component';
import { MainComponent } from './main/main.component';
import { SettingsComponent } from './main/settings/settings.component';

export const routes: Routes = [
    { path: '', redirectTo: '/main/home', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'main', component: MainComponent, children: [
        { path: 'home', component: HomeComponent },
        { path: 'settings', component: SettingsComponent},
    ] },

];
