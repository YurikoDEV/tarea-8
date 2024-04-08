import { Injectable } from '@angular/core';
import { SQLite , SQLiteObject} from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  sqliteObj! : SQLiteObject

  constructor(private sqlite: SQLite) { 
  }

  //CREAR BASE DE DATOS -si no existe registros
  async createDatabase() {
    await this.sqlite.create({
      name:'registros',
      location:'default',
    }).then((db:SQLiteObject)=>{
      this.sqliteObj = db;
    }).catch((e)=>{

      alert('Error al crear la base de datos');

    });
    await this.createTableEvents();
}

  async createTableEvents() {
    await this.sqliteObj.executeSql(`
      CREATE TABLE IF NOT EXISTS cases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        descripcion TEXT,
        created_at DATETIME,
        date DATETIME,
        location TEXT
      )
    `);
  }

  //AGREAGAR UN CASO  
  async addEvents(title: string, description: string, created_at: string, location: string, date: string){
    try{
      const result = await this.sqliteObj.executeSql(`
        INSERT INTO cases (titulo, descripcion, created_at, location, date) 
        VALUES (?, ?, ?,?,?)
      `, [title, description, created_at, location, date]);
      console.log('Datos ingresados correctamente');
      const generatedId = result.insertId;
      console.log(generatedId);
      return generatedId;

    }catch(e){
      console.log('Error al ingresar los datos:', e);
    }
  }

  //LISTA DE CASOS  
  async getEvents(){
    try{
      const query = await this.sqliteObj.executeSql(`
       SELECT * FROM cases;
      `,[]);

      const events = [];
      for (let i = 0; i < query.rows.length; i++) {
        const event = query.rows.item(i);
        events.push(event);
      }

      console.log('Datos obtenidos correctamente');

      return events;
    }catch(e){
      console.log('Error al obteners los datos> ' + e);
      return [];
    }
  }

  //Eliminar un caso
  async deleteEvent(id: number) {
    try {
      const query = `
        DELETE FROM cases
        WHERE id = ?
      `;
      const queryParams = [id];
  
      await this.sqliteObj.executeSql(query, queryParams);
      
      console.log('Evento eliminado correctamente');
      return true;
    } catch (error) {
      console.error('Error al eliminar el evento:', error);
      return false;
    }
  }

  //Eliminar tabla
  async deleteTable() {
    try {
      const query = `DROP TABLE IF EXISTS cases`;
  
      await this.sqliteObj.executeSql(query, []);
      
      console.log('Tabla eliminada correctamente');
      return true;
    } catch (error) {
      console.error('Error al eliminar la tabla:', error);
      return false;
    }
  }

  //OBTENER DETALLDE DE UN CASO
  async getCaseById(id: number) {
    try {
      const query = `
        SELECT * 
        FROM cases
        WHERE id = ?
      `;
      const queryParams = [id];
  
      const result = await this.sqliteObj.executeSql(query, queryParams);
      
      if (result.rows.length > 0) {
        const event = result.rows.item(0);
        console.log('Caso obtenido correctamente:', event);
        return event;
      } else {
        console.log('No se encontró ningún caso con el ID:', id);
        return null;
      }
    } catch (error) {
      console.error('Error al obtener el caso por ID:', error);
      return null;
    }
  }
  
}