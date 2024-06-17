using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace StudCheck_back.Authorization
{
    public class AuthOptions
    {
        // Константи для налаштування JWT
        public const string ISSUER = "Server";
        public const string AUDIENCE = "Student";
        private const string KEY = "mysupersecret_secretkey!123";

        // Отримання об'єкта SymmetricSecurityKey на основі ключа
        public static SymmetricSecurityKey GetSymmetricSecurityKey() =>
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(KEY));
    }
}
