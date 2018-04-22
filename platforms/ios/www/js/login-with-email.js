myApp.onPageBeforeInit('login-with-email', function () {
});

//Login screen methods inside this
myApp.onPageInit('login-with-email', function () {
  myApp.params.swipePanel = false;
  myApp.loginScreen();

  $$('.open-sign-up-popup').on('click', function () {
    myApp.popup('.popup-sign-up');
  });

  //sign in with email button click method
  $$('.validate-signin').on('click', function () {
    //auto login below (disabled when commented)
    // goToTabs();
    var formData = myApp.formToJSON('#email-signin-form');
    if(formData.password === '' || formData.email === '') {
      myApp.alert('Please fill in everything before you submit', 'Fields missing');
      return;
    }

    if(formData.email.indexOf('@') === -1 || formData.email.indexOf('.') === -1) {
      myApp.alert('Please enter a valid email', 'Email invalid');
      return;
    }

    if(formData.password.length < 6) {
      myApp.alert('Please enter a enter a password at least 6 characters long', 'Short password');
      return;
    }

    firebase.auth().signInWithEmailAndPassword(formData.email, formData.password).then(function(result) {
      goToTabs();
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;

      if(errorCode === "auth/user-not-found") {
        myApp.alert('Please sign up before you sign in to Showspark.','User not found');
      } else if(errorCode === "auth/wrong-password") {
        myApp.alert('The password you have entered is incorrect. Please try again or reset it by tapping on \'Forgot Password?\'','Incorrect password');
      } else {
        myApp.alert(errorMessage,'Authentication error');
      }
    });
  });

  $$('.validate-signup').on('click', function () {
    var formData = myApp.formToJSON('#email-signup-form');
    if(formData.password === '' || formData.confirm_password === '' || formData.email === '') {
      myApp.alert('Please fill in everything before you submit', 'Fields missing');
      return;
    }

    if(formData.email.indexOf('@') === -1 || formData.email.indexOf('.') === -1) {
      myApp.alert('Please enter a valid email', 'Email invalid');
      return;
    }

    if(formData.password.length < 6) {
      myApp.alert('Please enter a enter a password at least 6 characters long', 'Short password');
      return;
    }

    if(formData.password != '' && (formData.password != formData.confirm_password)) {
      myApp.alert('Please make sure that your passwords match', 'Password missmatch');
      return;
    }

    firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password).then(function(result) {
      //TODO send welcome email
      myApp.closeModal();
      goToTabs();
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;

      myApp.alert(errorMessage,'Authentication error');
    });
  });

  $$('.pop-forgotten-password').on('click', function () {
    var emailAddress;
    myApp.prompt('Please enter your email below', 'Reset password', function (value) {
      emailAddress = value;
      if(emailAddress.indexOf('@') === -1 || emailAddress.indexOf('.') === -1) {
        myApp.alert('Please enter a valid email', 'Email invalid');
      } else {
        firebase.auth().sendPasswordResetEmail(emailAddress).then(function() {
          myApp.alert('An email has been sent to you with steps to reset your password.', 'Thank you');
        }, function(error) {
          myApp.alert(errorMessage, 'An error occured');
        });
      }
    });
  });
});
