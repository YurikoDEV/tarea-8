import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private router: Router, public database:DatabaseService) {
  }

  async ngOnInit() {
    this.database.createDatabase();

  }

  // Función para navegar a la página de registro
  goToRegistro() {
    this.router.navigate(['./tabs/tabs/manage']); 
  }

  // Función para navegar a la página de lista
  goToLista() {
    this.router.navigate(['./tabs/tabs/list']); 
  }


}
