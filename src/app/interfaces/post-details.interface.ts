export interface PostDetails {
    saved: boolean;
    liked: boolean;
    postId: number;
    postImageUrl: string;
    postUploadedByUserName: string;
    postUploadedByUserPhoto: string;
    postText: string;
    allComments: Comment[];
    totalLikes: number;
    totalComments: number;
  }
  
  export interface Comment {
    commentedUserName: string;
    commentedUserPhoto: string;
    comment: string;
    commentId: string;
    commentedUserId: string;
  }