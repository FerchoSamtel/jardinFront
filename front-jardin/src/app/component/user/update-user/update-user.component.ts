import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { Subscription, of } from 'rxjs';
import { catchError, last, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {

  titleEdit: string;
  hiden = true;
  selected = 'activo';
  // tslint:disable-next-line: no-input-rename
  @Input('modalRef') modalRef;

  // ESTADO DE LAS VARIABLES EN EL FORMYULARIO PARA REALIZAR VALIDACIONES
  profileForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    documentType: new FormControl('', [Validators.required]),
    documentNumber: new FormControl('', [Validators.required]),
    birthDate: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(10)]),
    celular: new FormControl('', [Validators.required, Validators.minLength(10)]),
    roleId: new FormControl('', [Validators.required])
  });

  @Input() target = 'https://file.io';
  @Input() accept = 'image/*';
  @Input() ddarea = false;
  // tslint:disable-next-line: no-output-native
  @Output() complete = new EventEmitter<string>();

  files: Array<FileUploadModel> = [];
  // tslint:disable-next-line: variable-name
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.titleEdit = 'Editar Usuario';
  }

  // UPLOAD
  onClick() {
    const fileUpload = document.getElementById(
      'fileUpload'
    ) as HTMLInputElement;
    fileUpload.onchange = () => {
      // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        this.files.push({
          data: file,
          state: 'in',
          inProgress: false,
          progress: 0,
          canRetry: false,
          canCancel: true
        });
      }
      this.uploadFiles();
    };
    fileUpload.click();
  }

  cancelFile(file: FileUploadModel) {
    if (file) {
      if (file.sub) {
        file.sub.unsubscribe();
      }
      this.removeFileFromArray(file);
    }
  }
  retryFile(file: FileUploadModel) {
    this.uploadFile(file);
    file.canRetry = false;
  }
  private uploadFile(file: FileUploadModel) {
    const fd = new FormData();
    const req = new HttpRequest('POST', this.target, fd, {
      reportProgress: true
    });
    file.inProgress = true;
    file.sub = this.http
      .request(req)
      .pipe(
        map(event => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              file.progress = Math.round((event.loaded * 100) / event.total);
              break;
            case HttpEventType.Response:
              return event;
          }
        }),
        tap(message => { }),
        last(),
        catchError((error: HttpErrorResponse) => {
          file.inProgress = false;
          file.canRetry = true;
          return of(`${file.data.name} upload failed.`);
        })
      )
      .subscribe((event: any) => {
        if (typeof event === 'object') {
          this.removeFileFromArray(file);
          this.complete.emit(event.body);
        }
      });
  }
  private uploadFiles() {
    const fileUpload = document.getElementById(
      'fileUpload'
    ) as HTMLInputElement;
    fileUpload.value = '';
    this.files.forEach(file => {
      if (!file.inProgress) {
        this.uploadFile(file);
      }
    });
  }
  private removeFileFromArray(file: FileUploadModel) {
    const index = this.files.indexOf(file);
    if (index > -1) {
      this.files.splice(index, 1);
    }
  }
  dropHandler(ev: DragEvent) {
    ev.preventDefault();
    if (ev.dataTransfer.items) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < ev.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (ev.dataTransfer.items[i].kind === 'file') {
          const file = ev.dataTransfer.items[i].getAsFile();
          this.files.push({
            data: file,
            state: 'in',
            inProgress: false,
            progress: 0,
            canRetry: false,
            canCancel: true
          });
        }
      }
    } else {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < ev.dataTransfer.files.length; i++) {
        this.files.push({
          data: ev.dataTransfer.files[i],
          state: 'in',
          inProgress: false,
          progress: 0,
          canRetry: false,
          canCancel: true
        });
      }
    }
    this.uploadFiles();
  }

  dragOverHandler(ev: DragEvent) {
    ev.preventDefault();
  }
}
export class FileUploadModel {
  data: File;
  state: string;
  inProgress: boolean;
  progress: number;
  canRetry: boolean;
  canCancel: boolean;
  sub?: Subscription;
}
