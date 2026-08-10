!include nsDialogs.nsh

Var Checkbox

Function fileAssociationPage
  nsDialogs::Create 1018
  Pop $0

  ${If} $0 == error
    Abort
  ${EndIf}

  ${NSD_CreateCheckbox} 0 0 100% 12u "Associate .md files with MARKone"
  Pop $Checkbox

  ; Default to checked
  ${NSD_SetState} $Checkbox ${BST_CHECKED}

  nsDialogs::Show
FunctionEnd

Function fileAssociationPageLeave
  ${NSD_GetState} $Checkbox $0
  ${If} $0 == ${BST_CHECKED}
    WriteRegStr SHCTX "Software\Classes\.md" "" "markone.md"
    WriteRegStr SHCTX "Software\Classes\markone.md" "" "Markdown Document"
    WriteRegStr SHCTX "Software\Classes\markone.md\DefaultIcon" "" "$INSTDIR\MARKone.exe,0"
    WriteRegStr SHCTX "Software\Classes\markone.md\shell\open\command" "" '"$INSTDIR\MARKone.exe" "%1"'
  ${EndIf}
FunctionEnd

!macro customHeader
  Page custom fileAssociationPage fileAssociationPageLeave
!macroend

!macro customUnInstall
  DeleteRegKey SHCTX "Software\Classes\markone.md"
!macroend
