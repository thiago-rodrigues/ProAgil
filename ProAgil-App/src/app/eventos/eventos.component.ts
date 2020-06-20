import { Component, OnInit, TemplateRef, Output, EventEmitter } from '@angular/core';
import { EventoService } from '../_services/evento.service';
import { Evento } from '../_models/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { defineLocale} from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';


defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {
  titulo = 'Eventos';
  eventosFiltrados: Evento[];
  eventos: Evento[];
  evento: Evento;
  imgLargura = 50;
  imgMargem = 2;
  mostrarImagem = false;
  _filtroLista: string;
  _fLocal: string;
  formulario: FormGroup;
  modoSalvar = 'post';
  bodyDeletarEvento = '';
  @Output() enviaFlocal = new EventEmitter();
  file: File;
  fileNameToUpdate: string;
  dataAtual: string;

  constructor(
      private eventoService: EventoService,
      private modalService: BsModalService,
      private fb: FormBuilder,
      private localeService: BsLocaleService,
      private toastr: ToastrService
    ) {
      this.localeService.use('pt-br');
    }

  get flocal(): string{
    this.enviaFlocal.emit(this._fLocal);
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



  editarEvento(evento: Evento, template: any){
    this.modoSalvar = 'put';
    this.openModal(template);
    this.evento = Object.assign({} , evento);
    this.fileNameToUpdate = evento.imagemURL.toString();
    this.evento.imagemURL = '';
    this.formulario.patchValue(this.evento);
  }

  novoEvento(template: any){
    this.modoSalvar = 'post';
    this.openModal(template);
  }

  excluirEvento(evento: Evento, template: any) {
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Código: ${evento.id}`;
  }

  confirmeDelete(template: any) {
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      () => {
          template.hide();
          this.getEventos();
          this.toastr.success('Deletado com Sucesso!', 'Deletando Evento');
        }, error => {
          console.log(error);
          this.toastr.error(`Erro ao tentar deletar evento! ${error} `, 'Deletando Evento');
        }
    );
  }

  upload(){
      if (this.modoSalvar === 'post'){
        const nomeArquivo = this.evento.imagemURL.split('\\', 3);
        this.evento.imagemURL = nomeArquivo[2];
        this.eventoService.postUpload(this.file, nomeArquivo[2])
        .subscribe(
          () => {
            this.dataAtual = new Date().getMilliseconds().toString();
            this.getEventos();
          }
        );
      }else{
        this.evento.imagemURL = this.fileNameToUpdate;
        this.eventoService.postUpload(this.file, this.fileNameToUpdate)
        .subscribe(
          () => {
            this.dataAtual = new Date().getMilliseconds().toString();
            this.getEventos();
          }
        );
      }
  }

  salvarAlteracao(template: any){
     if (this.formulario.valid){
       if (this.modoSalvar === 'post'){
          this.evento = Object.assign({}, this.formulario.value);
          this.upload();
          this.eventoService.postEvento(this.evento).subscribe(
              (novoEvento: Evento) => {
                template.hide();
                this.getEventos();
                this.toastr.success('Inserido com Sucesso!', 'Inserindo Evento');
              }, error => {
                console.log(error);
                this.toastr.error(`Erro ao tentar inserir evento! ${error}`, 'Inserindo Evento');
              }
          );
        } else{
          this.evento = Object.assign({id: this.evento.id}, this.formulario.value);
          this.upload();
          this.eventoService.putEvento(this.evento).subscribe(
              () => {
                template.hide();
                this.getEventos();
                this.toastr.success('Editado com Sucesso!', 'Editando Evento');
              }, error => {
                console.log(error);
                this.toastr.error(`Erro ao tentar editar evento! ${error}`, 'Editando Evento');
              }
          );
        }
     }
  }

  onFileChange(event){
    const reader = new FileReader();

    if (event.target.files && event.target.files.length){
      this.file = event.target.files;
      console.log(this.file);
    }
  }

  getEventos(){
    this.eventoService.getAllEvento().subscribe(
      (_eventos: Evento[]) => {
      this.eventos = _eventos;
      this.eventosFiltrados = this.eventos;
      console.log(this.eventos);
    }, error => {
      this.toastr.error(`Erro ao tentar carregar eventos! ${error}`, 'Carregando Eventos');
    });
  }

}
