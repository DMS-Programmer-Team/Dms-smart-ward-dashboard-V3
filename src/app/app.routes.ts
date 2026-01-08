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
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    }

];
