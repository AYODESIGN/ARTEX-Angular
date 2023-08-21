import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import swal from 'sweetalert';
import { CartService } from 'src/app/services/cart.service';
import jwt_decode from 'jwt-decode';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  decodedToken: any;
  admin: boolean = false;
  user: boolean = false;
  cartItems: any[] = [];
  cartItemsSubscription: Subscription;
  totalQuantity: any = null ;
  qtty: number
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private cartService: CartService
  ) {}

  ngOnInit() {
    
      this.isLoggedIn();
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
        this.fetchCartItems(userId)
        this.totalQuantity = null; // Set the initial value
        console.log("Initial total quantity: ", this.totalQuantity);
        
        console.log(this.qtty)
      }

    }
    
  

  ngOnDestroy() {
    // Unsubscribe from the cartItemsUpdated event
    this.cartItemsSubscription.unsubscribe();
  }

  isLoggedIn(): boolean {
    let token = sessionStorage.getItem('jwt');
    if (token) {
      this.decodedToken = this.decodeToken(token);
      if (this.decodedToken.role === 'admin') {
        this.admin = true;

      }
      if (this.decodedToken.role === 'user') {
        this.user = true;
    
    
      }
      
      return true;
    }
    return false;
  }

  logout() {
    // Use SweetAlert to display logout confirmation
    swal({
      title: 'Logout Confirmation',
      text: 'Are you sure you want to log out?',
      icon: 'warning',
      buttons: ['Cancel', 'Yes, Logout'],
      dangerMode: true,
    }).then((confirmed) => {
      if (confirmed) {
        // User confirmed logout, clear the JWT token and display logout success message
        sessionStorage.removeItem('jwt');
        this.admin = false;
        this.user = false;
        this.qtty = 0
        this.totalQuantity = 0 
        // Use SweetAlert to display logout success message
        swal('Logged Out!', 'You have been successfully logged out.', 'success');
        this.router.navigate(['/login']);
      }
    });
  }

  goToEditProfile(id) {
    this.router.navigate([`edit-profile/${id}`]);
  }

  fetchCartItems(userId): void {
    this.cartService.getCartItems(userId).subscribe(
      (cartItems) => {
        this.cartItems = cartItems;
        this.qtty = this.cartItems.reduce((totalQuantity, item) => totalQuantity + item.quantity, 0);
        this.totalQuantity = this.qtty; // Update totalQuantity property
      },
      (error) => {
        console.error('Error fetching cart items', error);
      }
    );
  }
  getTotalQuantity(): number {
    return this.cartItems.reduce((totalQuantity, item) => totalQuantity + item.quantity, 0);
  }

  decodeToken(token: string) {
    return jwt_decode(token);
  }
}
