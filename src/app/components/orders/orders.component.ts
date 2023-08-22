import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert';
import { CartService } from 'src/app/services/cart.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
orders:any;
order:any;
qtty:any;
totalQuantity:any;
decodedToken:any;
  constructor(
    private cartService: CartService
  ) { }

  ngOnInit() {
    let token = sessionStorage.getItem("jwt");
    if (token) {
      this.decodedToken = this.decodeToken(token);
      const userId = this.decodedToken.userId;
      this.fetchOrderItems(userId)

  }
  }
  fetchOrderItems(userId): any {
    this.cartService.getOrderItems(userId).subscribe(
      (orders) => {
        console.log(orders)
        this.orders = orders;
        console.log(this.orders)
        for (let i = 0; i < this.orders.length; i++) {
           this.order = orders[i];
          this.qtty = this.order.items.reduce((totalQuantity, item) => totalQuantity + item.quantity, 0);
        console.log(this.qtty)
        this.orders[i].quantity = [];
        this.orders[i].quantity.push(this.qtty)
        console.log(this.orders)
        }
        
        this.totalQuantity = this.qtty; // Update totalQuantity property
      },
      (error) => {
        console.error('Error fetching order items', error);
      }
    );
  }
 

  decodeToken(token: string) {
    return jwt_decode(token);
  }
}


