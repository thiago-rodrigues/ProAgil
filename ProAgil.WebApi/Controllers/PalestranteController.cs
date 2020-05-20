using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProAgil.Domain;
using ProAgil.Repository;

namespace ProAgil.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PalestranteController: ControllerBase
    {
        private readonly IProAgilRepository _repo;

        public PalestranteController(IProAgilRepository repo)
        {
            _repo = repo;
        }

       [HttpGet("{PalestranteId}")]
        public async Task<IActionResult> Get(int PalestranteId)
        {
            try
            {
                var results = await _repo.GetPalestranteAsyncById(PalestranteId, true);
                return Ok(results);
            }
            catch (System.Exception)
            {                
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados Falhou!!");
            }                        
        }

        [HttpGet("getByNome/{Nome}")]
        public async Task<IActionResult> Get(string Nome)
        {
            try
            {
                var results = await _repo.GetAllPalestrantesAsyncByName(Nome, true);
                return Ok(results);
            }
            catch (System.Exception)
            {                
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados Falhou!!");
            }                        
        }
        [HttpPost]
        public async Task<IActionResult> Post(Palestrante model)
        {
            try
            {
                _repo.Add(model);
                if(await _repo.SaveChangesAsync()){
                     return Created($"/api/palestrante/{model.Id}", model);
                }                
            }
            catch (System.Exception)
            {                
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados Falhou!!");
            }     

            return BadRequest("Não foi possivel gravar o palestrante!");                                      
        }

        [HttpPut]
        public async Task<IActionResult> Put(int PalestranteId,Palestrante model)
        {
            try
            {
                var palestrante = _repo.GetPalestranteAsyncById(PalestranteId, false);
                if(palestrante == null) return NotFound();

                _repo.Update(model);
                if(await _repo.SaveChangesAsync()){
                     return Created($"/api/palestrante/{model.Id}", model);
                }                
            }
            catch (System.Exception)
            {                
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados Falhou!!");
            }     

            return BadRequest("Não foi possivel atualizar o palestrante!");                   
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int PalestranteId)
        {
            try
            {
                var palestrante = _repo.GetPalestranteAsyncById(PalestranteId, false);
                if(palestrante == null) return NotFound();
                
                _repo.Delete(palestrante);
                if(await _repo.SaveChangesAsync()){
                     return Ok();
                }                
            }
            catch (System.Exception)
            {                
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados Falhou!!");
            }     

            return BadRequest("Não foi possivel apagar o palestrante!");                   
        }
    }
}