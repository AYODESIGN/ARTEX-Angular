
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = 'http://localhost:4000/api/';

  constructor(private http: HttpClient) { }

  getCartItems(userId): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}cart/${userId}`);
  }

  addToCart(cartItem: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}cart/add`, cartItem);
  }

  removeCartItem(productId: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}cart/${productId}`);
  }

  updateQuantity(itemId: string, newQuantity: number): Observable<any> {
    const updateData = { itemId, newQuantity };
    return this.http.put<any>(`${this.apiUrl}update-quantity`, updateData);
  }
   }
