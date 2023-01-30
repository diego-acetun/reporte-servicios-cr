import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ServiciosCRComponent } from './servicios-cr.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material-design';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgProgressModule } from 'ngx-progressbar';
import { ComponentsModule } from 'src/app/components/components.module';

const routes: Routes = [
  { path: '', component: ServiciosCRComponent },
  { path: '', redirectTo: 'servicios-cr', pathMatch: 'full' },
];

@NgModule({
  declarations: [ServiciosCRComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MaterialModule,
    MatPaginatorModule,
    NgProgressModule,
    ComponentsModule,
  ],
})
export class PersonalCnocModule {}
