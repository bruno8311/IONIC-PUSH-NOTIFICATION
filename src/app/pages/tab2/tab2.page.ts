import { ActionSheetController, NavController } from '@ionic/angular';
import { DataLocalService } from './../../services/data-local.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(public dataLocal: DataLocalService, private actionSheetCtrl: ActionSheetController) {}
  result!: string;


  enviarCorreo(){
    console.log('Enviar correo')
    this.dataLocal.enviarCorreo();

    this.dataLocal.enviarNotificacion();

  }

  abrirregistro(registro: any){
    console.log('Registro',registro)
    this.dataLocal.abrirRegistro(registro)
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.dataLocal.cargarStorage();
      event.target.complete();
    }, 500);
  };

  async eliminarAlmacenamiento(){
   await  this.dataLocal.borrarStorage('registros');
    setTimeout(() => {
      this.dataLocal.cargarStorage();
    }, 2500);
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: '¿Seguro que deseas eliminar?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Eliminar',
          role: 'destructive',
          icon: 'trash',
          handler: ()=>{
           this.eliminarAlmacenamiento();
         }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          icon: 'close-outline',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    await actionSheet.present();
  }

}
