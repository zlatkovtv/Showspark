myApp.onPageBeforeInit('wizard-order-by', function () {
  document.removeEventListener("backbutton", exitPrompt, false);
  document.removeEventListener("backbutton", goToWizardOrderby, false);
  document.removeEventListener("backbutton", goToIndex, false);
  document.removeEventListener("backbutton", goToTabs, false);
  document.addEventListener("backbutton", goToWizard, false);
});

myApp.onPageInit('wizard-order-by', function () {
  $$('.wizard-order-by-next-button').on('click', function () {
    $$('select[name="order-by-form"] option:checked').each(function () {
      selectedOrderByCategory = this.value;
    });
  });
});
