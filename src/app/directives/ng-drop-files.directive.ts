import { FileItem } from '../models/file-item';
import { Directive, EventEmitter, ElementRef,
         HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appNgDropFiles]'
})
export class NgDropFilesDirective {

  @Input() files: FileItem[] = []
  @Output() mouseOver: EventEmitter<boolean> = new EventEmitter()

  constructor() { }

  @HostListener( 'dragover', ['$event'] )
  public onDragEnter( event: any ) {
    this.mouseOver.emit( true )
    this.preventStop( event )
  }
  @HostListener( 'dragleave', ['$event'] )
  public onDragLeave( event: any ) {
    this.mouseOver.emit( false )
  }

  @HostListener( 'drop', ['$event'] )
  public onDrop( event: any ) {

    const transfer = this.getTransference( event )

    if ( !transfer ) { return }

    this.extractFiles( transfer.files )

    this.preventStop( event )
    this.mouseOver.emit( false )

  }

  private getTransference( event: any ) {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer
  }

  private extractFiles( filesList: FileList ) {

    // tslint:disable-next-line: forin
    for ( const property in Object.getOwnPropertyNames( filesList )) {
      const tempFile = filesList[property]
      if ( this.fileCanBeLoad( tempFile ) ) {
        const newFile = new FileItem( tempFile )
        this.files.push( newFile )
      }
    }
  }

  // Validations

  private fileCanBeLoad( file: File ): boolean {
    return ( !this.fileDropped( file.name ) && this.isImage( file.type ) ) ? true : false
  }

  private preventStop( event ) {
    event.preventDefault()
    event.stopPropagation()
  }

  private fileDropped( fileName: string ): boolean {

    for ( const file of this.files ) {
      if ( file.fileName === fileName ) {
        console.log( 'el archivo ' + fileName + ' ya existe' )
        return true
      }
    }

    return false
  }

  private isImage( fileType: string ) {
    return ( fileType === '' || fileType === undefined ) ? false : fileType.startsWith( 'image' )
  }

}
