import { Component, ElementRef,HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { auth } from '../../firebase/firebaseConfig';
import { CommonModule } from '@angular/common';
import { AnimationComponent } from '../animation/animation.component';
import { FormsModule } from '@angular/forms';
import { HttpClient,HttpClientModule, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { signOut } from 'firebase/auth';
import { TimeAgoPipe } from '../animation/pipes/timeAgoPipe';
import { PostDetails } from '../interfaces/post-details.interface';
import { ProfileService } from '../services/profile-service';
import { PostService } from '../services/post-service';
import { AiCharacterService } from '../services/ai-character-service';
import {AICharacter} from '../interfaces/ai-character.interface';






@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,AnimationComponent,FormsModule,HttpClientModule,TimeAgoPipe,RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnDestroy,OnInit{

@ViewChild('addCommentRef') myInput: ElementRef | undefined;
 userLoggedIn=false;
 userDetails:any;
 userImage:any='../../assets/user.png';
 userName:any;
 showFiller = true;
 userEmail:any;
 fileUpload: File | undefined;
 isAnimation=true;
 profilebtnSelected:boolean;
 loginCheck:any;
 search:any;
 searchUserResult:any[]=[];
 token:any;
 postText: any="";
 postsList: any[]=[];
 showSearchBox=false;
 totalNoOfPosts=0;
 isGetPostsLoading=false;
 isModalVisible = false;
 showPostDetails=false;
 showUploadPostModal=false;
 uploadedImagePath: string = '';
 postDetails: PostDetails = {} as PostDetails
 comment="";
 userId="";
 subscription:any;
 isprofileloading=false;
 timeout:any;
 searchLoading=false;
 showAiCharactersModal=false
 selectedCharacters: AICharacter[] =[];
 selectedCharacterNames: String[] =[];
 aiCharacters :AICharacter[]=[];
 successMessage="";
  constructor( private postService:PostService,
    private router:Router,private elRef: ElementRef, 
    private http: HttpClient, 
    private profileService:ProfileService,
  private aiCharacterService: AiCharacterService) {
    this.profilebtnSelected=false;
  }

  saveSelectedCharacters() {
    let selectCharacterConcat = this.selectedCharacters?.length != 0 
    ? this.selectedCharacters.map(item => item.id.toString().trim()).join(",") 
    : "0";
    this.aiCharacterService.setAiCharacters(selectCharacterConcat).subscribe(
      (response: any) => {
       this.successMessage="*"+response;
       setTimeout(() => {this.successMessage=""}, 3000);
      }
    );
    }
  resetSelectedCharacters()
  {
    this.selectedCharacters=[];
    this.selectedCharacterNames=[];
    this.aiCharacters.forEach((character:any) => {
      character.isSelected = false;
    });
  }
  selectCharacter(character: any) {
    console.log(character);
    console.log(this.selectedCharacters);
  
    if (!this.selectedCharacters) {
      this.selectedCharacters = [];
      this.selectedCharacterNames=[];
    }
  
    if (character.isSelected) {
      character.isSelected = false;
      this.selectedCharacters = this.selectedCharacters.filter(item => item.name !== character.name);
      this.selectedCharacterNames = this.selectedCharacters.map(item => item.name);
    } else {
      character.isSelected = true;
      this.selectedCharacters = [...this.selectedCharacters, character]; // Ensures UI updates
      this.selectedCharacterNames = this.selectedCharacters.map(item => item.name);
    }
  }
  
  closeAiCharactersModal() {
    this.showAiCharactersModal = false;
  }
  openAiCharactersModal() {
    this.aiCharacterService.getAiCharacters().subscribe(
      (response: any) => {  
        this.aiCharacters = response;
        this.selectedCharacters=this.aiCharacters.filter((item:any)=>item.isSelected);
        this.selectedCharacterNames = this.selectedCharacters.map(item => item.name);
        this.showAiCharactersModal = true;
      }
    );
    this.showAiCharactersModal = true;
  }

  toggleModal() {
    this.isModalVisible = !this.isModalVisible;
  }
  ngOnDestroy(): void {
   if (this.loginCheck) {
    this.loginCheck.unsubscribe();
  }

  }
  showSearchBoxToggle()
  {
    this.showSearchBox=!this.showSearchBox;
  }

  onDrop(event: any) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    // Logic to upload the image and get its path
    // For example, if you want to display the local path:
    this.uploadedImagePath = URL.createObjectURL(file);
  }

  allowDrop(event: any) {
    event.preventDefault();
  }


  ngOnInit() {
    if (typeof localStorage !== 'undefined') {
      this.token=localStorage.getItem('token');
    } ;
    this.isprofileloading=true;
    this.profileService.getUserDetails(this.profileService.email, this.profileService.password)
    .subscribe({
      next: (response) => {
        let user: any = response;
        this.userId=user.id;
        this.userName = user.name;
        this.userEmail = user.email;
        if(user.photoURL)
        {
        this.userImage = user.photoURL;
        }
        this.isprofileloading=false;
        console.log("API call here");  
      },
      error: () => {
        this.router.navigate(['/']);
      }
    });
    this.getAllPosts();
    // this.loginCheck = this.http.get(verifyTokenUrl).subscribe(
    //   response => {
    //     let user: any = response;
    //     this.userId=user.id;
    //     this.userName = user.name;
    //     this.userEmail = user.email;
    //     if(user.photoURL)
    //     {
    //     this.userImage = user.photoURL;
    //     }
    //     this.isprofileloading=false;
    //     console.log("API call here");
    //   },
    //   error => {
    //       this.router.navigate(['/']);
    //   }
  //   )
  // this.getAllPosts();
  }

  uploadPostsModal()
  {
    if(this.showUploadPostModal)
    {
      this.uploadedImagePath = '';
    }
    this.showUploadPostModal=!this.showUploadPostModal;
  }

  closeDropdown():void
  {
    if(this.profilebtnSelected)
    {
      this.profilebtnSelected=false;
    }
    
  }
  
  searchUserDebounce(event: Event):void{
    clearTimeout(this.timeout);
    if((event.target as HTMLInputElement).value==="")
    {
      this.searchLoading=false;
      this.searchUserResult=[];
    }
    else{
  if(this.timeout)
  {    this.searchLoading=false;
    clearTimeout(this.timeout);
  }
  this.searchLoading=true;
  this.timeout=setTimeout(() => {
    this.searchUsers(event)
  },750);
}
  }

  searchUsers(event: Event):void{
    if(this.subscription)
      {
        this.subscription.unsubscribe();
      }
      this.subscription=this.profileService.searchUserProfile((event.target as HTMLInputElement).value).subscribe(
        (response:any)=>{
          if((event.target as HTMLInputElement).value!=="")
          {
          this.searchUserResult=response;
          }
          this.searchLoading=false;
        }
      );
  }
  onLikeClick(post:any) {
    post.liked = !post.liked;
    if(post.liked)
    {
    post.totalLikes++;
    
    }
    else
    {
      post.totalLikes--;
    }
    const item = this.postsList.find((item) => item.postId === post.postId);
    if (item) {
    item.liked = post.liked;
     item.totalLikes = post.totalLikes;
    }
    const params = {
      token: this.token,
      postId: post.postId.toString(),
    };
    return this.postService.likePost(post.postId).subscribe(
      (response: any) => {
        console.log(response);
      },
      (error: any) => {
        console.error('Error liking post:', error);
    
      }
    );

  }
  onSaveClick(post:any) {
    post.saved = !post.saved;
    this.postService.savePost(post.postId).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.error('Error saving post:', err);
      },
    });
    // post.saved = !post.saved;
    // const params = {
    //   token: this.token,
    //   postId: post.postId.toString(),
    // };
    // return this.http.post<string>(`${this.url}post/save`, null, { params }).subscribe(
    //   (response:String)=>
    //   {
    //       console.log(response);
    //   }
    // );
  } 
  toggleCaret():void
  {
    if(this.myInput)
    {
    const inputElement = this.myInput.nativeElement as HTMLInputElement;
    inputElement.focus();
    }
  }

