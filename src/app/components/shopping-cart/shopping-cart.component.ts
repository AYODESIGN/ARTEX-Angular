import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import  jwt_decode  from 'jwt-decode';
@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  cartItems: any[] = []; // Initialize with an empty array
  decodedToken:any;
  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    let token = sessionStorage.getItem("jwt")
    if(token){
      this.decodedToken = this.decodeToken(token)
    
    const userId = this.decodedToken.userId;
    this.fetchCartItems(userId);
  }
}

  fetchCartItems(userId): void {
    this.cartService.getCartItems(userId).subscribe(
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
    this.cartService.removeCartItem(cartItem.productId._id).subscribe(
      () => {
        // Item removed successfully
        this.fetchCartItems(this.decodedToken.userId); // Refresh the cart items after removal
      },
      (error) => {
        console.error('Error removing item from cart', error);
      }
    );
  }

  incrementQuantity(cartItem) {
    cartItem.quantity++;
    this.updateQuantityInDatabase(cartItem._id, cartItem.quantity);
  }
  
  decrementQuantity(cartItem) {
    if (cartItem.quantity > 1) {
      cartItem.quantity--;
      this.updateQuantityInDatabase(cartItem._id, cartItem.quantity);
    }
  }

  updateQuantityInDatabase(itemId, newQuantity) {
    this.cartService.updateQuantity(itemId, newQuantity).subscribe(
      (response) => {
        
        console.log('Quantity updated successfully' );
        // Optionally, you can update your local cartItems array or perform any other actions
      }
    
    );
  }
  
  decodeToken(token:string){
    return jwt_decode(token);
  }

}
