import { Component, OnInit,NgZone  } from '@angular/core';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnimationComponent } from '../animation/animation.component';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { PostService } from '../services/post-service';
import { ProfileService } from '../services/profile-service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule,AnimationComponent,FormsModule,HttpClientModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent implements OnInit {
  isAnimation=true;
  token:any;
  loginCheck:any;
  constructor(private router:Router,private http:HttpClient, private profileService:ProfileService){}
  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      this.token=localStorage.getItem('token');
    } 
  if (this.token) {
    this.profileService.authenticate()
    .subscribe({
      next: (response) => {
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.isAnimation = false;
        console.error('Login failed', error);
      }
    });
  } else {
    this.isAnimation = false; // Set animation to false if there is no token
  }
}
  loginBtn():void
  {
    this.router.navigate(['/login']);
  }
  signUpBtn():void
  {
    this.router.navigate(['/signup']);
  }
}
