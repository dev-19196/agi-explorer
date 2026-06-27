using AgriExplorerApi.Auth;
using AgriExplorerApi.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AgriExplorerApi.Controllers;

public record LoginRequest(string Username, string Password);
public record LoginResponse(string Token, string Username, string Role);

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly TokenService _tokenService;

    public AuthController(AppDbContext db, TokenService tokenService)
    {
        _db = db;
        _tokenService = tokenService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest req)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == req.Username);

        if (user is null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            return Unauthorized("Sai username hoặc password.");

        var token = _tokenService.CreateToken(user);
        return Ok(new LoginResponse(token, user.Username, user.Role));
    }
}
