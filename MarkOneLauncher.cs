using System;
using System.IO;
using System.Diagnostics;
using System.Web;

class MarkOneLauncher
{
    static void Main(string[] args)
    {
        if (args.Length == 0 || !File.Exists(args[0])) return;

        string mdPath = args[0];
        string b64 = Convert.ToBase64String(File.ReadAllBytes(mdPath));
        string enc = HttpUtility.UrlEncode(b64);
        string name = Path.GetFileName(mdPath);

        string url = "file:///C:/Users/Josh/Documents/0000000000-MyApps/MarkOne/MARKOne.html?b64=" + enc + "&name=" + name;

        Process.Start("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", url);
    }
}
