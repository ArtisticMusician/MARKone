using System;
using System.IO;
using System.Windows.Forms;
using Microsoft.Web.WebView2.WinForms;
using Microsoft.Web.WebView2.Core;

class MarkOneApp
{
    [STAThread]
    static void Main(string[] args)
    {
        string mdContent = "";
        string mdName = "Untitled.md";

        if (args.Length > 0 && File.Exists(args[0]))
        {
            mdContent = File.ReadAllText(args[0]);
            mdName = Path.GetFileName(args[0]);
        }

        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);

        var form = new Form
        {
            Text = "MARKone - " + mdName,
            Width = 1400,
            Height = 900,
            WindowState = FormWindowState.Maximized
        };

        var webView = new WebView2 { Dock = DockStyle.Fill };
        form.Controls.Add(webView);

        string htmlDir = AppDomain.CurrentDomain.BaseDirectory;
        string htmlPath = Path.Combine(htmlDir, "MARKOne.html");

        var content = mdContent;
        var name = mdName;

        webView.CoreWebView2InitializationCompleted += (s, e) =>
        {
            // Hide DevTools menu
            webView.CoreWebView2.Settings.AreDevToolsEnabled = false;
            webView.CoreWebView2.Settings.IsStatusBarEnabled = false;

            // Inject the content once the page loads
            var escaped = content
                .Replace("\\", "\\\\")
                .Replace("`", "\\`")
                .Replace("${", "\\${");

            var script = $@"
(function() {{
    var checkLoaded = setInterval(function() {{
        var editor = document.getElementById('editor');
        if (editor) {{
            clearInterval(checkLoaded);
            editor.value = `{escaped}`;
            var fn = document.getElementById('currentFileName');
            if (fn) fn.textContent = '{name.Replace("'", "\\'")}';
            if (typeof updatePreview === 'function') updatePreview();
            if (typeof updateStats === 'function') updateStats();
        }}
    }}, 50);
    setTimeout(function() {{ clearInterval(checkLoaded); }}, 10000);
}})();
";
            webView.CoreWebView2.AddScriptToExecuteOnDocumentCreatedAsync(script);
        };

        webView.Source = new Uri("file:///" + htmlPath.Replace('\\', '/'));
        Application.Run(form);
    }
}
