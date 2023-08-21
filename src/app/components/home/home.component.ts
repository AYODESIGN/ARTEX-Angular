import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  totalQuantity: any = null ;
  qtty: any
  decodedToken: any;
  cartItems: any[] = [];


  constructor( 
    private cartService: CartService

  ) { }

  ngOnInit() {
    console.log('hooooommmmmme')
    let token = sessionStorage.getItem("jwt");
      if (token) {
        this.decodedToken = this.decodeToken(token);
        const userId = this.decodedToken.userId;
        
        // Subscribe to the totalQuantity$ observable first
        this.cartService.totalQuantity$.subscribe(totalQuantity => {
          this.totalQuantity = totalQuantity;
          console.log("Updated total quantity from service: ", totalQuantity);
        });
    
        // Fetch cart items and set the initial value of totalQuantity after subscribing
        console.log(userId)
        this.fetchCartItems(userId)
        this.totalQuantity = null; // Set the initial value
        console.log("Initial total quantity: ", this.totalQuantity);
        
       
      }

    }

  fetchCartItems(userId): void {
    this.cartService.getCartItems(userId).subscribe(
      (cartItems) => {
        this.cartItems = cartItems;
        this.qtty = this.cartItems.reduce((totalQuantity, item) => totalQuantity + item.quantity, 0);
        console.log(this.qtty)
        this.totalQuantity = this.qtty; // Update totalQuantity property
        this.cartService.updateTotalQuantity(this.totalQuantity)


      },
      (error) => {
        console.error('Error fetching cart items', error);
      }
    );
  }
  
  decodeToken(token: string) {
    return jwt_decode(token);
  }
}
