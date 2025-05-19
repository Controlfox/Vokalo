using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VokaloApi.Data;
using VokaloApi.Models;

namespace VokaloApi.Controllers
{
    [ApiController]
    [Route("glosor")]
    public class GlosorController : ControllerBase
    {
        private readonly AppDbContext _db;
        public GlosorController(AppDbContext db) { _db = db; }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Glosa>>> GetAll(string? child = null)
        {
            var query = _db.Glosor.AsQueryable();
            if (!string.IsNullOrEmpty(child))
                query = query.Where(g => g.Child == child);
            return await query.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Glosa>> Create(Glosa glosa)
        {
            _db.Glosor.Add(glosa);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAll), new { id = glosa.Id }, glosa);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Glosa glosa)
        {
            if (id != glosa.Id) return BadRequest();
            _db.Entry(glosa).State = EntityState.Modified;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var g = await _db.Glosor.FindAsync(id);
            if (g == null) return NotFound();
            _db.Glosor.Remove(g);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}