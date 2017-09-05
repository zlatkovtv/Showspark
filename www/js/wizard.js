myApp.onPageBeforeInit('wizard', function () {
  document.removeEventListener("backbutton", goToWizard, false);
  document.removeEventListener("backbutton", exitPrompt, false);
  document.removeEventListener("backbutton", goToIndex, false);
  document.addEventListener("backbutton", goToTabs, false);
});

//wizard page
myApp.onPageInit('wizard', function (page) {
  var myList = myApp.virtualList('.list-block.virtual-list', {
    // Array with items data
    items: [
      {
        id: 28,
        title: "Action"
      },
      {
        id: 12,
        title: "Adventure"
      },
      {
        id: 16,
        title: "Animation"
      },
      {
        id: 35,
        title: "Comedy"
      },
      {
        id: 80,
        title: "Crime"
      },
      {
        id: 99,
        title: "Documentary"
      },
      {
        id: 18,
        title: "Drama"
      },
      {
        id: 10751,
        title: "Family"
      },
      {
        id: 14,
        title: "Fantasy"
      },
      {
        id: 36,
        title: "History"
      },
      {
        id: 27,
        title: "Horror"
      },
      {
        id: 10402,
        title: "Music"
      },
      {
        id: 9648,
        title: "Mystery"
      },
      {
        id: 10749,
        title: "Romance"
      },
      {
        id: 878,
        title: "Science Fiction"
      },
      {
        id: 10770,
        title: "TV Movie"
      },
      {
        id: 53,
        title: "Thriller"
      },
      {
        id: 10752,
        title: "War"
      },
      {
        id: 37,
        title: "Western"
      }
    ],
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
