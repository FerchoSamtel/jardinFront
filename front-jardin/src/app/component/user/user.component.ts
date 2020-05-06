import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {MatFileUploadComponent} from '@webacad/ng-mat-file-upload';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(private modalService: BsModalService) { }
  title: string;
  titleDelete: string;
  items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  modalRef: BsModalRef;
  padreMandaAHijoMensaje = 'este es el mensaje del padre al hijo';
  ngOnInit(): void {
    this.title = 'Gestionar Usuarios';
    this.titleDelete = 'Eliminar Usuario';
  }

  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }
  openModalWithClassDelete(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
    );
  }

  public onFileChange(fileUpload: MatFileUploadComponent): void
    {
        const files = fileUpload.files;

        if (!files.length) {
            return;
        }

        const stepSize: number = 10;

        this.uploadFile(files[0].file, () => {
            files[0].increaseProgress(stepSize);
        }, () => {
            files[0].progress = 100;
            fileUpload.disabled = true;
        });
    }

    private uploadFile(file: File, onChunk: () => void, onDone: () => void): void
    {
        // todo
    }
}
