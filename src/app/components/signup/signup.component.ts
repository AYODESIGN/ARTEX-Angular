import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  title:string = "Admin Registration"
  //form Id
  signupForm: FormGroup;
  imagePreview: any;
  pdfPreview: any;
  selectedFile: any;
  fileName: any;
  id: any
  
// current url by boolean
  currentUrl: String
  user = false
  admin = false
 
  
  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
    ) { }
    
      ngOnInit() {
        this.currentUrl = window.location.pathname;
        console.log(this.currentUrl);
    
        if (this.currentUrl === '/signup/user') {
          this.user = true;
          this.title = 'User Registration';
          console.log('user', this.title);
          this.signupForm = this.formBuilder.group({
            firstName: ['', [Validators.required, Validators.minLength(3)]],
            lastName: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            pwd: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]],
            address: ['', [Validators.required, Validators.minLength(5)]],
            phone: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(8)]],
            img: [''],
            role: ['user']
          });
        } else if (this.currentUrl === '/signup/admin') {
          this.admin = true;
          this.title = 'Admin Registration';
          console.log('admin', this.title);
          this.signupForm = this.formBuilder.group({
            firstName: ['', [Validators.required, Validators.minLength(3)]],
            lastName: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(8)]],
            pwd: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]],
            address: ['', [Validators.required, Validators.minLength(5)]],
            img: [''],
            role: ['admin']
          });
        }
      }
   
    
  
    
      signup() {
        console.log("HERE OBJECT", this.signupForm.value);
        this.usersService.signupUser(this.signupForm.value, this.signupForm.value.img).subscribe();
        this.router.navigate(['/login']);
      }
    
      onImageSelected(event: Event) {
        const file = (event.target as HTMLInputElement).files[0];
        this.signupForm.patchValue({ img: file });
        this.signupForm.updateValueAndValidity();
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result as string;
          console.log(this.imagePreview);
        };
        reader.readAsDataURL(file);
      }
    }