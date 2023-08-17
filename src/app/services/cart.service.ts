import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, BehaviorSubject,Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItems: any[] = []; // Track cart items here
 

  private apiUrl = 'http://localhost:4000/api/';
  private totalQuantitySubject = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) { }

 
  public totalQuantity$ = this.totalQuantitySubject.asObservable();

  // Update the total quantity
  updateTotalQuantity(totalQuantity: number) {
    this.totalQuantitySubject.next(totalQuantity);
  }

  getCartItems(userId): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}cart/${userId}`);
  }

  addToCart(cartItem: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}cart/add`, cartItem);
  }

  removeCartItem(categoryId: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}cart/${categoryId}`);
  }

  updateQuantity(itemId: string, newQuantity: number): Observable<any> {
    const updateData = { itemId, newQuantity };
    return this.http.put<any>(`${this.apiUrl}update-quantity`, updateData);
  }

  // Update cart items and emit the event

}
