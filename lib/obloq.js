function loadpage(hash){
  $('#example').load('build/' + hash.slice(1) + '.html?' + Math.random(), format);
}

$('#menu a').click(function(){
    loadpage(this.getAttribute('href'));
});

function format(){
    $('#example pre code').each(function(i, elem){
        var lines = $(elem).text().trim().split('\n');
        var filename = lines[0].match(/file\: +(.*)\.(.*)/);
        var ext = filename[2];
        if (ext){
            lines = lines.slice(2);
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
