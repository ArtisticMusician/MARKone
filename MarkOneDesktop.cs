using System;
using System.IO;
using System.Windows.Forms;
using Microsoft.Web.WebView2.WinForms;
using Microsoft.Web.WebView2.Core;

namespace MarkOneDesktop
{
    public class Program
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
                WindowState = FormWindowState.Maximized,
                Icon = null
            };

            var webView = new WebView2
            {
                Dock = DockStyle.Fill
            };
            form.Controls.Add(webView);

            webView.CoreWebView2InitializationCompleted += (s, e) =>
            {
                // Inject the file content directly via JavaScript
                string jsContent = mdContent.Replace("\\", "\\\\").Replace("`", "\\`").Replace("$", "\\$");
                string script = $@"
                    document.addEventListener('DOMContentLoaded', function() {{
                        var editor = document.getElementById('editor');
                        if (editor) {{
                            editor.value = `{jsContent}`;
                            document.getElementById('currentFileName').textContent = '{mdName}';
                            if (typeof updatePreview === 'function') updatePreview();
                            if (typeof updateStats === 'function') updateStats();
                        }}
                    }});
                ";
                webView.CoreWebView2.AddScriptToExecuteOnDocumentCreatedAsync(script);
            };

            webView.Source = new Uri("file:///" + Path.GetFullPath("MARKOne.html").Replace('\\', '/'));

            Application.Run(form);
        }
    }
}
