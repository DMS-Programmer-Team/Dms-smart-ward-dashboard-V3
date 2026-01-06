import { Routes } from '@angular/router';
import { Homecomponent } from './homecomponent/homecomponent';
import { Inpatientcomponent } from './inpatientcomponent/inpatientcomponent';
import { Dischargecomponent } from './dischargecomponent/dischargecomponent';
import { Logincomponent } from './logincomponent/logincomponent';

export const routes: Routes = [
    
    {
        path: 'login',
        loadComponent: () => import('./logincomponent/logincomponent').then(m => m.Logincomponent)
    },
    { 
        path: 'home', 
        loadComponent: () => import('./homecomponent/homecomponent').then(m => m.Homecomponent)  
    },
    {
        path: 'inpatient',
        loadComponent: () => import('./inpatientcomponent/inpatientcomponent').then(m => m.Inpatientcomponent)
    },
    {
        path: 'discharge',
        loadComponent: () => import('./dischargecomponent/dischargecomponent').then(m => m.Dischargecomponent)
    },
    {
        path: 'footer',
        loadComponent: () => import('./footercomponent/footercomponent').then(m => m.Footercomponent)
    },
    {
        path: 'fromdetail',
        loadComponent: () => import('./modal/from-detail-component/from-detail-component').then(m => m.FromDetailComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./logincomponent/register-component/register-component').then(m => m.RegisterComponent)
    },
    {
        path: 'pageadmin',
        loadComponent: () => import('./logincomponent/pageadmin-component/pageadmin-component').then(m => m.PageadminComponent)
    },
    {
        path: 'datauser',
        loadComponent: () => import('./logincomponent/datauser-component/datauser-component').then(m => m.DatauserComponent)
    },
    {
        path: 'adduser',
        loadComponent: () => import('./logincomponent/pageadmin-component/adduser-component/adduser-component').then(m => m.AdduserComponent)
    },
    {
        path: 'addwardsuser',
        loadComponent: () => import('./logincomponent/pageadmin-component/addwarduser-component/addwarduser-component').then(m => m.AddwarduserComponent)
    },
    {
        path: 'edituser',
        loadComponent: () => import('./logincomponent/pageadmin-component/edituser-component/edituser-component').then(m => m.EdituserComponent)
    },
    {
        path: 'resetaccount',
        loadComponent: () => import('./logincomponent/pageadmin-component/resetaccout-component/resetaccout-component').then(m => m.ResetaccoutComponent)
    },
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    }

];
