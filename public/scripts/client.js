/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(() => {
  // Test / driver code (temporary). Eventually will get this from the server.
  // Fake data taken from initial-tweets.json

  // protecting from XSS attack
  const escape = function(str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  // creating new tweet list
  const createTweetElement = (data) => {
    const $tweet = $(`
    <article class="tweet">
        <header>
          <div>
            <img src='${escape(data.user.avatars)}'/>
            <span>${escape(data.user.name)}</span>
          </div>
          <span>${escape(data.user.handle)}</span>
        </header>
          <textarea class="tweet-text" disabled>${escape(
    data.content.text
  )}</textarea>
        <footer>
          <span>${timeago.format(data.created_at)}</span>
          <div>
            <button class="icons">
              <i class="fas fa-flag"></i>
            </button>
            <button>
              <i class="fas fa-retweet"></i>
            </button>
            <button>
              <i class="fas fa-heart"></i>
            </button>
          </div>
        </footer>
      </article>
    `);

    return $tweet;
  };

  const renderTweets = function(tweets) {
    // loops through tweets
    // calls createTweetElement for each tweet
    // takes return value and appends it to the tweets container
    const $tweetContainer = $("#tweets-container");
    $tweetContainer.empty();
    for (const tweet of tweets) {
      // $tweetContainer.prepend(createTweetElement(tweet));
      $tweetContainer.prepend(createTweetElement(tweet));
    }
  };

  // request json file as a return value
  const fetch = () => {
    $.getJSON("/tweets", (data) => {
      renderTweets(data);
    });
  };

  // Create element for error message
  const $error = $(`
    <div class="error">
    <i class="fas fa-exclamation-triangle"></i>
    <span>hello</span>
    <i class="fas fa-exclamation-triangle"></i>
    </div>
  `).hide();
  $("form").prepend($error);

  // Listener for Submit Event
  $("form").submit(function(event) {
    event.preventDefault();

    // check if the textarea is not empty or not exceeded 140 characters
    const textLength = $(this).find("textarea").val().length;
    if (textLength <= 0 || textLength > 140) {
      if (textLength >= 140) {
        $error
          .find("span")
          .text("Tweet content is too long! Only 140 characters allowed!");
        return $error.slideDown().show();
      }
      $error.find("span").text("Empty Tweet is not allowed!");
      return $error.slideDown().show();
    }
    $error.hide();

    $.post("/tweets/", $(this).serialize(), () => {
      fetch();
    });
    $(this).find("textarea").val("");
    $(this).find(".counter").val(140);
  });

  // initial loading the tweets
  fetch();
});
