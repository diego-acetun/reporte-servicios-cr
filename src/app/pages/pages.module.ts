import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material-design';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from '../components/components.module';
import { RouterModule, Routes } from '@angular/router';
// import { AuthGuard } from '../guards/auth.guard';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgProgressModule } from 'ngx-progressbar';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'servicios-cr',
    pathMatch: 'full',
  },
  // {
  //   path: 'home',
  //   loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  //   // canActivate: [AuthGuard],
  //   data: {
  //     key: 'home'
  //   }
  // },
  // {
  //   path: 'ola',
  //   loadChildren: () => import('./ola/ola.module').then(m => m.OlaModule),
  //   // canActivate: [AuthGuard],
  //   data: {
  //     key: 'ola'
  //   }
  // },
  {
    path: 'servicios-cr',
    loadChildren: () =>
      import('./servicios-cr/servicios-cr.module').then(
        (m) => m.PersonalCnocModule
      ),
    // canActivate: [AuthGuard],
    data: {
      key: 'servicios-cr',
    },
  },
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ComponentsModule,
    HttpClientModule,
    NgProgressModule,
    MatPaginatorModule,
    RouterModule.forChild(routes)
  ],
})
export class PagesModule { }
