myApp.onPageBeforeInit('wizard', function () {
  document.removeEventListener("backbutton", goToWizard, false);
  document.removeEventListener("backbutton", exitPrompt, false);
  document.removeEventListener("backbutton", goToIndex, false);
  document.addEventListener("backbutton", goToTabs, false);
});

//wizard page
myApp.onPageInit('wizard', function (page) {
  myApp.params.swipePanel = false;

  // if(genresJson) {
    buildGenresForm(genresJson);
  // } else {
  //   $$.getJSON('../json_db/genres.json', function (data) {
  //     genresJson = data.genres;
  //     buildGenresForm(genresJson);
  //   });
  // }

  $$('.wizard-next-button').on('click', function(){
    var formData = myApp.formToJSON('#genre-form');
    selectedGenres = formData;

    $$('select[name="order-by-form"] option:checked').each(function () {
      selectedOrderByCategory = this.value;
    });

    if(selectedGenres === null || selectedOrderByCategory === null) {
      myApp.addNotification({
        message: 'Something went wrong...',
        hold: 2500
      });
    }
  });
});

function buildGenresForm(genreJson) {
  var myList = myApp.virtualList('.list-block.virtual-list', {
    // Array with items data
    items: genreJson,
    // Template 7 template to render each item
    template: '<li>' +
    '<label class="label-checkbox item-content">' +
    '<input type="checkbox" name="genre_ids" value={{id}} >' +
    '<div class="item-media">' +
    '<i class="icon icon-form-checkbox"></i>' +
    '</div>' +
    '<div class="item-inner">' +
    '<div class="item-title">{{title}}</div>' +
    '</div>' +
    '</label>' +
    '</li>'
  });
}
