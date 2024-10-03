function wishList(){
    var list = document.getElementById("toast");
  list.classList.add("show");
  list.innerHTML = '<i class="far fa-heart wish"></i> Product added to List';
  setTimeout(function(){
    list.classList.remove("show");
  },3000);
}

function addCart(){
      var cart = document.getElementById("toast-cart");
  cart.classList.add("show");
  cart.innerHTML = '<i class="fas fa-shopping-cart cart"></i> Product added to cart';
  setTimeout(function(){
    cart.classList.remove("show");
  }, 3000);
}