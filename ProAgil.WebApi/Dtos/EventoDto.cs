using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProAgil.WebApi.Dtos
{
    public class EventoDto
    {
        public int Id { get; set; }
        [Required (ErrorMessage="Campo Obrigatório")]
        [StringLength (100, MinimumLength=3, ErrorMessage="A quantidade de caracteres deve estar entre 3 e 100")]
        public string Local { get; set; }   
        public DateTime DataEvento { get; set; }
        [Required (ErrorMessage="O Tema deve ser preenchido!")]
        public string  Tema { get; set; }
        
        [Range(2,120000, ErrorMessage="Quantidade deve estar entre 2 e 120000")]
        public int QtdPessoas { get; set; }
        public string ImagemURL { get; set; }

        [Phone]
        public string Telefone { get; set; }

        [EmailAddress]
        public string Email { get; set; }
        public List<LoteDto> Lotes { get; set; }    
        public List<RedeSocialDto> RedesSociais { get; set; }
        public List<PalestranteDto> Palestrantes { get; set; }
    }
}