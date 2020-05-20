import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  eventosFiltrados: any = [];
  eventos: any = [];
  imgLargura = 50;
  imgMargem = 2;
  mostrarImagem = false;
  _filtroLista: string;
  _fLocal: string;
  get flocal(): string{
    return this._fLocal;
  }
  set flocal(value: string){
    this._fLocal = value;
    this.eventosFiltrados = this.flocal ? this.filtrareventosLocal(this.flocal) : this.eventos;
  }
  filtrareventosLocal(filtrarPor: string): any{
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
  filtrarEventos(filtrarPor: string): any{
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getEventos();
  }

  alternarImagem(){
    this.mostrarImagem = !this.mostrarImagem;
  }

  getEventos(){
    this.http.get('http://localhost:5000/api/values').subscribe(Response => {
      this.eventos = Response;
      console.log(this.eventos);
    }, error => {
      console.log(error);
    });
  }

}
