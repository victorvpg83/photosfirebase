import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase'
import { FileItem } from '../models/file-item';


@Injectable({
  providedIn: 'root'
})
export class LoadimagesService {

  private IMAGES_FOLDER = 'img'

  constructor( private db: AngularFirestore ) {}

  loadImagesFirebase( images: FileItem[] ) {
    const storageRef = firebase.storage().ref()

    for ( const item of images ) {

      item.isLoading = true
      if ( item.progress >= 100 ) {
        continue
      }

      const uploadTask: firebase.storage.UploadTask =
        storageRef.child(`${ this.IMAGES_FOLDER }/${ item.fileName }`)
          .put( item.file )

      uploadTask.on( firebase.storage.TaskEvent.STATE_CHANGED,
        ( snapshot: firebase.storage.UploadTaskSnapshot ) => item.progress = ( snapshot.bytesTransferred / snapshot.totalBytes ) * 100,
        ( error ) => console.error('Error al subir archivo', error),
        () => {
          console.log('imagen cargada correctamente')
          uploadTask.snapshot.ref.getDownloadURL()
          .then((url) => {
            item.url = url;
            item.isLoading = false;
            this.saveImage({
              name: item.fileName,
              url: item.url,
            });
          });
        })

    }

  }

  private saveImage( image: { name: string, url: string } ) {
    this.db.collection(`/${ this.IMAGES_FOLDER }`)
      .add( image )
  }

}
