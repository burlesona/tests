// Editor Object
editor = {
  reset: function() {
    $('.block.editing').removeClass('editing').attr('contenteditable',false);
  },
  exec: function(command) {
    var selection = rangy.getSelection();
    document.execCommand(command,false,selection);
  },
  deleteBlockIfEmpty: function(event) {
    var $block = $(event.target)
    if( $block.html() == "" ) {
      $prev = $block.prev('.block');
      $block.remove();
      $prev.addClass('editing').attr('contenteditable',true).focus();
      this.moveCaratToEndOfElement( $prev[0] );
      return false;
    } else {
      return true;
    }
  },
  moveCaratToEndOfElement: function(element) {
    range = document.createRange();//Create a range (a range is a like the selection but invisible)
    range.selectNodeContents(element);//Select the entire contents of the element with the range
    range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
    selection = window.getSelection();//get the selection object (allows you to change selection)
    selection.removeAllRanges();//remove any selections already made
    selection.addRange(range);//make the range you have just created the visible selection
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
  if(event.which == 8) {
    return editor.deleteBlockIfEmpty(event);
  }
});



// Toolbar Bindings
$('#controls a').on('click',function(event){
  event.preventDefault();
  editor.exec( $(this).data('command') );
  event.stopPropagation();
});
