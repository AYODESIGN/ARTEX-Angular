import { Subscription } from 'rxjs';
import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert';
import { ProductService } from 'src/app/services/product.service';
import { CartService } from 'src/app/services/cart.service'; // Import your CartService
import  jwt_decode  from 'jwt-decode';


@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {
  products: any[];
  decodedToken:any;
cartItems:any;
cart:any;
@Output() cartItemsUpdated = new EventEmitter<any[]>();
  cartItemsSubscription:Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService // Inject the CartService
  ) {}

  ngOnInit() {
    this.getProducts();
    let token = sessionStorage.getItem("jwt")
    if(token){
      this.decodedToken = this.decodeToken(token)
    
    const userId = this.decodedToken.userId;
    // this.fetchCartItems(userId);

    
  }

  
  }

  getProducts() {
    this.productService.getAllProducts().subscribe((response) => {
      console.log(response);
      this.products = response.products;
    });
  }

  addToCart(product: any): void {
    let token = sessionStorage.getItem("jwt")
    if(token){
      this.decodedToken = this.decodeToken(token)
    
    const userId = this.decodedToken.userId; // Decode the user ID from the JWT token
    const cartItem = {
      categoryId: product.categoryId._id,
      productId: product._id,
      userId: userId, // Use the decoded user ID
      quantity: 1 // You can set the initial quantity
    };
console.log("HERE INTO CART",cartItem)
    this.cartService.addToCart(cartItem).subscribe(
      () => {
        this.fetchCartItems(this.decodedToken.userId); // Fetch updated cart items
        let quantity = this.getTotalQuantity()
        quantity++
        this.cartService.updateTotalQuantity(quantity)
        swal('Success', 'Item added to cart', 'success');
      },
      (error) => {
        swal('Error', 'Failed to add item to cart', 'error');
        console.error('Error adding item to cart', error);
      }
    );
  }

  }

  fetchCartItems(userId): void {
    this.cartService.getCartItems(userId).subscribe(
      (cartItems) => {
        console.log(cartItems)
        this.cartItems = cartItems; // Assign the fetched cart items
        // Now that cartItems are available, you can call getTotalQuantity
        let quantity = this.getTotalQuantity()
        this.cartService.updateTotalQuantity(quantity)
      },
      (error) => {
        console.error('Error fetching cart items', error);
      }
    );
  }

  getTotalQuantity(): number {
    // Check if cartItems is defined before using reduce
    if (this.cartItems) {
      return this.cartItems.reduce((totalQuantity, item) => totalQuantity + item.quantity, 0);
    } else {
      return 0; // Return a default value if cartItems is undefined
    }
  }


  decodeToken(token:string){
    return jwt_decode(token);
  }

  

 

}
