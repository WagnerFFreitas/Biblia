const listItems = document.querySelectorAll(".main-menu li");

listItems.forEach((listItem) => {
  listItem.addEventListener("click", () => {
    listItems.forEach((otherItem) => {
      otherItem.classList.remove('active')
    })
    listItem.classList.add('active')
  });
});