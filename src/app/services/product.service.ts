import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import jwt_decode  from 'jwt-decode'; 

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:4000/api/';

  constructor(
    private http: HttpClient
  ) { }

//   addCategory(category: any): Observable<any> {
//     const formData: FormData = new FormData();
    
// formData.append('categoryName', category.categoryName);
// formData.append('width', category.width);
// formData.append('weight', category.weight);
// formData.append('length', category.length);
// formData.append('composition', category.composition);

//     console.log(formData)
//     return this.http.post<any>(`${this.apiUrl}category/add`, formData);
// }
addCategory(category: any):Observable<any>{
  return this.http.post(`${this.apiUrl}category/add`,category)
}

getAllCategories(){
  return this.http.get<any>( `${this.apiUrl}category/get/all`);
}

}