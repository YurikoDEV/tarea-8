import { Component, OnInit } from '@angular/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { RecordingData, VoiceRecorder } from 'capacitor-voice-recorder';
import { DatabaseService } from 'src/app/database.service';

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
  //VARIABLES DEL FORMULARIO
  title: string = '';
  date: string = '';
  description: string = '';
  location: string = '';
  audio: string = '';
  img: string = '';

  //ESTA EDITANDO UN EVENTO
  isEditing = false;

  constructor(public database: DatabaseService) { }

  ngOnInit() {
    //PEDIR EL PERMISO DE GRABAR AUDIO
    VoiceRecorder.requestAudioRecordingPermission();

  }

 async  loadFiles(){
  Filesystem.readdir({
      path: '',
      directory: Directory.Data

    }).then(result => {
      console.log(result);
    })

  }

  //EMPEZAR LA GRABACION DEL AUDIO
  startRecording(){

    if(this.recording){
      return;
    }
    this.recordingDuration = 0;
    this.intervalId = setInterval(() => {
      this.recordingDuration++;
    }, 1000);
    this.recording = true;
    VoiceRecorder.startRecording();

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
          const recordData = result.value.recordDataBase64;
          console.log('Datos de grabación:', recordData);
        } else {
          console.error('No se obtuvieron datos de grabación válidos');
        }
      })
      .catch(error => {
        console.error('Error al detener la grabación de audio:', error);
      });
  }

  //ENVIAR DATOS A LA DB -AGREGAR EVENTO
  async adds(){

    if(this.title == '' || this.date == '' || this.description ==''){
      return alert("Debe completar los datos del formulario");
    }   
    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');;
    this.database.addEvents(this.title, this.description, created_at, this.location)
    .then(data=>{
      this.clearInputs();
    }).catch(e=>{
      console.log('error'+e)
    })

  }

  async add() {
    if (this.title == '' || this.date == '' || this.description == '') {
        return alert("Debe completar los datos del formulario");
    }

    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

    try {
        const eventId = await this.database.addEvents(this.title, this.description, created_at, this.location);

        // Ahora que tenemos el ID del evento, podemos llamar a la función para guardar el audio
        this.saveAudio(eventId);

        this.clearInputs();
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
  }

  //GUARDAR AUDIO
  async saveAudio(eventId:number=0){
    const fileName = eventId + '.wav';
    await Filesystem.writeFile({
      path: `assets/media/audio/${fileName}`,
      directory: Directory.Data,
      data: this.recordData
    });
  }

}
