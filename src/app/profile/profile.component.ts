import { CommonModule } from '@angular/common';
import { HttpClient,HttpClientModule, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProfileService } from '../services/profile-service'; // Adjust the path as needed
import { PostService } from '../services/post-service';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  providers: [ProfileService],
  imports: [CommonModule,FormsModule,HttpClientModule,RouterLink],
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  @ViewChild('addCommentRef') myInput: ElementRef | undefined;
  profilebtnSelected=false;
  userName="";
  email="";
  userImage="";
  posts:any[]=[];
  postsLength:undefined | number;
  savedPostsLength:undefined|number;
  token:any;
  isloading=false;
  postDetails:any;
  isPostsSelected=true;
  showPostDetails=false;
  comment="";
  savedPosts:any[]=[];
  showSavedPosts=false;
  url = "Dummy";
  constructor(private http:HttpClient, private router:ActivatedRoute, private profileService:ProfileService, private postService:PostService
  )
  {

  }
  onProfileSelected():void
  {
  console.log("clicked")
  this.profilebtnSelected=!this.profilebtnSelected;
  console.log(this.profilebtnSelected);
  }

  changeElementStatePost():void
  {
    this.isPostsSelected=true;
  }
  changeElementStateSaved():void
  {
    this.isPostsSelected=false;
  }
  ngOnInit()
{
  this.isloading=true;
  this.showSavedPosts=this.router.snapshot.params['id']==localStorage.getItem('uid');
  this.token=localStorage.getItem('token');
  const token =localStorage.getItem('token');
  if(token)
  {
    console.log("bhaaya",this.router.snapshot.routeConfig?.path?.includes('saved'));
    console.log("bhaaya",this.router.snapshot.params['id']);

 this.profileService.getUserProfile(this.router.snapshot.params['id']).subscribe(
  (res:any)=>{
    this.userName=res.userName;
    this.userImage=res.userPhotoUrl;
    this.email=res.email;
    this.posts=res.userPosts;
    this.savedPosts=res.savedPostsList;
    this.postsLength=this.posts.length;
    this.savedPostsLength=this.savedPosts.length;

    this.isloading=false;
  }
  )
  if(this.router.snapshot.routeConfig?.path?.includes('saved'))
    {this.changeElementStateSaved();
    }
    }
}
onSaveClick(post:any) {
  post.saved = !post.saved;
  this.postService.savePost(post.postId.toString()).subscribe(
    (response:String)=>
    {
      this.profileService.getUserProfile(this.router.snapshot.params['id']).subscribe(
        (res:any)=>{
          this.userName=res.userName;
          this.userImage=res.userPhotoUrl;
          this.email=res.email;
          this.posts=res.userPosts;
          this.savedPosts=res.savedPostsList;
          this.postsLength=this.posts.length;
          this.savedPostsLength=this.savedPosts.length;
        }
        )
    }
  );
  
} 
toggleCaret():void
{
  if(this.myInput)
  {
  const inputElement = this.myInput.nativeElement as HTMLInputElement;
  inputElement.focus();
  }
}

closePostDetailsModal()
{   
  this.showPostDetails=false;

}
showDetails(post:any)
{

  this.postService.getPostDetails(post.postId).subscribe(
    (response: any) => {
     this.postDetails=response;
     this.showPostDetails=true;
    },
    (error: any) => {
      // Handle errors if needed
    }
  )

}
onLikeClick(postToBeLiked:any) {
  postToBeLiked.liked = !postToBeLiked.liked;
  if(postToBeLiked.liked)
  {
    postToBeLiked.totalLikes++;
  this.posts.map((post)=>{
    if(post.postId==postToBeLiked.postId)
    {
      post.totalLikes++;
    }
  })
  }
  else
  {
    postToBeLiked.totalLikes--;
    this.posts.map((post)=>{
      if(post.postId==postToBeLiked.postId)
      {
        post.totalLikes--;
      }
    })
  }
  const params = {
    token: this.token,
    postId: postToBeLiked.postId.toString(),
  };

  return this.postService.likePost(postToBeLiked.postId.toString()).subscribe();
}
addComment(postDetails: any) {
console.log("adding the comment",postDetails.postId);
  this.postService.addComment(postDetails.postId.toString(), this.comment).subscribe();
  this.showDetails(postDetails)
  // const params = {
  //   token: this.token,
  //   postId: postDetails.postId.toString(),
  //   comment: this.comment,
  // };

  // const headers = new HttpHeaders({
  //   'Content-Type': 'text/plain',
  // });

  // this.http.post(`${this.url}post/add-comment`, {}, { params, headers, responseType: 'text' })
  //   .subscribe(
  //     (response: any) => {
  //       console.log(postDetails.pi);
  //       this.showDetails(postDetails);
  //       this.comment="";
  //     },
  //     (error: HttpErrorResponse) => {
  //       console.error('Error:', error);
  //       console.log('Response Text:', error.error.text); // Access the response text
  //       // Handle the error as needed
  //     }
  //   );
}

}
