import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  partidoSeleccionado!: string;

  constructor(private themeService: ThemeService, public route: Router) { }

  ngOnInit() {
  }

  cambiarTema() {
    this.themeService.setTheme(this.partidoSeleccionado);
  }

  registrarse() {
    this.route.navigate(['./tabs/tabs/home']);
  }

}