onCommentClick(post:any)
{

  this.postService.getPostDetails(post.postId).subscribe(
    (response: any) => {
      this.postDetails=response;
      console.log(this.postDetails);
      this.showPostDetails=true;
     },
     (error: any) => {
       // Handle errors if needed
     }
  );

  // const getPostDetails = `${this.url}post/get-post-details?token=${this.token}&postId=${post.postId}`;
    
  // this.http.get(getPostDetails).subscribe(
  //   (response: any) => {
  //    this.postDetails=response;
  //    this.showPostDetails=true;
  //   },
  //   (error: any) => {
  //     // Handle errors if needed
  //   }
  // )
}
closePostDetailsModal()
{   
  this.showPostDetails=false;

}
addComment(postDetails: any) {
  this.postService.addComment(postDetails.postId, this.comment).subscribe(

    (response: any) => {
      this.onCommentClick(postDetails);
      this.comment="";
      this.postsList.filter((post) => post.postId === postDetails.postId)[0].totalComments++;
    },
    (error: any) => {
      console.error('Error:', error);
      console.log('Response Text:', error.error.text); // Access the response text
      // Handle the error as needed
    }
  );
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
  //       this.onCommentClick(postDetails);
  //       this.comment="";
  //     },
  //     (error: HttpErrorResponse) => {
  //       console.error('Error:', error);
  //       console.log('Response Text:', error.error.text); // Access the response text
  //       // Handle the error as needed
  //     }
  //   );
}

  getAllPosts(): void {
    console.log("called all posts")    
    this.postService.getAllPosts(). 
    subscribe(
      (response: any) => {
        this.postsList = response;
        this.totalNoOfPosts=this.postsList.length;
        console.log("ALL POST GET"+response)
      },
      (error: any) => {
        // Handle errors if needed
      }
    );
  }
  

