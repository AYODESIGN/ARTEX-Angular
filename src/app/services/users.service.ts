import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface StudentResponse {
  studentNumbers: { _id: string; phone: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = 'http://localhost:4000/api/users';

  constructor(private http: HttpClient) { }

  signupUser(user: any, img: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);
    formData.append('email', user.email);
    formData.append('pwd', user.pwd);
    formData.append('address', user.address);
    formData.append('phone', user.phone);
    formData.append('img', img);
    formData.append('role', user.role);
    

    return this.http.post<any>(`${this.apiUrl}/signup/user`, formData);
  }

  signupParent(parentObj){
    return this.http.post(`${this.apiUrl}/signup/parent`, parentObj)
  }

  signupAdmin(parentObj){
    return this.http.post(`${this.apiUrl}/signup/admin`, parentObj)
  }
  

  getAllStudentsPhoneNumbers(): Observable<StudentResponse> {
    return this.http.get<StudentResponse>(`${this.apiUrl}/signup/student/numbers`);
  }


  login(user){
    return this.http.post<{msg: string, role: string, user:any, }>(this.apiUrl + "/login" , user)
  }

  getTeacherById(teacherId: string) {
    return this.http.get<any>( `${this.apiUrl}/teacher/${teacherId}`);
  }

  getAllTeachers() {
    return this.http.get<any>( `${this.apiUrl}/teachers/`);
  }
  getLimitedTeachers() {
    return this.http.get<any>( `${this.apiUrl}/teachers/limit`);
  }

  getAllStudents() {
    return this.http.get<any>( `${this.apiUrl}/students/`);
  }

  deleteTeacherById(id) {
    return this.http.delete<{ isDeleted: boolean }>(`${this.apiUrl}/teacher/${id}`);
  }
  deleteStudentById(id) {
    return this.http.delete<{ isDeleted: boolean }>(`${this.apiUrl}/student/${id}`);
  }
  getByIdStudent(id) {
    return this.http.get<any>(`${this.apiUrl}/student/${id}`);
  }

  getStudentByChildPhone(phone) {
    return this.http.get<any>(`${this.apiUrl}/student/child/${phone}`);
  }

  confirmTeacher(id,teacherStatus) {
    return this.http.put<{ msg: string }>(`${this.apiUrl}/teacher/status/${id}`,{ status: teacherStatus });
  }

  searchTeacher(specialty) {
    return this.http.get<{ foundedTeachers:any ,msg: string }>(`${this.apiUrl}/searchTeacher/${specialty}`);
  }

  getAnyUserById(userId: string) {
    return this.http.get<any>( `${this.apiUrl}/${userId}`);
  }
  editTeacher(newUser , img:File) {
    const formData: FormData = new FormData();
    formData.append('_id', newUser._id);
    formData.append('firstName', newUser.firstName);
    formData.append('lastName', newUser.lastName);
    formData.append('address', newUser.address);
    formData.append('img', img);
    formData.append('role', newUser.role);

  
   
    return this.http.put<{ msg: string }>(`${this.apiUrl}/teacherEdit`, formData);
  }


  editParent(newUser: any, img: File): Observable<{ msg: string }> {
    const formData: FormData = new FormData();
    formData.append('_id', newUser._id);
    formData.append('firstName', newUser.firstName);
    formData.append('lastName', newUser.lastName);
    formData.append('address', newUser.address);
    formData.append('img', img);
    formData.append('role', newUser.role);

    return this.http.put<{ msg: string }>(`${this.apiUrl}/parentEdit`, formData);
  }

  editStudent(newUser: any, img: File): Observable<{ msg: string }> {
    const formData: FormData = new FormData();
    formData.append('_id', newUser._id);
    formData.append('firstName', newUser.firstName);
    formData.append('lastName', newUser.lastName);
    formData.append('address', newUser.address);
    formData.append('img', img);
    formData.append('role', newUser.role);

    return this.http.put<{ msg: string }>(`${this.apiUrl}/studentEdit`, formData);
  }

  editAdmin(newUser: any, img: File): Observable<{ msg: string }> {
    const formData: FormData = new FormData();
    formData.append('_id', newUser._id);
    formData.append('firstName', newUser.firstName);
    formData.append('lastName', newUser.lastName);
    formData.append('address', newUser.address);
    formData.append('img', img);
    formData.append('role', newUser.role);

    return this.http.put<{ msg: string }>(`${this.apiUrl}/adminEdit`, formData);
  }
}