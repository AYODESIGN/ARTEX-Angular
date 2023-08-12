import  jwt_decode  from 'jwt-decode';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  imagePreview: any;
  id: any;
  title: string = "";
  categories:any

  constructor(
    private formBuilder: FormBuilder,
  private activatedRoute: ActivatedRoute,
  private router: Router,
  private productService: ProductService,
  ) { }

  ngOnInit() {

    this.getCategory()


    this.productForm = this.formBuilder.group({
      productName: ['', [Validators.required, Validators.minLength(3)]],
      designRef: ['', [Validators.required, Validators.minLength(2)]],
      colorRef: ['', [Validators.required, Validators.minLength(2)]],
      available: ['', [Validators.required, Validators.minLength(3)]],
      // available: ['',],
    });
  }

  getCategory(){
    this.productService.getAllCategories().subscribe((response)=>{
      console.log(response)
      this.categories = response.Course      

      console.log(this.categories)
       })}
  

  addProduct(){
    console.log(this.productForm.value)
  }

}
