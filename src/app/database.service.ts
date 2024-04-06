import { Injectable } from '@angular/core';
import { SQLite , SQLiteObject} from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  sqliteObj! : SQLiteObject

  constructor(private sqlite: SQLite) { 
  }

  async createDatabase(){
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
    try {
      await this.sqliteObj.executeSql(`
        CREATE TABLE IF NOT EXISTS eventos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          titulo TEXT NOT NULL,
          descripcion TEXT,
          img TEXT,
          created_at DATETIME,
          updated_at DATETIME,
          location TEXT,
          audio TEXT
        )
      `);
      console.log('Tabla de eventos creada correctamente');
    } catch (error) {
      console.error('Error al crear la tabla de eventos:', error);
    }
  }
  

  async createTableUsers(){
    await this.sqliteObj.executeSql(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      matricula TEXT,
      correo TEXT,
      created_at datetime,
      location TEXT,
      partido TEXT NOT NULL,
    )

    `)
  }

  async addEvents(title: string, description: string, created_at: string, location: string): Promise<number> {
    try {
        const result = await this.sqliteObj.executeSql(`
            INSERT INTO eventos (title, description, created_at, location) 
            VALUES (?,?,?,?)
        `, [title, description, created_at, location]);

        console.log('Datos ingresados correctamente');

        // Obtener el ID generado por la inserción
        const generatedId = result.insertId;

        return generatedId;
    } catch (e) {
        console.log('Error al ingresar los datos> ' + e);
        throw e; // Re-lanzar el error para que sea manejado fuera de esta función si es necesario
    }
}


  async addUser(username:string, password:string, matricula:string, correo:string, created_at:string, location:string, partido:string){
    try{
      await this.sqliteObj.executeSql(`
        INSERT INTO eventos (username, password, matricula, correo, created_at, location,partido) 
        VALUES (?,?,?,?,?,?,?)
      `,[username, password, matricula, correo, created_at, location,partido]);
      console.log('Usuario registrado correctamente');
    }catch(e){
      console.log('Error al ingresar los datos> ' + e);
    }
  }

  async getEvents(){
    try{
      const query = await this.sqliteObj.executeSql(`
       SELECT * FROM eventos;
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

  async loginUser(username: string, password: string) {
    try {

      const query = `
        SELECT * FROM users 
        WHERE username = ? AND password = SHA1(?)
      `;
      const queryParams = [username, password];

      const result = await this.sqliteObj.executeSql(query, queryParams);

      if (result.rows.length > 0) {
        // Usuario autenticado correctamente
        const user = result.rows.item(0);
        
        // Guardar los datos del usuario en el localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));

        console.log('Usuario autenticado correctamente');
        return user;
      } else {
        // Usuario no encontrado o contraseña incorrecta
        console.log('Usuario no encontrado o contraseña incorrecta');
        return null;
      }
    } catch (error) {
      console.error('Error al autenticar usuario:', error);
      return null;
    }
  }

  async editEvent(id: number, title: string, description: string, created_at: string, location: string, img: string, audio: string) {
    try {

      const query = `
        UPDATE eventos 
        SET title = ?, description = ?, created_at = ?, location = ?, img = ?, audio = ?
        WHERE id = ?
      `;
      const queryParams = [title, description, created_at, location, img, audio, id];

      await this.sqliteObj.executeSql(query, queryParams);
      
      console.log('Evento editado correctamente');
      return true;
    } catch (error) {
      console.error('Error al editar el evento:', error);
      return false;
    }
  }

}