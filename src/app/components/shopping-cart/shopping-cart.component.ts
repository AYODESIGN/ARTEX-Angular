import { CartService } from 'src/app/services/cart.service';
import jwt_decode from 'jwt-decode';
import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  cartItems: any[] = [];
  decodedToken: any;
  @Output() cartItemsUpdated = new EventEmitter<any[]>();
  cartItemsSubscription: Subscription;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    let token = sessionStorage.getItem("jwt");
    if (token) {
      this.decodedToken = this.decodeToken(token);
      const userId = this.decodedToken.userId;
      this.fetchCartItems(userId);
 

 
    }

 
  }

  

  fetchCartItems(userId): void {
    this.cartService.getCartItems(userId).subscribe(
      (cartItems) => {
        this.cartItems = cartItems;
      },
      (error) => {
        console.error('Error fetching cart items', error);
      }
    );
  }

  getTotalQuantity(): number {
    return this.cartItems.reduce((totalQuantity, item) => totalQuantity + item.quantity, 0);
  }

  removeCartItem(cartItem: any): void {
    this.cartService.removeCartItem(cartItem._id).subscribe(
      () => {
        this.fetchCartItems(this.decodedToken.userId);
      },
      (error) => {
        console.error('Error removing item from cart', error);
      }
    );
  }

  incrementQuantity(cartItem) {
    cartItem.quantity++;
    this.updateQuantityInDatabase(cartItem._id, cartItem.quantity);
    this.updateTotalQuantityInHeader()

  }

  decrementQuantity(cartItem) {
    if (cartItem.quantity > 1) {
      cartItem.quantity--;
      this.updateQuantityInDatabase(cartItem._id, cartItem.quantity);
      this.updateTotalQuantityInHeader()

    }
  }

  updateQuantityInDatabase(itemId, newQuantity) {
    this.cartService.updateQuantity(itemId, newQuantity).subscribe(
      () => {
        console.log('Quantity updated successfully');

        this.fetchCartItems(this.decodedToken.userId);
        this.updateTotalQuantityInHeader()
      },
      (error) => {
        console.error('Error updating quantity', error);
      }
    );
  }

  decodeToken(token: string) {
    return jwt_decode(token);
  }

 

  // shopping-cart.component.ts
updateTotalQuantityInHeader() {
  const totalQuantity = this.getTotalQuantity();
  this.cartService.updateTotalQuantity(totalQuantity); // Update totalQuantity in shared service
}


}
