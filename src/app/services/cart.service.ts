import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,Subject} from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItemsUpdated = new EventEmitter<any[]>();
  private cartItems: any[] = []; // Track cart items here
  private refrechHeaderSubject = new Subject<void>();
  refrechHeader$ = this.refrechHeaderSubject.asObservable();

  private apiUrl = 'http://localhost:4000/api/';

  constructor(private http: HttpClient) { }

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
  updateCartItems(cartItems: any[]) {
    this.cartItems = cartItems;
    this.cartItemsUpdated.emit(this.cartItems);
  }

  triggerHeaderRefrech(){
    this.refrechHeaderSubject.next();
  }
}
