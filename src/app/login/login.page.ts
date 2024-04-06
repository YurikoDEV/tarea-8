import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  user: string = '';
  password: string = '';

  constructor(private route: Router) { }

  ngOnInit() {
  }

  login(){

  }

  register(){
    this.route.navigate(['/register']);

  }
}
