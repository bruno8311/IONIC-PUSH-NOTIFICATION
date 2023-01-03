import { Registro } from './../models/registro.model';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { File as ionFile } from '@awesome-cordova-plugins/file/ngx';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { OneSignal } from '@awesome-cordova-plugins/onesignal/ngx';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  guardados: Registro []=[];
  data: any='';

  constructor(
    private _storage: Storage,
    private navCtrl: NavController,
    private inappbrowser: InAppBrowser,
    private emailcomponser: EmailComposer,
    private file: ionFile,
    private oneSignal: OneSignal) {
    this.initStorage()
    this.cargarStorage()
   }

   async initStorage() {
    await this._storage.create();
  }

   async cargarStorage(){
      this.guardados = await this._storage.get('registros') || []
    }

   async borrarStorage(data: any){
      await this._storage.remove(data);
   }

    async guardarRegistro(format: string, text: string){
      await this.cargarStorage();
      const nuevoRegistro = new Registro(format,text);
      this.guardados.unshift(nuevoRegistro);
      this._storage.set('registros',this.guardados)

      this.abrirRegistro(nuevoRegistro)
    }

    abrirRegistro(registro: Registro){
      this.navCtrl.navigateForward('/tabs/tab2');
      switch(registro.type){
        case 'http': this.inappbrowser.create(registro.text,'_system');
                      break;
         case 'geo': this.navCtrl.navigateForward(`/tabs/tab2/mapa/${registro.text}`);
                     break;
      }
    }

    enviarCorreo(){
      const arrtemp = []
      const titulos ='Tipo, Formato, Creado en, Texto, Icono\n'
      arrtemp.push(titulos);
      this.guardados.forEach(registros =>{
        const linea = `${registros.type}, ${registros.format}, ${registros.created}, ${registros.text.replace(',','')}, ${registros.icon}\n`;
        console.log('Esto hay en la line ', linea)
        arrtemp.push(linea)
      })
      this.creararchivoFisico(arrtemp.join(''))
    }

    creararchivoFisico(text: string){
      this.file.checkFile(this.file.dataDirectory, 'registros.csv').then(existe =>{
        console.log('Existe archivo?', existe);
        return this.escribirEnArchivo(text)
      }).catch(err=>{
        return this.file.createFile(this.file.dataDirectory, 'registros.csv',false)
        .then(creado => { this.escribirEnArchivo(text)}).catch(err2=>{
          console.log('No se pudo crear el archivo')
        })
      })
    }

  async  escribirEnArchivo(text: string){
      await this.file.writeExistingFile(this.file.dataDirectory, 'registros.csv',text);
      console.log('Archivo creado')

      const archivo = `${this.file.dataDirectory}registros.csv`;

      let email = {
        to: 'brunoaurich15@gmail.com',
        attachments: [ //Lo que quieres enviar
          archivo
        ],
        subject: 'Backup Scans',
        body: 'Aqui tiene sus nakcups de los <strong>Scans</strong>',
        isHtml: true
      };

      this.emailcomponser.open(email)

    };

    enviarNotificacion(){
      this.oneSignal.startInit('b2f7f966-d8cc-11e4-bed1-df8f05be55ba', '703322744261');

      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

      this.oneSignal.handleNotificationReceived().subscribe(() => {
      // do something when notification is received
      });

      this.oneSignal.handleNotificationOpened().subscribe(() => {
        // do something when a notification is opened
      });

      this.oneSignal.endInit();
    }
}
