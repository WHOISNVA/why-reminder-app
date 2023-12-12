import { Component, OnInit } from '@angular/core';
import { Output, EventEmitter  } from '@angular/core';
@Component({
  selector: 'app-userauth',
  templateUrl: './userauth.component.html',
  styleUrls: ['./userauth.component.css']
})
export class UserauthComponent implements OnInit {
  @Output() changeLoginUserInfo: EventEmitter<any> = new EventEmitter();
  nowPage = 'login';

  constructor() { }
  ngOnInit() {
  }

  changeLoginUserStatus(): void {
    this.changeLoginUserInfo.emit();
  }

  changeStatus(): void {
    if(this.nowPage === 'login')
      this.nowPage = 'register';
    else if(this.nowPage === 'register')
      this.nowPage = 'login';
  }
}