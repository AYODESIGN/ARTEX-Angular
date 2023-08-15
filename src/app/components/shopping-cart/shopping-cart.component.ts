import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  cartItems: any[] = []; // Initialize with an empty array

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.fetchCartItems();
  }

  fetchCartItems(): void {
    this.cartService.getCartItems().subscribe(
      (cartItems) => {
        console.log(cartItems)
        this.cartItems = cartItems; // Assign the fetched cart items
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
    this.cartService.removeCartItem(cartItem.productId).subscribe(
      () => {
        // Item removed successfully
        this.fetchCartItems(); // Refresh the cart items after removal
      },
      (error) => {
        console.error('Error removing item from cart', error);
      }
    );
  }
}
