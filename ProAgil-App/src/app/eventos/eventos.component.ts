import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventoService } from '../_services/evento.service';
import { Evento } from '../_models/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { defineLocale} from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  eventosFiltrados: Evento[];
  eventos: Evento[];
  evento: Evento;
  imgLargura = 50;
  imgMargem = 2;
  mostrarImagem = false;
  _filtroLista: string;
  _fLocal: string;
  formulario: FormGroup;

  constructor(
      private eventoService: EventoService,
      private modalService: BsModalService,
      private fb: FormBuilder,
      private localeService: BsLocaleService
    ) {
      this.localeService.use('pt-br');
    }

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

  openModal(template: any){
      this.formulario.reset();
      template.show();
  }

  ngOnInit() {
    this.getEventos();
    this.validation();
  }

  alternarImagem(){
    this.mostrarImagem = !this.mostrarImagem;
  }

  validation(){
    this.formulario = this.fb.group({
       tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
       local: ['', Validators.required],
       dataEvento: ['', Validators.required],
       qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
       imagemURL: ['', Validators.required],
       telefone: ['', Validators.required],
       email: ['', [Validators.required, Validators.email]]
    });
  }
  salvarAlteracao(template: any){
     if (this.formulario.valid){
       this.evento = Object.assign({}, this.formulario.value);
       this.eventoService.postEvento(this.evento).subscribe(
          (novoEvento: Evento) => {
            console.log(novoEvento);
            template.hide();
            this.getEventos();
          }, error => {
            console.log(error);
          }
       );
     }
  }
  getEventos(){
    this.eventoService.getAllEvento().subscribe(
      (_eventos: Evento[]) => {
      this.eventos = _eventos;
      this.eventosFiltrados = this.eventos;
      console.log(this.eventos);
    }, error => {
      console.log(error);
    });
  }

}
