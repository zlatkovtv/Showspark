myApp.onPageBeforeInit('wizard', function () {
  replaceEventListener(goToTabs);
});

//wizard page
myApp.onPageInit('wizard', function (page) {
  myApp.params.swipePanel = false;
  attachSearchButton();

  if(tvOrMovie === 'tv') {
    buildGenresForm(tvGenresJson);
  } else {
    buildGenresForm(movieGenresJson);
  }

  $$('.wizard-next-button').on('click', function(){
    selectedGenres = myApp.formToJSON('#genre-form');
    combineGenres = myApp.formToJSON('#combine-form').combineGenres[0];
    if(combineGenres) {
      combineGenres = true;
    } else {
      combineGenres = false;
    }

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
    items: genreJson,
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
