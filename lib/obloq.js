function loadpage(hash){
  $('#example').load(hash.slice(1).toLowerCase() + '.html?' + Math.random(), format);
}

$('#menu a').click(function(){
    loadpage(this.getAttribute('href'));
});

function format(){
    $('#example pre code').each(function(i, elem){
        var ext = $(elem).attr('class');
        if (ext){
            if(ext === 'sketch'){
                $(elem).addClass('no-highlight').sketch();
            }else{
                $(elem).addClass('language-' + ext);
                hljs.highlightBlock(elem, '    ');
            }
        }
    });
}

$(function(){
  if (location.hash){
    loadpage(location.hash);
  }
});
