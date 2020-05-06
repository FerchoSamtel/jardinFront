import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import * as classie from 'classie';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  private nivel1: Element = null;
    private nivel2: Element = null;
    admin = '0';

    constructor(private router: Router) {
    }
    ngOnInit(): void {
    }

    public menuPrincipal(siguiente: string) {
        classie.toggle(document.getElementById(siguiente), 'cbp-spmenu-open');
    }

    public menu(origen: string, siguiente: string, nivel: string) {
        const el = document.getElementById(origen);
        if (classie.has(el, 'cbp-spmenu-active')) {
            switch (nivel) {
                case '1':
                    this.removerClase('cbp-spmenu-open_lv2');
                    this.removerClase('cbp-spmenu-open_lv1');
                    if (this.nivel2 !== null) {
                        classie.remove(this.nivel2, 'cbp-spmenu-active');
                        this.nivel2 = null;
                    }
                    classie.remove(this.nivel1, 'cbp-spmenu-active');
                    this.nivel1 = null;
                    break;
                case '2':
                    this.removerClase('cbp-spmenu-open_lv2');
                    classie.remove(this.nivel2, 'cbp-spmenu-active');
                    this.nivel2 = null;
                    break;
            }
        } else {
            switch (nivel) {
                case '1':
                    if (this.nivel1 != null) {
                        this.removerClase('cbp-spmenu-open_lv2');
                        this.removerClase('cbp-spmenu-open_lv1');
                        classie.remove(this.nivel1, 'cbp-spmenu-active');
                    }
                    if (this.nivel2 != null) {
                        classie.remove(this.nivel2, 'cbp-spmenu-active');
                        this.nivel2 = null;
                    }
                    this.nivel1 = el;
                    break;
                case '2':
                    if (this.nivel2 != null) {
                        this.removerClase('cbp-spmenu-open_lv2');
                        classie.remove(this.nivel2, 'cbp-spmenu-active');
                    }
                    this.nivel2 = el;
                    break;
            }
            classie.add(el, 'cbp-spmenu-active');
            classie.add(document.getElementById(siguiente), 'cbp-spmenu-open_lv' + nivel);
        }
    }

    public cerrarMenu2() {
      this.nivel1 = null;
      this.nivel2 = null;
      this.removerClaseTag('a', 'cbp-spmenu-active');
      this.removerClase('cbp-spmenu-open_lv2');
      this.removerClase('cbp-spmenu-open_lv1');
      this.removerClase('cbp-spmenu-open');
  }
    public cerrarMenu() {
        this.nivel1 = null;
        this.nivel2 = null;
        this.removerClaseTag('a', 'cbp-spmenu-active');
        this.removerClase('cbp-spmenu-open_lv2');
        this.removerClase('cbp-spmenu-open_lv1');
        this.removerClase('cbp-spmenu-open');
    }



    private removerClaseTag(tag: string, clase: string) {
        const tags: HTMLCollectionOf<Element> = document.getElementsByTagName('a');
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < tags.length; i++) {
            if (classie.has(tags[i], clase)) {
                classie.remove(tags[i], clase);
            }
        }
    }

    private removerClase(clase: string) {
        const menus: HTMLCollectionOf<Element> = document.getElementsByClassName(clase);
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < menus.length; i++) {
            if (classie.has(menus[i], clase)) {
                classie.remove(menus[i], clase);
            }
        }
    }

}
