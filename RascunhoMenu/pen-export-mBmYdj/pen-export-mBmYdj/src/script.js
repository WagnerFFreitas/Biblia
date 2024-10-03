var content = "";
var content2 = "";
var list = new XMLHttpRequest();
list.open('GET', 'https://s3.amazonaws.com/popular-movies/movies.json', true);
list.onreadystatechange = function(){
  if(this.readyState == 4){
    var obj = JSON.parse(this.responseText);
    for(i = 0; i < obj.length; i++){
      content += '<div class="item-c"><img src="'+obj[i].poster_url+'"><div class="play"></div><div class="caption">'+obj[i].title+'</div></div>';
    }
    for(j = (obj.length-1); j >= 0; j--){
      content2 += '<div class="item-c"><img src="'+obj[j].poster_url+'"><div class="play"></div><div class="caption">'+obj[j].title+'</div></div>';
    }
    document.getElementById('mylist').innerHTML = content;
    document.getElementById('mylist2').innerHTML = content2;  
  }
}
list.send();

function showImages(){
  $(".item-c img").each(function(index) {
    var times = (index*100);
    setTimeout(function(){ $(".item-c img").eq(index).addClass("show-it"); }, times);
  });
}

setTimeout(function(){
  showImages();
},1000);



function moveL(){
  var leftPos = $('.div-master').scrollLeft();
    console.log(leftPos);    
    $(".div-master").animate({
        scrollLeft: leftPos - 162
    }, 800);
}


function moveR(){
  var leftPos = $('.div-master').scrollLeft();
    console.log(leftPos);    
    $(".div-master").animate({
        scrollLeft: leftPos + 162
    }, 800);
}

$('.before').on('click', function(){
  moveL();
});
$('.after').on('click', function(){
  moveR()
});


