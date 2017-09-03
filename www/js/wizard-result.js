myApp.onPageBeforeInit('wizard-result', function () {
  document.removeEventListener("backbutton", goToWizard, false);
  document.removeEventListener("backbutton", exitPrompt, false);
  document.removeEventListener("backbutton", goToIndex, false);
  document.addEventListener("backbutton", goToWizardOrderby, false);
});

//wizard page
myApp.onPageInit('wizard-result', function (page) {
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

  console.log(selectedGenres);

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

  console.log(genreString);

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
