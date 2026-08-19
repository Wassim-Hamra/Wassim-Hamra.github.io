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
      "Next-Word-Prediction-LSTM",
      "PDF-Question-Answering-Chatbot-using-RAG"
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
      "Next-Word-Prediction-LSTM": "static/lstm.png",
      "PDF-Question-Answering-Chatbot-using-RAG": "search.png"
  };

  var repoStyles = {
      "Deepkit": "aspect-ratio: 16/9; object-fit: contain; background: #000000; padding: 20px;",
      "DeepKit": "aspect-ratio: 16/9; object-fit: contain; background: #000000; padding: 20px;"
  };

  var customStaticCards = [
      {
          name: "Health Center",
          category: "Predictive Modeling | Web Development",
          description: "A web application that uses predictive models to evaluate the risk for various diseases. Users input their health information, and they get personalized risk assessments and lifestyle recommendations to improve their health.",
          url: "under_development.html",
          linkText: "View details",
          img: "static/img/healthcenter.png",
          imgStyle: "aspect-ratio: 16/9; object-fit: cover;",
          isInternal: true
      },
      {
          name: "This Website",
          category: "Web Development",
          description: "A personal portfolio website showcasing my professional experience, skills, and personal projects, giving you insight into my journey and the work I’m passionate about.",
          url: "project_website.html",
          linkText: "View details",
          img: "static/img/screenshot.png",
          imgStyle: "aspect-ratio: 16/9; object-fit: cover;",
          isInternal: true
      }
  ];

  Promise.all(reposToFetch.map(repoName => 
      fetch(`https://api.github.com/repos/Wassim-Hamra/${repoName}`)
          .then(res => res.ok ? res.json() : null)
          .catch(() => null)
  ))
  .then(results => {
      container.empty();
      
      var allCards = [];
      var validRepos = results.filter(r => r !== null);
      validRepos.forEach((repo) => {
          var description = repo.description || "No description provided.";
          var language = repo.language || "Markdown";
          
          if (description.length > 100) {
              description = description.substring(0, 97) + "...";
          }
          
          var key = Object.keys(repoImages).find(k => k.toLowerCase() === repo.name.toLowerCase());
          var img = key ? repoImages[key] : "search.png";
          
          var styleKey = Object.keys(repoStyles).find(k => k.toLowerCase() === repo.name.toLowerCase());
          var imgStyle = styleKey ? repoStyles[styleKey] : "aspect-ratio: 16/9; object-fit: cover;";

          allCards.push({
              name: repo.name.replace(/-/g, ' ').replace(/_/g, ' '),
              category: language,
              description: description,
              url: repo.html_url,
              linkText: "View details on GitHub",
              img: img,
              imgStyle: imgStyle,
              isInternal: false
          });
      });

      // Add static internal cards at the end
      customStaticCards.forEach(card => {
          allCards.push(card);
      });

      if (allCards.length > 0) {
          allCards.forEach((card) => {
              var targetAttr = card.isInternal ? '' : 'target="_blank" rel="noopener noreferrer"';
              var html = `
                  <div class="col-md-4 col-sm-6 probootstrap-animate fadeInUp probootstrap-animated" style="margin-bottom: 30px; display: flex;">
                      <div class="probootstrap-card" style="display: flex; flex-direction: column; width: 100%; height: 100%;">
                          <div class="probootstrap-card-media">
                              <a href="${card.url}" ${targetAttr}><img src="${card.img}" class="img-responsive img-border" alt="${card.name}" style="${card.imgStyle}"></a>
                          </div>
                          <div class="probootstrap-card-text" style="display: flex; flex-direction: column; flex-grow: 1;">
                              <h2 class="probootstrap-card-heading mb0">${card.name}</h2>
                              <p class="category">${card.category}</p>
                              <p style="margin-bottom: 5px;">${card.description}</p>
                              <p style="margin-top: auto; padding-top: 0; margin-bottom: 0;"><a href="${card.url}" ${targetAttr}>${card.linkText}</a></p>
                          </div>
                      </div>
                  </div>
              `;
              container.append(html);
          });
      } else {
          container.html('<div class="col-md-12 text-center"><p>No projects found.</p></div>');
      }
  })
  .catch(error => {
      console.error('Error fetching repos:', error);
      container.html('<div class="col-md-12 text-center"><p>Error loading repositories. Please visit GitHub directly.</p></div>');
  });
};


});