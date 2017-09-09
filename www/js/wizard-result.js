myApp.onPageBeforeInit('wizard-result', function () {
  document.removeEventListener("backbutton", exitPrompt, false);
  document.removeEventListener("backbutton", goToIndex, false);
  document.addEventListener("backbutton", goToWizard, false);
});

//wizard page
myApp.onPageInit('wizard-result', function (page) {
  myApp.params.swipePanel = false;
  
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

  if(selectedGenres.genre_ids.length === 0) {
    genreString = "";
  } else {
    for (var i = 0; i < selectedGenres.genre_ids.length; i++) {
      genreString += selectedGenres.genre_ids[i];
      if(i !== selectedGenres.genre_ids.length - 1) {
        genreString += ',';
      }
    }
  }

  console.log("ajaxstart");

  //make api call, make object and assign it to items below
  $$.ajax({
    complete: function () {
      console.log("ajaxcomplete");
    },
    url: 'https://api.themoviedb.org/3/discover/movie?api_key=' + tmdbApiKey + genreString + '&sort_by=' + selectedOrderByCategory + '.desc',
    statusCode: {
      404: function (xhr) {
        console.log('page not found');
      },
      200: function (xhr) {
        buildSortedMovieList(xhr);
      }
    }
  })
});

function buildSortedMovieList(xhr) {
  apiObject = JSON.parse(xhr.response).results;
  apiObject = normalizeApiObj(apiObject);

  var myList = myApp.virtualList('.list-block.virtual-list.media-list', {
    // Array with items data
    items: apiObject,
    renderItem: function (index, item) {
      return '<li>' +
      '<a href="#" class="item-link item-content detail-link" id="'+ item.id + '">' +
      '<div class="item-media"><img src="' + item.poster_path + '" alt="Image not found" onerror="this.onerror=null;this.src=\'img/default-movie-poster.jpg\';" width="100" height="148"></div>' +
      '<div class="item-inner">' +
      '<div class="item-title-row">' +
      '<div class="item-title">' + (index + 1) + '. ' + item.title + '</div>' +
      '<div class="item-after">' + item.vote_average + '</div>' +
      '</div>' +
      '<div class="item-subtitle">' + item.release_year + '</div>' +
      '<div class="item-text item-text-5-rows">' + item.overview + '</div>' +
      '</div>' +
      '</a>' +
      '</li>';
    },
    height: 176
  });

  $$('.detail-link').on('click', function () {
    var clickedObjId = $$(this).prop('id');

    getMovieDetailInfo(clickedObjId);
  });
}
