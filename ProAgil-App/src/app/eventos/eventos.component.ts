import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventoService } from '../_services/evento.service';
import { Evento } from '../_models/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  eventosFiltrados: Evento[];
  eventos: Evento[];
  imgLargura = 50;
  imgMargem = 2;
  mostrarImagem = false;
  _filtroLista: string;
  _fLocal: string;
  modalRef: BsModalRef;

  constructor(
      private eventoService: EventoService,
      private modalService: BsModalService
    ) { }

  get flocal(): string{
    return this._fLocal;
  }
  set flocal(value: string){
    this._fLocal = value;
    this.eventosFiltrados = this.flocal ? this.filtrareventosLocal(this.flocal) : this.eventos;
  }
  filtrareventosLocal(filtrarPor: string): Evento[]{
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1 || evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }
  get filtroLista(): string{
    return this._filtroLista;
  }
  set filtroLista(value: string){
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }
  filtrarEventos(filtrarPor: string): Evento[]{
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  openModal(template: TemplateRef <any>){
      this.modalRef = this.modalService.show(template);
  }

  ngOnInit() {
    this.getEventos();
  }

  alternarImagem(){
    this.mostrarImagem = !this.mostrarImagem;
  }

  getEventos(){
    this.eventoService.getAllEvento().subscribe(
      (_eventos: Evento[]) => {
      this.eventos = _eventos;
      this.eventosFiltrados = _eventos;
      console.log(this.eventos);
    }, error => {
      console.log(error);
    });
  }

}
