// Editor Object
editor = {
  reset: function() {
    $('.block.editing').removeClass('editing').attr('contenteditable',false);
  },
  exec: function(command) {
    var selection = rangy.getSelection();
    document.execCommand(command,false,selection);
  }
}


// Document Bindings
$(document).on('click',function(event){
  editor.reset();
});

$(document).on('click','.block',function(event){
  if(!$(this).hasClass('editing')){
    editor.reset();
    $(this).addClass('editing').attr('contenteditable',true);
  }
  event.stopPropagation();
});

$(document).on('keydown','.block.editing',function(event){
  console.log('event:',event);
  if(event.which == 13) {
    editor.reset();
    $('<p class="block editing" contenteditable="true"></p>').insertAfter(event.target).focus();
    return false;
  }
});


// Toolbar Bindings
$('#controls a').on('click',function(event){
  event.preventDefault();
  editor.exec( $(this).data('command') );
  event.stopPropagation();
});
