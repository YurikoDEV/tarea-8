import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/database.service';
import { ActivatedRoute } from '@angular/router';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  eventId!: string;
  event: any;
  fileNameAudio!: string;
  fileNameImage!: string;

  imgUrl: string = '';
  audioUrl: string = '';

  constructor(public database: DatabaseService, public route: ActivatedRoute, public router: Router) { }

  ngOnInit() {
    this.getEventFromRoute();
    this.loadFiles();
  }

  getEventFromRoute() {
    this.route.params.subscribe(params => {
      if (params['event']) {
        this.event = JSON.parse(params['event']);
      }
    });
  }

  async loadFiles(){
    Filesystem.readdir({
      path: '',
      directory: Directory.Data
    }).then(result => {
      console.log('result.files',result.files);

    const file = result.files.find(file => {
      return file.name === this.event.id + '.mp3';
    });

    if (file) {
      console.log('Archivo encontrado:', file);
      this.audioUrl = file.uri;
      this.fileNameAudio = file.name;
    } else {
      console.log('No se encontró ningún archivo con el nombre:', this.event.id + '.mp3');
    }

    const imageFile = result.files.find(file => {
      return file.name.startsWith(this.event.id.toString()) && (file.name.endsWith('.jpg') || file.name.endsWith('.png'));
    });

    if (imageFile) {
      console.log('Image file found:', imageFile);
      this.imgUrl = imageFile.uri;
      this.fileNameImage = imageFile.name;
    } else {
      console.log('No image file found for event ID:', this.event.id);
    }

    });
  }

  async playFile(){
    const audioFile = await Filesystem.readFile({
      path: this.fileNameAudio,
      directory: Directory.Data
    });

    const base64Sound = audioFile.data;
    const audioRef = new Audio(`data:audio/aac;base64,${base64Sound}`)
    audioRef.oncanplaythrough = () => audioRef.play();

    audioRef.load();
  }

  back(){
    this.router.navigate(['./tabs/tabs/list']); 
  }
  
}
