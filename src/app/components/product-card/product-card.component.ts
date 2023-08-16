import { Component, OnInit } from '@angular/core';
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


  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService // Inject the CartService
  ) {}

  ngOnInit() {
    this.getProducts();
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

    this.cartService.addToCart(cartItem).subscribe(
      () => {
        swal('Success', 'Item added to cart', 'success');
      },
      (error) => {
        swal('Error', 'Failed to add item to cart', 'error');
        console.error('Error adding item to cart', error);
      }
    );
  }
  }
  decodeToken(token:string){
    return jwt_decode(token);
  }
}
