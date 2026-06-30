using System;
using System.IO;
using System.Runtime.InteropServices;

class SetAssociation
{
    [DllImport("shell32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    static extern void SHOpenWithDialog(IntPtr hwndParent, ref OPENWITHINFO oi);

    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Auto)]
    struct OPENWITHINFO
    {
        public int cbSize;
        public int fFlags;
        [MarshalAs(UnmanagedType.LPTStr)]
        public string pcszFile;
        [MarshalAs(UnmanagedType.LPTStr)]
        public string pcszClass;
    }

    const int OPEN_WITH_SHOW_FILES = 0x1;

    static void Main()
    {
        // Create a temporary .md file to trigger the association dialog
        string tempMd = Path.Combine(Path.GetTempPath(), "markone_associate.md");
        File.WriteAllText(tempMd, "# MarkOne\nAssociate .md files with MarkOne.");

        var oi = new OPENWITHINFO
        {
            cbSize = Marshal.SizeOf(typeof(OPENWITHINFO)),
            fFlags = OPEN_WITH_SHOW_FILES,
            pcszFile = tempMd,
            pcszClass = null
        };

        SHOpenWithDialog(IntPtr.Zero, ref oi);
    }
}
