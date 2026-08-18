jQuery(document).ready(function() {
	
	"use strict";

var flexSlider = function() {
  $('.probootstrap-slider').flexslider({
    animation: "fade",
    prevText: "",
    nextText: "",
    slideshowSpeed: 3500, // Adjust to 5 seconds
    animationSpeed: 1000, // Adjust to 1 second
    slideshow: true,
    directionNav: false,
    controlNav: true
  });
};
$(document).ready(function() {
  flexSlider(); // Ensure this is called after DOM is loaded
  fetchGitHubRepos(); // Load GitHub repositories
});

var fetchGitHubRepos = function() {
  var container = $('#github-repos-container');
  if (container.length === 0) return;

  var reposToFetch = [
      "Transformer_PyTorch",
      "PathFinder",
      "Rust-Command-Shell",
      "Video-Transcription-Translation-AI-System",
      "Deepkit",
      "Sentiment-Analysis-RNN",
      "Churn-Classification-ANN",
      "Obstacle_avoidance_robot",
      "Next-Word-Prediction-LSTM"
  ];

  var repoImages = {
      "Transformer_PyTorch": "static/transformer.png",
      "PathFinder": "static/pathfinder.png",
      "Rust-Command-Shell": "static/terminal.png",
      "Video-Transcription-Translation-AI-System": "static/ai-system.png",
      "Deepkit": "static/deepkit.png",
      "DeepKit": "static/deepkit.png",
      "Sentiment-Analysis-RNN": "static/rnn.webp",
      "Churn-Classification-ANN": "static/ann.jpg",
      "Obstacle_avoidance_robot": "static/turtlebot.jpg",
      "Next-Word-Prediction-LSTM": "static/lstm.png"
  };

  var repoStyles = {
      "Deepkit": "aspect-ratio: 16/9; object-fit: contain; background: #000000; padding: 20px;",
      "DeepKit": "aspect-ratio: 16/9; object-fit: contain; background: #000000; padding: 20px;"
  };

  Promise.all(reposToFetch.map(repoName => 
      fetch(`https://api.github.com/repos/Wassim-Hamra/${repoName}`)
          .then(res => res.ok ? res.json() : null)
          .catch(() => null)
  ))
  .then(results => {
      container.empty();
      var validRepos = results.filter(r => r !== null);
      if (validRepos.length > 0) {
          validRepos.forEach((repo) => {
              var description = repo.description || "No description provided.";
              var language = repo.language || "Markdown";
              
              if (description.length > 100) {
                  description = description.substring(0, 97) + "...";
              }
              
              var key = Object.keys(repoImages).find(k => k.toLowerCase() === repo.name.toLowerCase());
              var img = key ? repoImages[key] : "static/img/slider1.jpg";
              
              var styleKey = Object.keys(repoStyles).find(k => k.toLowerCase() === repo.name.toLowerCase());
              var imgStyle = styleKey ? repoStyles[styleKey] : "aspect-ratio: 16/9; object-fit: cover;";
              
              var html = `
                  <div class="col-md-4 col-sm-6 probootstrap-animate fadeInUp probootstrap-animated">
                      <div class="probootstrap-card" style="margin-bottom: 30px;">
                          <div class="probootstrap-card-media">
                              <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer"><img src="${img}" class="img-responsive img-border" alt="${repo.name}" style="${imgStyle}"></a>
                          </div>
                          <div class="probootstrap-card-text">
                              <h2 class="probootstrap-card-heading mb0">${repo.name.replace(/-/g, ' ').replace(/_/g, ' ')}</h2>
                              <p class="category">${language}</p>
                              <p style="min-height: 80px;">${description}</p>
                              <p><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">View details on GitHub</a></p>
                          </div>
                      </div>
                  </div>
              `;
              container.append(html);
          });
      } else {
          container.html('<div class="col-md-12 text-center"><p>No repositories found.</p></div>');
      }
  })
  .catch(error => {
      console.error('Error fetching repos:', error);
      container.html('<div class="col-md-12 text-center"><p>Error loading repositories. Please visit GitHub directly.</p></div>');
  });
};


});