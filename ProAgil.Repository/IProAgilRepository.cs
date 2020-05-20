using System.Threading.Tasks;
using ProAgil.Domain;

namespace ProAgil.Repository
{
    public interface IProAgilRepository
    {
         void Add<T>(T entity) where T : class;
         void Update<T>(T entity) where T : class;
         void Delete<T>(T entity) where T : class;
         Task<bool> SaveChangesAsync();

         //EVENTOS        
        Task<Evento[]> GetAllEventosAsyncByTema(string tema, bool includePalestrantes);
        Task<Evento[]> GetAllEventosAsync(bool includePalestrante);
        Task<Evento> GetEventosAsyncById(int EventoId, bool includePalestrantes);

        //PALESTRANTES
      
        Task<Palestrante[]> GetAllPalestrantesAsyncByName(string nome,bool includeEventos);
        Task<Palestrante> GetPalestranteAsyncById(int PalestranteId, bool includeEventos);

    }
}