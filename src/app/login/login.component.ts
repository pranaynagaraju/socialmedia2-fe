import { Component, OnInit, NgZone  } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GoogleAuthProvider, signInWithPopup,signInWithEmailAndPassword } from "firebase/auth";
import { onAuthStateChanged,signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';
import { AnimationComponent } from '../animation/animation.component';
import { CommonModule } from '@angular/common';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { ProfileService } from '../services/profile-service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,AnimationComponent,CommonModule,RouterLink,HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent  implements OnInit {
  loginCheck: any;
  passVisible: boolean = false;
  email: string = "";
  password: string = "";
  isAnimation=false;
  token:any;
  constructor(private router: Router, private http: HttpClient, private profileService:ProfileService) { }
   
  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      this.token=localStorage.getItem('token');
    } 
    if(this.token)
    {
      this.profileService.getUserDetails(this.email, this.password)
      .subscribe({
        next: (response) => {
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Login failed', error);
        }
      });
    }
  }
  visibility(): void {
    this.passVisible = !this.passVisible;
    console.log(this.passVisible)
  }

  login(event: Event): void {
    event.preventDefault();
    this.isAnimation=true;
    this.profileService.getUserDetails(this.email, this.password)
    .subscribe({
      next: (response) => {
        event.preventDefault();

        this.router.navigate(['/home']);
        localStorage.setItem('token', btoa(`${this.email}:${this.password}`));
        localStorage.setItem('uid', response.id);
      },
      error: (error) => {
        console.error('Login failed', error);
      }
    });
  }
  //working code
  // async googleLogin(): Promise<any> {
  //   const provider = await new GoogleAuthProvider();
  //   return await signInWithPopup(auth, provider);
  // }
  
  async googleLogin(): Promise<any> {
   
      const provider = await new GoogleAuthProvider();
      const userResult = await signInWithPopup(auth, provider) .then((userResult) => {
        userResult.user.getIdToken().then((idToken)=> {
          localStorage.setItem('token', idToken);
          this.router.navigate(['/home']);
      });
      })
      .catch((error) => {
        console.error("Login failed due to an error", error);
      });

      
  }
  
  
}