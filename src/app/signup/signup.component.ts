import { Component  } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { createUserWithEmailAndPassword,updateProfile,signOut } from "firebase/auth";
import { auth } from '../../firebase/firebaseConfig';
import { AnimationComponent } from '../animation/animation.component';
import { CommonModule } from '@angular/common';
import { HttpClient,HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule,AnimationComponent,CommonModule,RouterLink,HttpClientModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  loginCheck: any;
  passVisible: boolean = false;
  email: string = "";
  userName: string = "";
  password: string = "";
  isAnimation=false;
  token:any;
  url='http://orbit-socials.ap-south-1.elasticbeanstalk.com/';
  constructor(private router: Router, private http: HttpClient) { }
   
  ngOnInit(): void {
    this.token=localStorage.getItem('token');
    if(this.token)
    {
    this.loginCheck = this.http.get(this.url+"?token="+this.token).subscribe(
      response => {
      this.router.navigate(['/home']);
      }
    );
    }
  }
  visibility(): void {
    this.passVisible = !this.passVisible;
    console.log(this.passVisible)
  }

  signUp(event: Event): void {
    event.preventDefault();
    createUserWithEmailAndPassword(auth, this.email, this.password)
  .then((userDetails) => {
    if(auth.currentUser)
    {
    updateProfile(auth.currentUser, {
      displayName: this.userName
    }).then(() => {
      auth.currentUser?.getIdToken().then(
        (idToken)=> {
          localStorage.setItem('token', idToken);
          signOut(auth).then(() => {
            console.log("here")  
            localStorage.removeItem('token');
            this.router.navigate([''])
      
          }).catch((error) => {
      
          });
          
          this.router.navigate(['']);
      }
      )
    }).catch((error) => {
    });
  }
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    this.isAnimation=false;
  });
  }  
  
}
