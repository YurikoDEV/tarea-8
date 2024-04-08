import { Component, OnInit } from '@angular/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { RecordingData, VoiceRecorder } from 'capacitor-voice-recorder';
import { DatabaseService } from 'src/app/database.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {

  recording = false;
  storedFileNames = [];
  recordingDuration = 0;
  intervalId: any;
  recordData: string = '';
  selectedImage: any;

  //VARIABLES DEL FORMULARIO
  title: string = '';
  date: string = '';
  description: string = '';
  location: string = '';
  audio: string = '';
  img: string = '';

  //ESTA EDITANDO UN EVENTO
  isEditing = false;

  constructor(public database: DatabaseService, public alertController: AlertController, public route: Router) { }

  ngOnInit() {
    // Formatear la fecha como YYYY-MM-DD
    const currentDate = new Date();
    this.date = currentDate.toISOString().slice(0, 10);

    //PEDIR EL PERMISO DE GRABAR AUDIO
    VoiceRecorder.requestAudioRecordingPermission();

  }

  async  loadFiles(){
    Filesystem.readdir({
      path: '',
      directory: Directory.Data
    }).then(result => {
      console.log('result',result);
      console.log('result.files',result.files);
    });
  }

  //EMPEZAR LA GRABACION DEL AUDIO
  async startRecording(){

    // RETORNAR SI ESTA GRABANDO
    if(this.recording){
      return;
    }

    //VALIDAR QUE NO HAYAN GRABACIONES EN COLA
    if (!this.recordData) {
      this.recordingDuration = 0;
      this.intervalId = setInterval(() => {
        this.recordingDuration++;
      }, 1000);
      this.recording = true;
      VoiceRecorder.startRecording();
    } else {
      this.alertRecording();
    }

  }

  async alertRecording(){
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Desea iniciar una nueva grabación? La grabación actual será eliminada.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.recordingDuration = 0;
            this.recordData = '';
            this.intervalId = setInterval(() => {
              this.recordingDuration++;
            }, 1000);
            this.recording = true;
            VoiceRecorder.startRecording();
          }
        }
      ]
    });

    await alert.present();
  }

  //DETENER LA GRABACION DEL AUDIO
  stopRecording(){
    if(!this.recording){
      return;
    }
    this.recording = false;
    clearInterval(this.intervalId);

    VoiceRecorder.stopRecording()
      .then(async (result: RecordingData) => {
        if (result && result.value && result.value.recordDataBase64) {
          this.recordData = result.value.recordDataBase64;
          console.log('Datos de grabación:', this.recordData);
        } else {
          console.error('No se obtuvieron datos de grabación válidos');
        }
      })
      .catch(error => {
        console.error('Error al detener la grabación de audio:', error);
      });
  }

  //ENVIAR DATOS A LA DB -AGREGAR EVENTO
  async add() {
    if (this.title == '' || this.date == '' || this.description == '') {
        return alert("Debe completar los datos del formulario");
    }

    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

    try {
        const eventId = await this.database.addEvents(this.title, this.description, created_at, this.location, this.date);

        // Ahora que tenemos el ID del evento, podemos llamar a la función para guardar el audio y la imagen
        if(this.recordData){
          this.saveAudio(eventId);
        }
        if(this.selectedImage){
          this.saveImg(eventId);
        }

        const event = await this.database.getCaseById(eventId);
        console.log(event);

        this.clearInputs();
        this.route.navigate(['/tabs/tabs/detail', { event: JSON.stringify(event) }]);
    } catch (e) {
      console.log('Error al agregar evento: ' + e);
    }
  }

  //LIMPIAR LOS CAMPOS DEL FORMULARIO
  clearInputs(){
    this.title = '';
    this.date = '';
    this.description = '';
    this.location = '';
    this.audio = '';
    this.img = '';
    this.recordData = '';
    this.recordingDuration = 0;
  }

  //GUARDAR AUDIO
  async saveAudio(eventId:number=0){
    const fileName = eventId + '.mp3';
    await Filesystem.writeFile({
      path: fileName,
      directory: Directory.Data,
      data: this.recordData
    });
    console.log('fileName',fileName);
  }
  //GUARDAR AUDIO
  async saveImg(eventId:number=0){
    const fileName = eventId + '.jpg';
    await Filesystem.writeFile({
      path: fileName,
      directory: Directory.Data,
      data: this.recordData
    });

    console.log('fileName',fileName);
  }

  
}
