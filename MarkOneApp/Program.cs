using System;
using System.IO;
using System.Diagnostics;

class MarkOne
{
    static void Main(string[] args)
    {
        if (args.Length == 0 || !File.Exists(args[0]))
        {
            Console.Error.WriteLine("Usage: MarkOne.exe <file.md>");
            return;
        }

        string mdPath = args[0];
        string b64 = Convert.ToBase64String(File.ReadAllBytes(mdPath));
        string enc = Uri.EscapeDataString(b64);
        string name = Path.GetFileName(mdPath);
        
        string htmlDir = AppDomain.CurrentDomain.BaseDirectory;
        string url = "file:///" + Path.Combine(htmlDir, "MARKOne.html").Replace('\\', '/')
                   + "?b64=" + enc + "&name=" + name;

        Process.Start("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", url);
    }
}
