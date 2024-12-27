import { Routes } from '@angular/router';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { HomeComponent } from './main/home/home.component';
import { MainComponent } from './main/main.component';
import { SettingsComponent } from './main/settings/settings.component';
import { AccountComponent } from './main/settings/account/account.component';
import { AppearanceComponent } from './main/settings/appearance/appearance.component';

export const routes: Routes = [
    { path: '', redirectTo: '/main/home', pathMatch: 'full' },
    { path: 'main/settings', redirectTo: '/main/settings/account', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: 'main', component: MainComponent, children: [
            { path: 'home', component: HomeComponent },
            {
                path: 'settings', component: SettingsComponent, children: [
                    { path: 'account', component: AccountComponent },
                    { path: 'appearance', component: AppearanceComponent }
                ]
            },
        ]
    },
    { path: '**', redirectTo: noRouteRedirection},
    
    
];

async function noRouteRedirection() {

}
