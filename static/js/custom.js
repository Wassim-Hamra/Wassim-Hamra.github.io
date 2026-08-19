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
  fetchGitHubRepos(); // Load GitHub repositories dynamically
  initContactForm(); // Initialize AJAX contact form
  initCommandPalette(); // Initialize Command Palette (Ctrl+K)
  initSkillBars(); // Animate technical skill progress bars
  initAIChatbot(); // Initialize Ask Wassim AI chatbot widget
});

var fetchGitHubRepos = function() {
  var projectsPageContainer = $('#github-repos-container');
  var homePageContainer = $('#home-projects-container');
  if (projectsPageContainer.length === 0 && homePageContainer.length === 0) return;

  var container = projectsPageContainer.length > 0 ? projectsPageContainer : homePageContainer;
  var limit = homePageContainer.length > 0 ? 3 : null;

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

  fetch('https://api.github.com/users/Wassim-Hamra/repos?per_page=100')
  .then(res => res.ok ? res.json() : [])
  .then(results => {
      container.empty();
      
      var allCards = [];
      var validRepos = [];
      
      if (Array.isArray(results)) {
          reposToFetch.forEach(repoName => {
              var found = results.find(r => r.name.toLowerCase() === repoName.toLowerCase());
              if (found) {
                  validRepos.push(found);
              }
          });
      }
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

      var cardsToRender = limit ? allCards.slice(0, limit) : allCards;

      if (cardsToRender.length > 0) {
          cardsToRender.forEach((card) => {
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


var initContactForm = function() {
  var form = $('#contact-form');
  if (form.length === 0) return;

  form.on('submit', function(e) {
    e.preventDefault();

    var submitBtn = form.find('input[type="submit"]');
    var alertBox = $('#contact-alert');
    
    submitBtn.prop('disabled', true).val('Sending...');
    alertBox.hide().removeClass('alert-success alert-danger alert-info').text('');

    var formData = form.serialize();

    $.ajax({
      url: 'https://api.web3forms.com/submit',
      type: 'POST',
      data: formData,
      dataType: 'json'
    })
    .done(function(response) {
      if (response.success) {
        window.location.href = 'message_sent.html';
      } else {
        alertBox.addClass('alert-danger').text(response.message || 'Something went wrong. Please try again.').fadeIn();
      }
    })
    .fail(function(error) {
      console.error('Contact form error:', error);
      alertBox.addClass('alert-danger').text('An error occurred. Please try again later.').fadeIn();
    })
    .always(function() {
      submitBtn.prop('disabled', false).val('Send Message');
    });
  });
};

var initCommandPalette = function() {
  var modalHtml = `
    <div class="cmd-palette-overlay" id="cmd-palette-overlay">
      <div class="cmd-palette-modal">
        <div class="cmd-header">
          <i class="icon-search"></i>
          <input type="text" id="cmd-input" class="cmd-input" placeholder="Search page or action..." autocomplete="off">
          <span class="cmd-badge">ESC to close</span>
        </div>
        <div class="cmd-results" id="cmd-results"></div>
        <div class="cmd-footer">
          <div>Spotlight Command Palette</div>
          <div class="cmd-footer-keys">
            <span class="cmd-footer-key"><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
            <span class="cmd-footer-key"><kbd>↵</kbd> Select</span>
          </div>
        </div>
      </div>
    </div>
  `;
  $('body').append(modalHtml);

  var overlay = $('#cmd-palette-overlay');
  var input = $('#cmd-input');
  var resultsContainer = $('#cmd-results');
  var isOpen = false;
  var selectedIndex = 0;

  var items = [
    // Navigation
    { title: "Home Page", category: "Navigation", icon: "icon-home", action: function() { window.location.href = "index.html"; } },
    { title: "Projects Page", category: "Navigation", icon: "icon-briefcase", action: function() { window.location.href = "projects.html"; } },
    { title: "About Wassim", category: "Navigation", icon: "icon-user", action: function() { window.location.href = "about.html"; } },
    { title: "Contact Form", category: "Navigation", icon: "icon-mail", action: function() { window.location.href = "contact.html"; } },

    // Actions & Socials
    { title: "Copy Email (wassimhamraa@gmail.com)", category: "Action", icon: "icon-copy", action: function() { 
        navigator.clipboard.writeText("wassimhamraa@gmail.com"); 
        alert("Copied wassimhamraa@gmail.com to clipboard!");
      } 
    },
    { title: "LinkedIn Profile", category: "Social", icon: "icon-linkedin", action: function() { window.open("https://www.linkedin.com/in/medwassimhamra/", "_blank"); } },
    { title: "GitHub Repositories", category: "Social", icon: "icon-github2", action: function() { window.open("https://github.com/Wassim-Hamra?tab=repositories", "_blank"); } }
  ];

  var renderItems = function(filterText) {
    resultsContainer.empty();
    var query = (filterText || "").toLowerCase().trim();

    var filtered = items.filter(function(item) {
      return item.title.toLowerCase().indexOf(query) !== -1 || item.category.toLowerCase().indexOf(query) !== -1;
    });

    if (filtered.length === 0) {
      resultsContainer.html('<div style="padding: 20px; text-align: center; color: #8b949e;">No matching commands found.</div>');
      resultsContainer.data('count', 0);
      return;
    }

    var groups = {};
    filtered.forEach(function(item, idx) {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push({ item: item, originalIndex: idx });
    });

    var currentGlobalIndex = 0;
    Object.keys(groups).forEach(function(cat) {
      resultsContainer.append('<div class="cmd-group-heading">' + cat + '</div>');
      groups[cat].forEach(function(entry) {
        var isSelected = (currentGlobalIndex === selectedIndex);
        var activeClass = isSelected ? ' active' : '';
        var itemHtml = `
          <div class="cmd-item${activeClass}" data-index="${currentGlobalIndex}">
            <div class="cmd-item-left">
              <div class="cmd-item-icon"><i class="${entry.item.icon}"></i></div>
              <div class="cmd-item-info">
                <div class="cmd-item-title">${entry.item.title}</div>
                <div class="cmd-item-category">${entry.item.category}</div>
              </div>
            </div>
            <div class="cmd-item-shortcut">↵ Jump</div>
          </div>
        `;
        resultsContainer.append(itemHtml);
        currentGlobalIndex++;
      });
    });

    resultsContainer.data('count', currentGlobalIndex);
  };

  var openModal = function() {
    overlay.addClass('active');
    isOpen = true;
    selectedIndex = 0;
    input.val('');
    renderItems('');
    setTimeout(function() { input.focus(); }, 50);
  };

  var closeModal = function() {
    overlay.removeClass('active');
    isOpen = false;
    input.blur();
  };

  $(document).on('click', '#cmd-palette-btn', function(e) {
    e.preventDefault();
    if (isOpen) closeModal(); else openModal();
  });

  overlay.on('click', function(e) {
    if ($(e.target).hasClass('cmd-palette-overlay')) closeModal();
  });

  $(document).on('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (isOpen) closeModal(); else openModal();
    } else if (e.key === 'Escape' && isOpen) {
      closeModal();
    }
  });

  input.on('input', function() {
    selectedIndex = 0;
    renderItems($(this).val());
  });

  input.on('keydown', function(e) {
    var count = resultsContainer.data('count') || 0;
    if (count === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % count;
      updateActiveItem();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + count) % count;
      updateActiveItem();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      executeActiveItem();
    }
  });

  var updateActiveItem = function() {
    resultsContainer.find('.cmd-item').removeClass('active');
    var activeEl = resultsContainer.find('.cmd-item[data-index="' + selectedIndex + '"]');
    activeEl.addClass('active');
    if (activeEl.length > 0) {
      activeEl[0].scrollIntoView({ block: 'nearest' });
    }
  };

  var executeActiveItem = function() {
    var query = input.val().toLowerCase().trim();
    var filtered = items.filter(function(item) {
      return item.title.toLowerCase().indexOf(query) !== -1 || item.category.toLowerCase().indexOf(query) !== -1;
    });

    if (filtered[selectedIndex]) {
      closeModal();
      filtered[selectedIndex].action();
    }
  };

  resultsContainer.on('click', '.cmd-item', function() {
    var index = $(this).data('index');
    selectedIndex = index;
    executeActiveItem();
  });
};

var initSkillBars = function() {
  var fills = $('.skill-progress-fill');
  if (fills.length === 0) return;

  var animate = function() {
    fills.each(function() {
      var bar = $(this);
      bar.css('width', bar.attr('data-percent'));
    });
  };

  // If already open (or visible), animate immediately
  if ($('#collapseTwo').hasClass('in')) {
    animate();
  }

  // Animate when the Skills collapse panel is shown
  $('#collapseTwo').on('shown.bs.collapse', animate);
};

var initAIChatbot = function() {
  // 1. Inject HTML
  var chatbotHtml = `
    <div class="ai-chat-widget">
      <div class="ai-chat-toggle" id="ai-chat-toggle" title="Ask Wassim's AI">
        <i class="icon-chat"></i>
      </div>
      <div class="ai-chat-window" id="ai-chat-window">
        <div class="ai-chat-header">
          <div class="ai-chat-header-info">
            <div class="ai-chat-avatar">AI</div>
            <div class="ai-chat-title-group">
              <span class="ai-chat-title">Ask Wassim AI</span>
              <span class="ai-chat-subtitle"><span class="ai-chat-status-dot"></span> Active</span>
            </div>
          </div>
          <button class="ai-chat-close" id="ai-chat-close">&times;</button>
        </div>
        <div class="ai-chat-body" id="ai-chat-body">
          <div class="ai-chat-message assistant">
            Hi! I'm Wassim's AI assistant. Ask me anything about my projects, internships, or hobbies!
          </div>
          <div class="ai-chat-suggestions" id="ai-chat-suggestions">
            <button class="ai-chat-suggestion" data-q="What did you build during your Hexabyte internship?">What did you do at Hexabyte?</button>
            <button class="ai-chat-suggestion" data-q="Which projects of yours are you most proud of?">Which projects are you proudest of?</button>
            <button class="ai-chat-suggestion" data-q="Are you more of an AI engineer or systems programmer?">AI engineer or systems programmer?</button>
            <button class="ai-chat-suggestion" data-q="What sports teams do you cheer for?">What sports teams do you cheer for?</button>
          </div>
        </div>
        <div class="ai-chat-footer">
          <input type="text" class="ai-chat-input" id="ai-chat-input" placeholder="Type a message..." autocomplete="off">
          <button class="ai-chat-send" id="ai-chat-send"><i class="icon-paper-plane"></i></button>
        </div>
      </div>
    </div>
  `;
  $('body').append(chatbotHtml);

  var toggleBtn = $('#ai-chat-toggle');
  var chatWindow = $('#ai-chat-window');
  var closeBtn = $('#ai-chat-close');
  var sendBtn = $('#ai-chat-send');
  var chatInput = $('#ai-chat-input');
  var chatBody = $('#ai-chat-body');
  var suggestions = $('#ai-chat-suggestions');

  // Toggle Window
  toggleBtn.on('click', function() {
    chatWindow.toggleClass('open');
    toggleBtn.toggleClass('active');
    if (chatWindow.hasClass('open')) {
      chatInput.focus();
      scrollToBottom();
    }
  });

  closeBtn.on('click', function() {
    chatWindow.removeClass('open');
    toggleBtn.removeClass('active');
  });

  // Scroll function
  var scrollToBottom = function() {
    chatBody.scrollTop(chatBody[0].scrollHeight);
  };

  // Predefined Q&A mapping
  var getResponse = function(query) {
    var q = query.toLowerCase();
    
    if (q.includes('hexabyte')) {
      return "At Hexabyte, I built a PyTorch churn-prediction model to identify at-risk customers, created executive Tableau dashboards, and automated database/subscription updates using custom Python scripts.";
    }
    if (q.includes('proud') || q.includes('project') || q.includes('best') || q.includes('proudest')) {
      return "I'm really proud of my <strong>Video-Transcription-Translation-AI-System</strong> and my from-scratch <strong>Transformer_PyTorch</strong> implementation. Building a Transformer from scratch solidified my ML foundation, while the translation tool is a practical AI pipeline with real-world utility!";
    }
    if (q.includes('system') || q.includes('low') || q.includes('programmer') || q.includes('engineer') || q.includes('rust') || q.includes('c++')) {
      return "I love both! My primary focus is on AI agents, LLMs, and RAG architectures (using PyTorch, LangChain, and LangGraph), but I also love systems level programming—I've built a custom command shell in Rust and worked with C++.";
    }
    if (q.includes('sport') || q.includes('f1') || q.includes('ferrari') || q.includes('football') || q.includes('club') || q.includes('africain')) {
      return "I'm a massive fan of the Scuderia Ferrari F1 Team (Forza Ferrari! 🏎️) and a dedicated supporter of Club Africain in football/soccer! 🔴⚪";
    }
    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
      return "Hello! How can I help you today? Feel free to ask about my projects, internships, or interests!";
    }
    
    return "That's a great question! I'm still learning, but you can explore my <a href='projects.html' style='color:#22eaaa;text-decoration:underline;'>Projects</a>, read more <a href='about.html' style='color:#22eaaa;text-decoration:underline;'>About me</a>, or reach out to me directly on the <a href='contact.html' style='color:#22eaaa;text-decoration:underline;'>Contact page</a>!";
  };

  // Send Message Logic
  var handleSend = function(text) {
    if (!text || text.trim() === '') return;
    
    // Add user message
    var userMsgHtml = `<div class="ai-chat-message user">${text}</div>`;
    // Insert before suggestions (or append if suggestions are detached)
    if (suggestions.parent().length > 0) {
      suggestions.before(userMsgHtml);
    } else {
      chatBody.append(userMsgHtml);
    }
    scrollToBottom();

    // Detach suggestions during typing
    suggestions.detach();

    // Add typing indicator
    var typingHtml = `
      <div class="ai-chat-typing" id="ai-chat-typing">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    chatBody.append(typingHtml);
    scrollToBottom();

    setTimeout(function() {
      $('#ai-chat-typing').remove();
      var answer = getResponse(text);
      var assistantMsgHtml = `<div class="ai-chat-message assistant">${answer}</div>`;
      chatBody.append(assistantMsgHtml);
      
      // Re-attach suggestions at the end
      chatBody.append(suggestions);
      scrollToBottom();
    }, 1000);
  };

  // Bind click on suggestions
  chatBody.on('click', '.ai-chat-suggestion', function() {
    var text = $(this).attr('data-q');
    handleSend(text);
  });

  // Bind click on send button
  sendBtn.on('click', function() {
    var text = chatInput.val();
    chatInput.val('');
    handleSend(text);
  });

  // Bind Enter key press
  chatInput.on('keypress', function(e) {
    if (e.which === 13) {
      var text = chatInput.val();
      chatInput.val('');
      handleSend(text);
    }
  });
};

});