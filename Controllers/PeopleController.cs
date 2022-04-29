using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Route("People")]
    [ApiController]
    [EnableCors("custom")]
    public class PeopleController : ControllerBase
    {
        private static readonly List<Person> people = new() 
        { 
            new(1, "Egri Patrik", 22), 
            new(2, "Farkas Balázs", 24), 
            new(3, "Juhász Zoltán", 31),
            new(4, "Egri Patrik", 22),
            new(5, "Farkas Balázs", 24),
            new(6, "Juhász Zoltán", 31),
            new(7, "Egri Patrik", 22),
            new(8, "Farkas Balázs", 24),
            new(9, "Juhász Zoltán", 31)
        };

        [HttpGet]
        public IEnumerable<Person> Get()
        {
            return people;
        }

        [HttpGet("{id}")]
        public Person Get(int id)
        {
            Person? p = people.Where(x => x.Id == id).FirstOrDefault();

            //if (p == null)
            //    return new HttpResponseMessage(System.Net.HttpStatusCode.NotFound);

            return p;
        }

        [HttpDelete("{id}")]
        public Person Delete(int id)
        {
            Person? p = people.Where(x => x.Id == id).FirstOrDefault();

            //if (p == null)
            //    return new HttpResponseMessage(System.Net.HttpStatusCode.NotFound);

            people.Remove(p);

            return p;
        }

        [HttpPost]
        public Person Create([FromBody] Person p)
        {
            p.Id = people.Last().Id + 1;
            people.Add(p);

            return p;
        }

        [HttpPut("{id}")]
        public Person Update(int id, [FromBody] Person p)
        {
            Person? pInList = people.Where(x => x.Id == id).FirstOrDefault();

            pInList.Name = p.Name;
            pInList.Age = p.Age;

            return pInList;
        }

    }
}
