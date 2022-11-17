import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './add-product/add-product.component';
import { BiodataComponent } from './biodata/biodata.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuardAllUserService } from './service/auth-guard-all-user.service';
import { AuthGuardService } from './service/auth-guard.service';
import { UserManagementComponent } from './user-management/user-management.component';
// import { CommonModule } from '@angular/common';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'add-product', component: AddProductComponent, canActivate: [AuthGuardService]},
  {path: 'product-details/:id', component: ProductDetailComponent},
  {path: 'user-management', component: UserManagementComponent, canActivate: [AuthGuardService]},
  {path: 'biodata', component: BiodataComponent, canActivate: [AuthGuardAllUserService]}
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
