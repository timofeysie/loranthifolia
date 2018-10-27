import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'detail/:id', loadChildren: './pages/detail/detail.module#DetailPageModule' },
  { path: 'detail/:id/:qCode', loadChildren: './pages/detail/detail.module#DetailPageModule' },
  { path: 'options', loadChildren: './pages/options/options.module#OptionsPageModule' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
