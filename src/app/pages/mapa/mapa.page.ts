import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
declare var mapboxgl: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit, AfterViewInit {

  lat: number = 0;
  lng: number =0;

  geo2: any;

  constructor(private activatedRouter: ActivatedRoute) { }

  ngOnInit() {
    let geo: any = this.activatedRouter.snapshot.paramMap.get('geo');
    geo = geo?.substring(4);

    geo = geo.split(',');
    console.log( geo );
     this.lat=Number(geo[0]);
     this.lng=Number(geo[1]);
    console.log(this.lat, this.lng)

  }
  ngAfterViewInit(){
    mapboxgl.accessToken = 'pk.eyJ1IjoiYnJ1bm9hdXJpY2gxOSIsImEiOiJjbGM3NHVxNzUwa3Z3M3VwazVhdHd1NDV2In0.hwggXPEIHXi2FmhDfPuEcQ';


   const map = new mapboxgl.Map({
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/light-v11',
    center: [this.lng, this.lat],
    zoom: 15.5,
    pitch: 45,
    bearing: -17.6,
    container: 'map',
    antialias: true
    });

    map.on('style.load', () => {

      map.resize();

      // Create a new marker.
      const marker = new mapboxgl.Marker()
      .setLngLat([this.lng, this.lat])
      .addTo(map);

      // Insert the layer beneath any symbol layer.
      const layers = map.getStyle().layers;
      const labelLayerId = layers.find(
      (layer: { type: string; layout: { [x: string]: any; }; }) => layer.type === 'symbol' && layer.layout['text-field']
      ).id;

      // The 'building' layer in the Mapbox Streets
      // vector tileset contains building height data
      // from OpenStreetMap.
      map.addLayer(
      {
        'id': 'add-3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
        'fill-extrusion-color': '#aaa',

        // Use an 'interpolate' expression to
        // add a smooth transition effect to
        // the buildings as the user zooms in.
        'fill-extrusion-height':
        [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'height']
        ],
        'fill-extrusion-base':
        [
          'interpolate',
          ['linear'],
          ['zoom'],
          15,
          0,
          15.05,
          ['get', 'min_height']
        ],
        'fill-extrusion-opacity': 0.6
        }
      },
      labelLayerId
      );
      });
  }


}
