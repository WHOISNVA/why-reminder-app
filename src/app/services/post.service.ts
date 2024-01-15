import { Injectable } from '@angular/core';
import { Post } from '../models/post';
//import { Post } from './models/Post'; 

@Injectable({
    providedIn: 'root'
})
export class PostService {
    private posts: Post[] = []; // Mock data storage for posts.

    constructor() {}

    // Add a post
    addPost(post: Post): void {
        this.posts.push(post);
    }

    // Get all posts
    getPosts(): Post[] {
        return [...this.posts];
    }

    // Find post by title
    getPostByTitle(title: string): Post | undefined {
        return this.posts.find(post => post.title === title);
    }

    // Update post details by title
    updatePost(title: string, updatedPost: Post): void {
        const index = this.posts.findIndex(post => post.title === title);
        if (index !== -1) {
            this.posts[index] = updatedPost;
        }
    }

    // Delete post by title
    deletePost(title: string): void {
        this.posts = this.posts.filter(post => post.title !== title);
    }

    // Get post by location
    getPostByLocation(x: number, y: number): Post | undefined {
        return this.posts.find(post => post.x === x && post.y === y);
    }
}
