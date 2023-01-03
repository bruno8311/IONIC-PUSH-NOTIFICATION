import { DataLocalService } from './../../services/data-local.service';
import { Component } from '@angular/core';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

constructor(private barcodeScanner: BarcodeScanner,
            private dataLocal: DataLocalService){
}

swiperOptions = {
  allowSlidePrev: false,
  allowSlideNext: false,
}



  scan(){
    console.log('Holi',)
    this.barcodeScanner.scan().then(barcodeData => {
      if(!barcodeData.cancelled){
        this.dataLocal.guardarRegistro(barcodeData.format, barcodeData.text)
      }
     }).catch(err => {
         console.log('Error', err);
         // this.dataLocal.guardarRegistro('QRCOde', 'https://www.netflix.com/browse');
         this.dataLocal.guardarRegistro('QRCOde', 'geo:-12.148788274991958,-77.02108030611946?q=-12.148788274991958,-77.02108030611946');

     });
  }
}
