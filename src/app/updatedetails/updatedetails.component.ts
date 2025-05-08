import { Component, OnInit, NgZone  } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AnimationComponent } from '../animation/animation.component';
import { CommonModule } from '@angular/common';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { getAuth, updateProfile } from "firebase/auth";

@Component({
  selector: 'app-updatedetails',
  standalone: true,
  imports: [FormsModule,AnimationComponent,CommonModule,RouterLink,HttpClientModule],
  templateUrl: './updatedetails.component.html',
  styleUrl: './updatedetails.component.css'
})
export class UpdatedetailsComponent {
  userName="";
  isAnimation=false;
update(event: Event)
{
  const auth = getAuth();
  if(auth.currentUser)
  {
updateProfile(auth.currentUser, {
  displayName: "Jane Q. User", photoURL: "https://example.com/jane-q-user/profile.jpg"
}).then(() => {
  // Profile updated!
  // ...
}).catch((error) => {
  // An error occurred
  // ...
});
  }
}
}
