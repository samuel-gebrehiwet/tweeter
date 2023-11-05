$(document).ready(function() {
  $("form > .tweet-text").on("input", function() {
    let $charNumbers = this.value.length;
    let $couter = $(this).next().find(".counter");
    const maxLength = 140;
    $couter.val(maxLength - $charNumbers);
    if ($couter.val() < 0) {
      $couter.addClass("negative");
    } else {
      $couter.removeClass("negative");
    }
  });
});
