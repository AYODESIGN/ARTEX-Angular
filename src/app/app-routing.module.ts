import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { AddCategoryComponent } from './components/add-category/add-category.component';
import { AddProductComponent } from './components/add-product/add-product.component';


const routes: Routes = [
  {path: "", component: HomeComponent },
  {path: "header", component: HeaderComponent},
  {path: "signup/user", component: SignupComponent},
  {path: "signup/admin", component: SignupComponent},
  {path: "login", component: LoginComponent},
  {path: "add-category", component: AddCategoryComponent},
  {path: "add-product", component: AddProductComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
