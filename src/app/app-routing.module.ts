import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './add-product/add-product.component';
import { BiodataComponent } from './biodata/biodata.component';
import { ChangeExpiredPasswordComponent } from './change-expired-password/change-expired-password.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { RegisterComponent } from './register/register.component';
import { UserManagementEditComponent } from './user-management-edit/user-management-edit.component';
import { UserManagementComponent } from './user-management/user-management.component';
// import { CommonModule } from '@angular/common';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'add-product', component: AddProductComponent},
  {path: 'product-details/:id', component: ProductDetailComponent},
  {path: 'user-management', component: UserManagementComponent},
  {path: 'user-management/edit/:id', component: UserManagementEditComponent},
  {path: 'change-expired-password', component: ChangeExpiredPasswordComponent},
  {path: 'biodata', component: BiodataComponent}
  // {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  // {path: 'dashboard', component: DashboardComponent},
  // {path: 'error', component: ErrorpageComponent},
]
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
