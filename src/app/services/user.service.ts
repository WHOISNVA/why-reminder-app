import { Injectable } from '@angular/core';
import { User } from './user.model';  // Update path as needed

@Injectable({
    providedIn: 'root'
})

export class UserService {
    private users: User[] = []; // Mock data storage for users.

    constructor() {}

    // Add user to the list
    addUser(user: User): void {
        this.users.push(user);
    }

    // Get all users
    getUsers(): User[] {
        return [...this.users];  // Using spread to return a new array (avoid direct modification)
    }

    // Find user by username
    getUserByUsername(username: string): User | undefined {
        return this.users.find(user => user.username === username);
    }

    // Update user details by username
    updateUser(username: string, updatedUser: User): void {
        const index = this.users.findIndex(user => user.username === username);
        if (index !== -1) {
            this.users[index] = updatedUser;
        }
    }

    // Delete user by username
    deleteUser(username: string): void {
        this.users = this.users.filter(user => user.username !== username);
    }
}
