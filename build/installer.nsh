!macro customHeader
  !system "echo '' > ${BUILD_DIR}/customHeader"
!macroend

!macro preInit
  ; Nothing needed for preInit
!macroend

!macro customInit
  ; Provide option to set file association
!macroend

!macro customInstall
  ; Standard Electron-builder handles the actual association if requested
!macroend
