myApp.onPageBeforeInit('wizard-result', function () {
  attachTabsToBackButton();
});

myApp.onPageInit('wizard-result', function (page) {
  myApp.params.swipePanel = false;

  attachSearchButton();

  var selectedTemplateName = "popularity";
  switch (selectedOrderByCategory) {
    case "vote_average":
    selectedTemplateName = "average vote";
    break;
    case "primary_release_date":
    selectedTemplateName = "release date";
    break;
    case "revenue":
    selectedTemplateName = "revenue";
    break;
    default:
  }

  var wizardHtml = Template7.templates.wizardResultTitleTemplate({
    selectedValue: selectedTemplateName
  });

  $$('.wizard-result-title').append(wizardHtml);

  var genreString = "&with_genres=";
  var apiObject;
  var minVotes = 1000;
  var genreSeparator;
  if(combineGenres) {
    genreSeparator = ',';
  } else {
    genreSeparator = '|'
  }

  if(selectedGenres.genre_ids.length === 0) {
    genreString = "";
  } else {
    for (var i = 0; i < selectedGenres.genre_ids.length; i++) {
      if(selectedGenres.genre_ids[i] == 99) {
        minVotes = 100;
      }

      genreString += selectedGenres.genre_ids[i];
      if(i !== selectedGenres.genre_ids.length - 1) {
        genreString += genreSeparator;
      }
    }
  }

  if(tvOrMovie === 'tv') {
    minVotes = 100;
  }

  $$.ajax({
    complete: function () {
    },
    url: 'https://api.themoviedb.org/3/discover/' + tvOrMovie + '?vote_count.gte=' + minVotes + '&include_adult=false&api_key=' + tmdbApiKey + genreString + '&sort_by=' + selectedOrderByCategory + '.desc',
    statusCode: {
      404: function (xhr) {
        console.log('page not found');
      },
      200: function (xhr) {
        buildSortedItemList(xhr, '.list-block.wizard-result-list.virtual-list.media-list');
      }
    }
  })
});
