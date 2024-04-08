import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  eventos:any;

  constructor(public database: DatabaseService, public router: Router) { 
    this.getCases();
  }

  ngOnInit() {
    
  }
  
  async getCases(){
    try {
      const events = await this.database.getEvents();
      this.eventos = events;
      console.log(this.eventos);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }

  viewEventDetails(event: any) {
    // const event = await this.database.getCaseById(eventId);
    this.router.navigate(['/tabs/tabs/detail', { event: JSON.stringify(event) }]);
  }

  async deleteEvent(eventId:string){
    if(await this.database.deleteEvent(parseInt(eventId))){
      this.getCases();
    }
  }

  async deleteEvents(){
    if(await this.database.deleteTable()){
      this.getCases();
    }
  }
}
