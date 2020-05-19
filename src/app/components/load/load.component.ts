import { Component, OnInit } from '@angular/core';
import { FileItem } from '../../models/file-item';
import { LoadimagesService } from '../../services/loadimages.service';

@Component({
  selector: 'app-load',
  templateUrl: './load.component.html',
  styles: []
})
export class LoadComponent implements OnInit {

  overDrop = false
  files: FileItem[] = []

  constructor( public loadImagesService: LoadimagesService ) { }

  ngOnInit(): void {
  }

  loadImages(  ) {
    this.loadImagesService.loadImagesFirebase( this.files )
  }

  clearFiles() {
    this.files = []
  }

}
