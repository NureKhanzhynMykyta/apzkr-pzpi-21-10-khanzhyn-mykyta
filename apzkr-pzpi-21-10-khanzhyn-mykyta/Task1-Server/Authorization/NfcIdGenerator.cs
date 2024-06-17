using System.Security.Cryptography;
using System.Text;

namespace StudCheck_back.Authorization
{
    // Метод створення індивідуалього NFC ідентифікатора
    public class NfcIdGenerator
    {
        private const string Characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        private static readonly RNGCryptoServiceProvider CryptoProvider = new RNGCryptoServiceProvider();

        public static string GenerateNfcId(int length = 25)
        {
            if (length <= 0)
                throw new ArgumentException("Length must be a positive number", nameof(length));

            var bytes = new byte[length];
            CryptoProvider.GetBytes(bytes);
            var result = new StringBuilder(length);

            foreach (var b in bytes)
            {
                result.Append(Characters[b % Characters.Length]);
            }

            return result.ToString();
        }
    }
}
