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
  categoryId :any
  selectedCategoryId:any

  constructor(
    private formBuilder: FormBuilder,
  private activatedRoute: ActivatedRoute,
  private router: Router,
  private productService: ProductService,
  ) { }

  ngOnInit() {

    this.getCategory()


    this.productForm = this.formBuilder.group({
      designRef: ['', [Validators.required, Validators.minLength(2)]],
      colorRef: ['', [Validators.required, Validators.minLength(2)]],
      available: ['', [Validators.required, Validators.minLength(3)]],
      quantity: ['', [Validators.required]],
      categoryId: [null],  
      img: [this.imagePreview],
    });
  }

  getCategory(){
    this.productService.getAllCategories().subscribe((response)=>{
      console.log(response)
      this.categories = response.category      

      console.log(this.categories)
       })}
  

  addProduct(){
    console.log(this.productForm.value)
    
    this.productService.addProduct(this.productForm.value, this.productForm.value.img).subscribe();
    this.productForm.reset(); // Reset form values
    this.productForm.get('img').setValue(null); // Reset file input
    swal('Success!', 'Product added!', 'success');
  
  }

  onCategorySelected() {
    // Update the categoryId form control's value
    this.productForm.controls['categoryId'].setValue(this.productForm.value.categoryId);
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.productForm.patchValue({ img: file });
    this.productForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      console.log(this.imagePreview);
    };
    reader.readAsDataURL(file);
  }
}
