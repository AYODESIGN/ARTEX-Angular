import  jwt_decode  from 'jwt-decode';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {


categoryForm: FormGroup;
imagePreview: any;
id: any;
title: string = "Add Category";
courses: any;
// editMode:boolean = false;
// image: any 
constructor( private formBuilder: FormBuilder,
  private activatedRoute: ActivatedRoute,
  private router: Router,
  private productService: ProductService,
  
  ) { }

ngOnInit() {
  
//   let token = sessionStorage.getItem("jwt")
//   let decodedToken:any = jwt_decode(token)
//   console.log(decodedToken.userId)
// this.id = this.activatedRoute.snapshot.paramMap.get("id")
// if (this.id){
// this.editMode = true
// this.title = "Edit Course"
// this.courseService.getCourseById(this.id).subscribe((response)=>{
//   console.log(response)
//     this.courses = response.course
//     this.imagePreview = this.courses.img
//     this.addCourseForm = this.formBuilder.group({
//       name: [this.courses.name, [Validators.required, Validators.minLength(3)]],
//       description: [this.courses.description, [Validators.required, Validators.minLength(3)]],
//       duration: [this.courses.duration, [Validators.required, Validators.minLength(3)]],
//       teacherId: [decodedToken.userId, [Validators.required]],
//       _id: [this.id, [Validators.required]],
//       img: [this.imagePreview],
//     });
  
// })
// }
  
  this.categoryForm = this.formBuilder.group({
    categoryName: ['', [Validators.required, Validators.minLength(3)]],
    width: ['', [Validators.required, Validators.minLength(3)]],
    weight: ['', [Validators.required, Validators.minLength(3)]],
    length: ['', [Validators.required, Validators.minLength(3)]],
    composition: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(3)]],
  });

}

addCategory(){
  console.log("HERE OBJECT", this.categoryForm.value);
  this.productService.addCategory(this.categoryForm.value).subscribe();
  swal('Success!', `Course ${this.categoryForm.value.categoryName} added successfully!`, 'success')
  }

//  edit() {
//   console.log("loging the form",this.addCourseForm.value)
//   this.courseService.editCourse(this.addCourseForm.value , this.addCourseForm.value.img).subscribe(
//     (response) => {
//       console.log("Here response after upddate from BE", response.msg);
//     }
//   )
//   swal('Success!', `Course ${this.addCourseForm.value.name} edited successfully!`, 'success')
// }

// onImageSelected(event: Event) {
//   const file = (event.target as HTMLInputElement).files[0];
//   this.addCourseForm.patchValue({ img: file });
//   this.addCourseForm.updateValueAndValidity();
//   const reader = new FileReader();
//   reader.onload = () => {
//   this.imagePreview = reader.result as string
//   };
//   reader.readAsDataURL(file);
// }
 }