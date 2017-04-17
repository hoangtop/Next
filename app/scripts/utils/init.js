  $('document').ready(function() {
      $('.login-input').smartTvKeyboard({
          title: null, // Window title
          defLang: null, // Default language (layout key name)
          defMode: null, // Default mode (depends on layout, usually: 'shift', 'unshift' or 'symb')
          layouts: {
              en: smartTvKeyboardLayouts.enBoxed
          }, // Will enable all loaded layouts
          type: 'inline', // Keyboard type: 'inline' or 'modal'
          openOn: 'click focus', // Space-separated list of events to display the keyborad, defaults to 'click focus' 
          onEnter: null, // On enter callback, passes entered value as first param
          onCancel: null, // On cancel callback, passes entered value as first param
          useDirectEdit: true, // Allow direct input with physical keyboard
          useNavKeys: true, // Allow using nav keys (remote control) to select and enter values
          navKeys: { // List of custom key codes, requires if useNavKeys option enabled (usually it's remote control keycodes)
              LEFT: 37,
              UP: 38,
              RIGHT: 39,
              DOWN: 40,
              ENTER: 13, // Enter
              EXIT: 8, // ESC
              RETURN: 10009
          }
      });


  });