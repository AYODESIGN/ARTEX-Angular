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

  getOrderItems(userId): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}orders/${userId}`);
  }

  addToCart(cartItem: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}cart/add`, cartItem);
  }

  deleteAllCart(userId: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}itemsDeleted/${userId}`);
  }

  removeCartItem(categoryId: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}cart/${categoryId}`);
  }

  updateQuantity(itemId: string, newQuantity: number): Observable<any> {
    const updateData = { itemId, newQuantity };
    return this.http.put<any>(`${this.apiUrl}update-quantity`, updateData);
  }

  addOrder(order: any): Observable<any> {
    const url = `${this.apiUrl}order/add`; // Adjust the URL based on your API endpoints
    return this.http.post(url, order);
  }

  
}