onProfileSelected():void
  {
  console.log("clicked")
  this.profilebtnSelected=!this.profilebtnSelected;
  console.log(this.profilebtnSelected);
  }
  onImageError() {
    this.userImage = '../../assets/user.png';
  }
  onSearchImageError(item:any) {
    item.userPhotoUrl = '../../assets/user.png';
  }
  onsignOutbtnclick():void
  {
    console.log("signout")
    signOut(auth).then(() => {
      console.log("here")  
      localStorage.removeItem('token');
      this.router.navigate([''])

    }).catch((error) => {

    });
    
  }
  uploadImage(event:Event):void{
    const inputElement = event.target as HTMLInputElement;
  const file = inputElement?.files?.[0];

  if (file) {
    this.fileUpload = file;
    console.log(this.fileUpload);
      this.uploadedImagePath = URL.createObjectURL(file);
    }
  }
postUpdate():void
{

  if (this.fileUpload) {
    this.uploadPostsModal();
    this.postService.uploadImage(this.fileUpload, this.postText).subscribe(
      (response: any) => {
        this.getAllPosts();
        console.log('POST request successful:', response);
      },
      (error) => {
        console.error('POST request error:', error);
      }
    );
    // const formData = new FormData();
    // formData.append('token', this.token.toString());
    // formData.append('file', this.fileUpload as Blob, 'filename');
    // formData.append('postText', this.postText);
    // console.log(this.url + 'upload'+formData)
    // console.log(this.fileUpload.toString());
    // const sendPostUrl = `${this.url}post/upload`;
    // const headers = new HttpHeaders({
    //   'Content-Type': 'text/plain', 
    // });

    // this.http.post(sendPostUrl, formData,{ responseType: 'text' }).subscribe(
    //   (response) => {
    //     this.getAllPosts();
    //     console.log('POST request successful:', response);
    //   },
    //   (error) => {
    //     console.error('POST request error:', error);
    //   }
    // );
    }

}
}
