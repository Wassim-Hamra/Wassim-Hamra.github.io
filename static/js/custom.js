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
var initPreloader = function() {
  var MUSIC_PREF_KEY = 'portfolioMusicPreference';
  var loaderEl = $(".probootstrap-loader");

  if (loaderEl.length === 0) return;
  if (sessionStorage.getItem('portfolioLoaded')) {
    loaderEl.addClass('loaded').fadeOut("slow", function() {
      $(this).remove();
    });
    return;
  }

  var preloaderHtml = `
    <div class="preloader-interactive-wrapper entry-overlay-card">
      <button type="button" id="entry-close-btn" class="entry-close-btn" aria-label="Close">×</button>
      <img src="static/img/favicon/android-chrome-512x512.png" class="preloader-logo-img" alt="Wassim Hamra">
      <h2 class="preloader-greeting">Hey There 👋</h2>
      <div class="entry-actions">
        <button type="button" id="launch-portfolio-btn" class="preloader-btn ready">Enter</button>
      </div>
    </div>
  `;
  loaderEl.html(preloaderHtml);

  var closeOverlay = function() {
    sessionStorage.setItem('portfolioLoaded', 'true');
    loaderEl.addClass('loaded').fadeOut("slow", function() {
      $(this).remove();
    });
  };

  var setPlayingUIState = function() {
    sessionStorage.setItem('loungeAudioState', 'playing');
    $('#lounge-player-widget').addClass('playing');
    $('#lounge-card-play-icon').removeClass('icon-play2').addClass('icon-pause2');
  };

  $('#launch-portfolio-btn').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();

    try { localStorage.setItem(MUSIC_PREF_KEY, 'enabled'); } catch (err) {}
    var audio = $('#lounge-audio')[0];
    closeOverlay();
    if (!audio) return;

    try {
      var playPromise = audio.play();
      if (playPromise !== undefined && typeof playPromise.then === 'function') {
        playPromise.then(function() {
          setPlayingUIState();
        }).catch(function() {
          sessionStorage.setItem('loungeAudioState', 'paused');
        });
      } else {
        setPlayingUIState();
      }
    } catch (err) {
      sessionStorage.setItem('loungeAudioState', 'paused');
    }
  });

  $('#entry-close-btn').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    sessionStorage.setItem('loungeAudioState', 'paused');
    closeOverlay();
  });
};


$(document).ready(function() {
  flexSlider(); // Ensure this is called after DOM is loaded
  fetchGitHubRepos(); // Load GitHub repositories dynamically
  initContactForm(); // Initialize AJAX contact form
  initCommandPalette(); // Initialize Command Palette (Ctrl+K)
  initSkillBars(); // Animate technical skill progress bars
  initAIChatbot(); // Initialize Ask Wassim AI chatbot widget
  initTimelineAnimation(); // Initialize scroll-animated timeline for about page
  initLoungeAudioPlayer(); // Initialize subtle lounge audio player
  initPreloader(); // Show full-screen entry overlay on first session load
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
      "Transformer_PyTorch": "static/transformer.jpg",
      "PathFinder": "static/pathfinder.jpg",
      "Rust-Command-Shell": "static/terminal.jpg",
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
          img: "static/img/healthcenter.jpg",
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
                              <a href="${card.url}" ${targetAttr}><img src="${card.img}" class="img-responsive img-border" alt="${card.name}" style="${card.imgStyle}" loading="lazy"></a>
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
      <div class="ai-chat-toggle" id="ai-chat-toggle" title="Ask Wassim's Assistant">
        <i class="icon-bubbles"></i>
      </div>
      <div class="ai-chat-window" id="ai-chat-window">
        <div class="ai-chat-header">
          <div class="ai-chat-header-info">
            <div class="ai-chat-avatar">💬</div>
            <div class="ai-chat-title-group">
              <span class="ai-chat-title">Wassim's Assistant</span>
              <span class="ai-chat-subtitle"><span class="ai-chat-status-dot"></span> Online</span>
            </div>
          </div>
          <button class="ai-chat-close" id="ai-chat-close">&times;</button>
        </div>
        <div class="ai-chat-body" id="ai-chat-body">
          <div class="ai-chat-message assistant">
            Hi! I'm Wassim's assistant. Ask me anything about my projects, internships, or hobbies!
          </div>
          <div class="ai-chat-suggestions" id="ai-chat-suggestions">
            <!-- Populated dynamically (3 at a time) -->
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

  // Pool of 10 human questions
  var questionsPool = [
    {
      id: 1,
      label: "What got you into Generative AI?",
      q: "What got you into Generative AI and AI Agents?",
      a: "I've always loved automation, but when LLMs emerged, I realized we could build systems that don't just follow rules, but actually think and reason. Building tools like my translation pipeline or experimenting with LangChain and LangGraph made me realize that AI agents are the future of software."
    },
    {
      id: 2,
      label: "What did you do at Hexabyte?",
      q: "I saw you interned at Hexabyte. What was the churn prediction project about?",
      a: "At Hexabyte, I built a machine learning pipeline using PyTorch to predict customer churn based on subscription patterns. I also built interactive Tableau dashboards for executives and automated database updates to streamline client lifecycle management."
    },
    {
      id: 3,
      label: "Why build a Rust shell?",
      q: "Why did you build a command shell from scratch in Rust?",
      a: "I wanted to understand how operating systems manage processes under the hood, and Rust's safety and performance made it the perfect tool. It was challenging to manage piping, I/O redirection, and signal handling, but it was incredibly rewarding!"
    },
    {
      id: 4,
      label: "What are you studying?",
      q: "What are you currently studying at FST?",
      a: "I'm in my final year of Computer Engineering at FST (Faculty of Sciences of Tunis), focusing on software engineering, deep learning, algorithms, and system architecture."
    },
    {
      id: 5,
      label: "Are you open to job offers?",
      q: "Are you looking for full-time opportunities or internships?",
      a: "Yes! I'm actively looking for Software Engineering and GenAI/ML positions where I can build impactful AI agents, tools, and scalable systems. You can view my contact details on the contact page if you'd like to chat!"
    },
    {
      id: 6,
      label: "Where can I get your resume?",
      q: "How do I download your resume/CV?",
      a: "You can download my CV directly from the About page using the 'Download CV' button, or get it via this direct link: <a href='https://drive.google.com/file/d/1e0lka_gm1ceTEtnZUaYaJGYqBprR7BHV/view?usp=sharing' target='_blank' style='color:#22eaaa;text-decoration:underline;'>Download CV</a>!"
    },
    {
      id: 7,
      label: "Who is your favorite F1 driver?",
      q: "I see you're an F1 fan. Who is your favorite driver?",
      a: "I'm a huge Scuderia Ferrari fan! Right now, I'm cheering on Charles Leclerc and Lewis Hamilton. Forza Ferrari always! 🏎️"
    },
    {
      id: 8,
      label: "What's your favorite tech stack?",
      q: "What is your favorite tech stack to build with?",
      a: "For AI and ML, I'm all about PyTorch, LangChain, and LangGraph. For web development, my go-to is TypeScript, Next.js, and FastAPI or Django. And for systems, I love Rust!"
    },
    {
      id: 9,
      label: "What did you do at SIMAC?",
      q: "What was your tax reporting project at SIMAC?",
      a: "During my internship at SIMAC, I built an ERP automated tax reporting module using PL/SQL and Delphi. It helped automate tax calculations and reporting and was adopted by 7 companies across Tunisia and Central Africa."
    },
    {
      id: 10,
      label: "What is the pathfinder project?",
      q: "Where did you build the pathfinder visualizer?",
      a: "I built PathFinder to visualize algorithms like Dijkstra's, A*, and BFS/DFS. It's a web tool that shows how search algorithms traverse grids to find the shortest path, making complex CS concepts visual and easy to learn."
    }
  ];

  var askedQuestionIds = [];

  var renderSuggestions = function() {
    suggestions.empty();
    
    // Filter out already asked questions
    var unasked = questionsPool.filter(function(item) {
      return askedQuestionIds.indexOf(item.id) === -1;
    });

    if (unasked.length === 0) {
      return;
    }

    // Display only up to 3 at once
    var displayCount = Math.min(3, unasked.length);
    for (var i = 0; i < displayCount; i++) {
      var item = unasked[i];
      var btn = $('<button class="ai-chat-suggestion"></button>')
        .attr('data-id', item.id)
        .attr('data-q', item.q)
        .text(item.label);
      suggestions.append(btn);
    }
  };

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

  // Generic Q&A lookup
  var getGenericResponse = function(query) {
    var q = query.toLowerCase().trim();
    
    if (q === 'hello' || q === 'hi' || q === 'hey' || q === 'yo' || q.startsWith('hi ')) {
      return "Hi there! How can I help you today?";
    }
    if (q === 'bye' || q === 'goodbye' || q === 'cya' || q === 'quit' || q === 'exit') {
      return "Goodbye! Have a great day!";
    }
    if (q.includes('who are you') || q.includes('your name') || q.includes('what are you')) {
      return "I'm Wassim's digital assistant. I'm here to answer questions about his skills, projects, and work experience!";
    }
    if (q.includes('how are you') || q.includes('how is it going') || q.includes('how\'s it going') || q.includes('whats up')) {
      return "I'm doing great, thank you! Ready to answer any questions you have about Wassim.";
    }
    if (q === 'thank you' || q === 'thanks' || q === 'ty' || q.includes('thank you')) {
      return "You're very welcome!";
    }
    if (q === 'awesome' || q === 'cool' || q === 'great' || q === 'nice' || q === 'perfect') {
      return "Glad you think so! Let me know if there's anything else you'd like to ask.";
    }
    if (q.includes('where do you live') || q.includes('location') || q.includes('where are you') || q.includes('live') || q.includes('tunis') || q.includes('tunisia')) {
      return "Wassim is based in Ariana, Tunisia.";
    }
    if (q.includes('linkedin')) {
      return "You can connect with Wassim on <a href='https://www.linkedin.com/in/medwassimhamra/' target='_blank' style='color:#22eaaa;text-decoration:underline;'>LinkedIn</a>.";
    }
    if (q.includes('github')) {
      return "Check out Wassim's repositories on <a href='https://github.com/Wassim-Hamra' target='_blank' style='color:#22eaaa;text-decoration:underline;'>GitHub</a>.";
    }
    if (q.includes('email') || q.includes('contact') || q.includes('phone') || q.includes('message') || q.includes('reach')) {
      return "You can email Wassim at <strong>wassimhamraa@gmail.com</strong>, call him at <strong>+216 98 786 241</strong>, or use the <a href='contact.html' style='color:#22eaaa;text-decoration:underline;'>Contact page</a>.";
    }
    if (q.includes('age') || q.includes('how old') || q.includes('birthday')) {
      return "Wassim is a final-year university student, around 22 years old.";
    }
    if (q.includes('school') || q.includes('university') || q.includes('college') || q.includes('fst') || q.includes('studying')) {
      return "Wassim is studying Computer Engineering at the Faculty of Sciences of Tunis (FST).";
    }
    if (q.includes('python')) {
      return "Python is Wassim's primary language. He uses it for Machine Learning, Generative AI (LangChain, PyTorch), and backend APIs (FastAPI, Django).";
    }
    if (q.includes('rust')) {
      return "Wassim loves Rust! He used it to build a custom command shell from scratch in Rust to explore low-level systems programming.";
    }
    if (q.includes('pytorch')) {
      return "Wassim has deep experience with PyTorch, having built custom Transformers, Sentiment Analysis RNNs, and churn prediction models.";
    }
    if (q.includes('agent') || q.includes('rag') || q.includes('llm') || q.includes('genai') || q.includes('generative ai')) {
      return "Wassim is passionate about GenAI and AI Agents, building pipelines using LangChain, LangGraph, OpenAI, and vector databases.";
    }
    if (q.includes('resume') || q.includes('cv') || q.includes('download')) {
      return "You can download Wassim's CV <a href='https://drive.google.com/file/d/1e0lka_gm1ceTEtnZUaYaJGYqBprR7BHV/view?usp=sharing' target='_blank' style='color:#22eaaa;text-decoration:underline;'>here</a>!";
    }
    if (q.includes('help') || q.includes('what can you do') || q.includes('features')) {
      return "I can answer questions about Wassim's education, projects (like his Rust shell or RAG chatbot), internships (Hexabyte, SIMAC), and hobbies.";
    }
    if (q.includes('club africain') || q.includes('football') || q.includes('soccer')) {
      return "Wassim is a big supporter of Club Africain! 🔴⚪ White and red forever.";
    }
    if (q.includes('ferrari') || q.includes('f1') || q.includes('formula 1') || q.includes('leclerc')) {
      return "Wassim is a huge Scuderia Ferrari F1 fan. Forza Ferrari always! 🏎️";
    }
    return null;
  };

  // Predefined Q&A mapping
  var getResponse = function(query) {
    var q = query.toLowerCase().trim();
    
    // Check human questions pool
    var matchedItem = null;
    for (var i = 0; i < questionsPool.length; i++) {
      var item = questionsPool[i];
      if (q.includes(item.label.toLowerCase()) || item.q.toLowerCase().includes(q) || q.includes(item.q.toLowerCase().substring(0, 15))) {
        matchedItem = item;
        break;
      }
    }

    if (matchedItem) {
      if (askedQuestionIds.indexOf(matchedItem.id) === -1) {
        askedQuestionIds.push(matchedItem.id);
      }
      return matchedItem.a;
    }

    // Check generic fallbacks
    var generic = getGenericResponse(query);
    if (generic) return generic;

    // Default unmatched query fallback
    return "Well, I don't know the answer to that, but you can ask the real Wassim on the <a href='contact.html' style='color:#22eaaa;text-decoration:underline;'>contact page</a>!";
  };

  // Send Message Logic
  var handleSend = function(text) {
    if (!text || text.trim() === '') return;
    
    // Add user message
    var userMsgHtml = `<div class="ai-chat-message user">${text}</div>`;
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
      
      // Refresh suggestions
      renderSuggestions();
      
      if (askedQuestionIds.length === 10) {
        var finalMsg = `<div class="ai-chat-message assistant" style="font-style: italic; opacity: 0.85;">I suppose you don't have any more questions! If you do, feel free to contact the real Wassim on the <a href="contact.html" style="color:#22eaaa;text-decoration:underline;">contact page</a>.</div>`;
        chatBody.append(finalMsg);
      } else {
        chatBody.append(suggestions);
      }
      scrollToBottom();
    }, 1000);
  };

  // Bind click on suggestions
  chatBody.on('click', '.ai-chat-suggestion', function() {
    var text = $(this).attr('data-q');
    var id = parseInt($(this).attr('data-id'));
    if (id && askedQuestionIds.indexOf(id) === -1) {
      askedQuestionIds.push(id);
    }
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

  // Initial suggestions render
  renderSuggestions();
};

var initTimelineAnimation = function() {
  var items = $('.timeline-item');
  if (items.length === 0) return;

  var checkScroll = function() {
    items.each(function() {
      var item = $(this);
      var itemTop = item.offset().top;
      var winBottom = $(window).scrollTop() + $(window).height();
      
      // If item is scrolled into view (with a small offset)
      if (winBottom > itemTop + 40) {
        item.addClass('visible');
      }
    });
  };

  // Bind events and check immediately
  $(window).on('scroll resize', checkScroll);
  setTimeout(checkScroll, 100);
};

var initLoungeAudioPlayer = function() {
  var playerHtml = `
    <div class="dynamic-island-widget" id="lounge-player-widget">
      <div class="dynamic-island-capsule" id="lounge-island-capsule" title="Click to toggle player & info">
        
        <!-- Collapsed Content -->
        <div class="island-collapsed-content">
          <div class="island-collapsed-inline">
            <span class="island-collapsed-chip">
              <i class="icon-location2"></i>
              <span id="visitor-location-short">Detecting...</span>
            </span>
            <span class="island-collapsed-chip">
              <span id="visitor-weather-short">⛅ --</span>
            </span>
            <span class="island-collapsed-chip">
              <i class="icon-clock2"></i>
              <span id="visitor-time-short">--:--</span>
            </span>
          </div>
          <div class="island-collapsed-right">
            <div class="lounge-eq-bars">
              <span></span><span></span><span></span><span></span>
            </div>
          </div>
        </div>

        <!-- Expanded Content -->
        <div class="island-expanded-content">
          <div class="island-expanded-top">
            <span class="island-location-badge">
              <i class="icon-location2"></i> <span id="expanded-location-text">Detecting...</span>
            </span>
            <span id="expanded-weather-badge" style="font-size:11px;"></span>
            <span class="island-time-badge">
              <i class="icon-clock2"></i> <span id="expanded-time-text">--:--</span>
            </span>
          </div>

          <div class="island-expanded-bottom">
            <div class="island-track-details">
              <span class="lounge-track-title"><i class="icon-music" style="color:#22eaaa; font-size:11px; margin-right:4px;"></i> Lounge Jazz Vibes</span>
              <span class="lounge-track-subtitle">Low-key Ambient</span>
            </div>
            <div class="lounge-controls">
              <button class="lounge-btn" id="lounge-card-play-btn" title="Play / Pause">
                <i class="icon-play2" id="lounge-card-play-icon"></i>
              </button>
              <button class="lounge-btn" id="lounge-mute-btn" title="Mute / Unmute">
                <i class="icon-volume-medium" id="lounge-mute-icon"></i>
              </button>
              <input type="range" class="lounge-volume-slider" id="lounge-volume-slider" min="0" max="1" step="0.02" value="0.17" title="Volume">
            </div>
          </div>
        </div>

      </div>
      <audio id="lounge-audio" loop preload="auto">
        <source src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3" type="audio/mpeg">
      </audio>
    </div>
  `;
  $('body').append(playerHtml);

  var widget = $('#lounge-player-widget');
  var capsule = $('#lounge-island-capsule');
  var audio = $('#lounge-audio')[0];
  var cardPlayBtn = $('#lounge-card-play-btn');
  var cardPlayIcon = $('#lounge-card-play-icon');
  var muteBtn = $('#lounge-mute-btn');
  var muteIcon = $('#lounge-mute-icon');
  var volumeSlider = $('#lounge-volume-slider');

  // Real-time visitor clock logic
  var updateVisitorTime = function() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    var minutesStr = minutes < 10 ? '0' + minutes : minutes;
    var timeFormatted = hours + ':' + minutesStr + ' ' + ampm;

    $('#visitor-time-short').text(timeFormatted);
    $('#expanded-time-text').text(timeFormatted);
  };

  updateVisitorTime();
  setInterval(updateVisitorTime, 1000);

  // Cached Geolocation & Open-Meteo Weather (High precision)
  var formatWeather = function(temp, code, isDay) {
    var symbol = '☀️';
    if (isDay === 0) symbol = '🌙';
    if (code >= 1 && code <= 3) symbol = '⛅';
    if (code >= 45 && code <= 48) symbol = '🌫️';
    if (code >= 51 && code <= 82) symbol = '🌧️';
    if (code >= 95) symbol = '⛈️';
    return symbol + ' ' + Math.round(temp) + '°C';
  };

  // ─── Visitor Analytics & Notification ─────────────────────────────────────

  // Common automated bot & crawler patterns (safe against real mobile/desktop browsers)
  var BOT_PATTERNS = [
    /Googlebot/i, /bingbot/i, /Baiduspider/i, /YandexBot/i,
    /DuckDuckBot/i, /AhrefsBot/i, /SemrushBot/i, /MJ12bot/i,
    /DotBot/i, /PetalBot/i, /Bytespider/i, /GPTBot/i, /ChatGPT-User/i,
    /Claude-Web/i, /anthropic/i, /cohere/i, /HeadlessChrome/i, /PhantomJS/i,
    /python-requests/i, /curl\//i, /wget\//i, /Go-http-client/i
  ];

  var isBot = BOT_PATTERNS.some(function(rx) {
    return rx.test(navigator.userAgent);
  });

  // Track session start time across whole session
  var sessionStartTime = parseInt(sessionStorage.getItem('portfolioSessionStart') || '0', 10);
  if (!sessionStartTime) {
    sessionStartTime = Date.now();
    sessionStorage.setItem('portfolioSessionStart', sessionStartTime.toString());
  }

  var ACTION_COUNTS_KEY = 'portfolioActionCounts';
  var PAGE_DURATIONS_KEY = 'portfolioPageDurationsMs';
  var PAGE_SCROLL_KEY = 'portfolioPageMaxScroll';
  var PAGE_ENTERED_AT_KEY = 'portfolioCurrentPageEnteredAt';
  var VISIT_MARKED_KEY = 'portfolioVisitMarked';

  var readSessionObject = function(key) {
    try {
      var raw = sessionStorage.getItem(key);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  };

  var writeSessionObject = function(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  };

  var formatDuration = function(totalSeconds) {
    var sec = Math.max(0, Math.round(totalSeconds));
    var hrs = Math.floor(sec / 3600);
    var mins = Math.floor((sec % 3600) / 60);
    var rem = sec % 60;
    if (hrs > 0) return hrs + 'h ' + mins + 'm ' + rem + 's';
    if (mins > 0) return mins + 'm ' + rem + 's';
    return rem + 's';
  };

  var addPageDuration = function(pageName, deltaMs) {
    if (!pageName || !deltaMs || deltaMs <= 0) return;
    var durations = readSessionObject(PAGE_DURATIONS_KEY);
    var prev = parseInt(durations[pageName] || 0, 10);
    durations[pageName] = prev + deltaMs;
    writeSessionObject(PAGE_DURATIONS_KEY, durations);
  };

  var lastDurationFlushAt = 0;
  var flushCurrentPageDuration = function() {
    var now = Date.now();
    if (now - lastDurationFlushAt < 250) return;
    lastDurationFlushAt = now;

    var enteredAt = parseInt(sessionStorage.getItem(PAGE_ENTERED_AT_KEY) || '0', 10);
    if (!enteredAt) {
      sessionStorage.setItem(PAGE_ENTERED_AT_KEY, now.toString());
      return;
    }

    addPageDuration(currentPageName, now - enteredAt);
    sessionStorage.setItem(PAGE_ENTERED_AT_KEY, now.toString());
  };

  // Track page navigation flow across the session
  var pageFlow = [];
  try {
    pageFlow = JSON.parse(sessionStorage.getItem('visitorPageFlow') || '[]');
  } catch (e) { pageFlow = []; }

  var currentPath = window.location.pathname.split('/').pop() || 'index.html';
  var currentPageName = currentPath.replace('.html', '') || 'home';
  if (currentPageName === 'index') currentPageName = 'home';

  if (pageFlow.length === 0 || pageFlow[pageFlow.length - 1] !== currentPageName) {
    pageFlow.push(currentPageName);
    sessionStorage.setItem('visitorPageFlow', JSON.stringify(pageFlow));
  }
  sessionStorage.setItem(PAGE_ENTERED_AT_KEY, Date.now().toString());

  // Track interaction actions
  var recordAction = function(action) {
    try {
      var actions = JSON.parse(sessionStorage.getItem('portfolioActions') || '[]');
      if (actions.indexOf(action) === -1) {
        actions.push(action);
        sessionStorage.setItem('portfolioActions', JSON.stringify(actions));
      }
      var actionCounts = readSessionObject(ACTION_COUNTS_KEY);
      var prevCount = parseInt(actionCounts[action] || 0, 10);
      actionCounts[action] = prevCount + 1;
      writeSessionObject(ACTION_COUNTS_KEY, actionCounts);
    } catch (e) {}
  };

  // Track scroll depth
  var trackScrollDepth = function() {
    var docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - window.innerHeight;
    var scrollPct = docHeight > 0 ? Math.min(100, Math.round((window.scrollY / docHeight) * 100)) : 100;
    var prevMax = parseInt(sessionStorage.getItem('portfolioMaxScroll') || '0', 10);
    if (scrollPct > prevMax) {
      sessionStorage.setItem('portfolioMaxScroll', scrollPct.toString());
    }

    var pageMaxScroll = readSessionObject(PAGE_SCROLL_KEY);
    var prevPageMax = parseInt(pageMaxScroll[currentPageName] || '0', 10);
    if (scrollPct > prevPageMax) {
      pageMaxScroll[currentPageName] = scrollPct;
      writeSessionObject(PAGE_SCROLL_KEY, pageMaxScroll);
    }
  };
  $(window).on('scroll', trackScrollDepth);
  setTimeout(trackScrollDepth, 500);

  window.addEventListener('pagehide', function() { flushCurrentPageDuration(); }, { capture: true });
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
      flushCurrentPageDuration();
    } else if (document.visibilityState === 'visible') {
      sessionStorage.setItem(PAGE_ENTERED_AT_KEY, Date.now().toString());
    }
  });

  // Global benign interaction listeners
  $(document).on('click', 'a[href*="linkedin.com"]', function() { recordAction("Viewed LinkedIn Profile"); });
  $(document).on('click', 'a[href*="github.com"]', function() { recordAction("Viewed GitHub Profile/Repo"); });
  $(document).on('click', 'a[href*="mail"], a[href*="compose"]', function() { recordAction("Clicked Contact Email"); });
  $(document).on('click', '.btn-cool-cv', function() { recordAction("Viewed/Downloaded CV"); });
  $(document).on('click', '#cmd-palette-btn', function() { recordAction("Used Command Palette (Ctrl+K)"); });
  $(document).on('click', '#ai-chat-toggle-btn', function() { recordAction("Opened AI Chatbot"); });
  $(document).on('click', '#lounge-island-capsule', function() { recordAction("Toggled Dynamic Island"); });
  $(document).on('click', '#github-repos-container .probootstrap-card a, #home-projects-container .probootstrap-card a', function() {
    var projectName = $(this).closest('.probootstrap-card').find('.probootstrap-card-heading').first().text().trim();
    recordAction(projectName ? ('Opened Project: ' + projectName) : 'Opened Project Card');
  });
  $(document).on('focusin', '#contact-form input, #contact-form textarea', function() {
    if (!sessionStorage.getItem('portfolioContactFormStarted')) {
      sessionStorage.setItem('portfolioContactFormStarted', 'true');
      recordAction('Started Contact Form');
    }
  });
  $(document).on('submit', '#contact-form', function() { recordAction('Submitted Contact Form'); });

  // Get clean referral source
  var getCleanReferrer = function() {
    var stored = sessionStorage.getItem('portfolioReferrer');
    if (stored) return stored;
    var ref = document.referrer;
    if (!ref) {
      stored = "Direct Entry / Bookmark";
    } else if (ref.indexOf('linkedin.com') !== -1) {
      stored = "LinkedIn (linkedin.com)";
    } else if (ref.indexOf('github.com') !== -1) {
      stored = "GitHub (github.com)";
    } else if (ref.indexOf('google.') !== -1) {
      stored = "Google Search";
    } else if (ref.indexOf('t.co') !== -1 || ref.indexOf('twitter.com') !== -1 || ref.indexOf('x.com') !== -1) {
      stored = "Twitter / X";
    } else if (ref.indexOf('facebook.com') !== -1 || ref.indexOf('instagram.com') !== -1) {
      stored = "Social Media";
    } else {
      try {
        var u = new URL(ref);
        stored = u.hostname;
      } catch (e) {
        stored = ref.substring(0, 50);
      }
    }
    sessionStorage.setItem('portfolioReferrer', stored);
    return stored;
  };

  // Get clean OS and Browser description
  var getDeviceContext = function() {
    var ua = navigator.userAgent;
    var os = "Unknown OS";
    if (/iPhone/i.test(ua)) os = "iPhone (iOS)";
    else if (/iPad/i.test(ua)) os = "iPad (iPadOS)";
    else if (/Android/i.test(ua)) os = "Android";
    else if (/Mac OS X|macOS/i.test(ua)) os = "macOS";
    else if (/Windows NT 10.0/i.test(ua)) os = "Windows 10/11";
    else if (/Windows/i.test(ua)) os = "Windows";
    else if (/Linux/i.test(ua)) os = "Linux";

    var browser = "Browser";
    if (/Edg\//i.test(ua)) browser = "Edge";
    else if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) browser = "Chrome";
    else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) browser = "Safari";
    else if (/Firefox\//i.test(ua)) browser = "Firefox";
    else if (/SamsungBrowser/i.test(ua)) browser = "Samsung Internet";

    var screenRes = window.screen ? (window.screen.width + "×" + window.screen.height) : "Unknown";
    var isMobileDevice = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
    return {
      os: os,
      browser: browser,
      screen: screenRes,
      is_mobile: isMobileDevice
    };
  };

  var getNetworkContext = function() {
    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!conn) return "unknown";
    var type = conn.effectiveType || conn.type || "unknown";
    var saveData = conn.saveData ? "save-data" : "normal";
    return type + " (" + saveData + ")";
  };

  var sendWeb3Alert = function(country, isFinalUpdate) {
    flushCurrentPageDuration();
    var elapsedSeconds = 0;
    var durationText = '0s';

    var currentFlow = [];
    try {
      currentFlow = JSON.parse(sessionStorage.getItem('visitorPageFlow') || '[]');
    } catch (e) { currentFlow = pageFlow; }
    var flowForEmail = currentFlow.length > 0 ? currentFlow.slice() : [currentPageName];
    if (isFinalUpdate && flowForEmail[flowForEmail.length - 1] !== 'exit') {
      flowForEmail.push('exit');
    }
    var flowString = flowForEmail.join(' → ');

    var tz = "Unknown";
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown"; } catch (e) {}
    var lang = navigator.language || "en";
    var referrer = getCleanReferrer();
    var device = getDeviceContext();
    var network = getNetworkContext();

    var actions = [];
    try { actions = JSON.parse(sessionStorage.getItem('portfolioActions') || '[]'); } catch (e) {}
    var actionCounts = readSessionObject(ACTION_COUNTS_KEY);

    var maxScroll = sessionStorage.getItem('portfolioMaxScroll') || "0";
    var timeStr = new Date().toLocaleString();
    var pageScroll = readSessionObject(PAGE_SCROLL_KEY);
    var pageDurationsMs = readSessionObject(PAGE_DURATIONS_KEY);
    var pageDurationsSeconds = {};
    var pageDurationsHuman = {};
    var totalActiveMs = 0;
    Object.keys(pageDurationsMs).forEach(function(page) {
      var ms = Math.max(0, parseInt(pageDurationsMs[page] || 0, 10));
      totalActiveMs += ms;
      var sec = Math.round(ms / 1000);
      pageDurationsSeconds[page] = sec;
      pageDurationsHuman[page] = formatDuration(sec);
    });
    var computedActiveSeconds = Math.round(totalActiveMs / 1000);
    if (computedActiveSeconds > 0) {
      elapsedSeconds = computedActiveSeconds;
    } else {
      elapsedSeconds = Math.max(1, Math.round((Date.now() - sessionStartTime) / 1000));
    }
    durationText = formatDuration(elapsedSeconds);

    var visitCount = 1;
    try {
      visitCount = parseInt(localStorage.getItem('portfolioVisitCount') || '0', 10);
      if (!sessionStorage.getItem(VISIT_MARKED_KEY)) {
        visitCount += 1;
        localStorage.setItem('portfolioVisitCount', visitCount.toString());
        sessionStorage.setItem(VISIT_MARKED_KEY, 'true');
      }
      if (!visitCount || visitCount < 1) visitCount = 1;
    } catch (e) {
      visitCount = 1;
    }

    var geoData = readSessionObject('visitorGeoData');
    var analyticsReport = {
      generated_at: new Date().toISOString(),
      session: {
        started_at: new Date(sessionStartTime).toISOString(),
        ended_at: new Date().toISOString(),
        duration_seconds: elapsedSeconds,
        duration_human: durationText,
        visitor_type: visitCount > 1 ? "returning" : "new",
        visit_count: visitCount
      },
      journey: {
        entry_page: flowForEmail[0] || currentPageName,
        exit_page: flowForEmail[flowForEmail.length - 1] || currentPageName,
        page_flow: flowForEmail,
        page_flow_text: flowString,
        pages_viewed: flowForEmail.filter(function(x) { return x !== 'exit'; }).length,
        page_durations_seconds: pageDurationsSeconds,
        page_durations_human: pageDurationsHuman
      },
      engagement: {
        max_scroll_percent: parseInt(maxScroll, 10) || 0,
        max_scroll_by_page_percent: pageScroll,
        actions_unique: actions,
        action_counts: actionCounts,
        cta_funnel: {
          cv_clicks: parseInt(actionCounts['Viewed/Downloaded CV'] || 0, 10),
          github_clicks: parseInt(actionCounts['Viewed GitHub Profile/Repo'] || 0, 10),
          linkedin_clicks: parseInt(actionCounts['Viewed LinkedIn Profile'] || 0, 10),
          contact_email_clicks: parseInt(actionCounts['Clicked Contact Email'] || 0, 10),
          contact_form_started: parseInt(actionCounts['Started Contact Form'] || 0, 10),
          contact_form_submitted: parseInt(actionCounts['Submitted Contact Form'] || 0, 10),
          ai_chat_opens: parseInt(actionCounts['Opened AI Chatbot'] || 0, 10)
        }
      },
      context: {
        country: country || "Unknown",
        weather: geoData.weatherText || "",
        timezone: tz,
        language: lang,
        traffic_source: referrer,
        network: network,
        device: device,
        visit_time_local: timeStr
      }
    };

    var emailDivider = '────────────────────────────────';
    var fmtRow = function(emoji, label, value) {
      return emoji + ' ' + label + ': ' + value;
    };

    var formatObjectLines = function(obj, suffix) {
      var keys = Object.keys(obj || {});
      if (keys.length === 0) return ['• none'];
      keys.sort();
      return keys.map(function(key) {
        return '• ' + key + ': ' + obj[key] + (suffix || '');
      });
    };

    var formatActionCountLines = function(obj) {
      var keys = Object.keys(obj || {});
      if (keys.length === 0) return ['• none'];
      keys.sort(function(a, b) {
        return (parseInt(obj[b] || 0, 10) - parseInt(obj[a] || 0, 10));
      });
      return keys.map(function(key) {
        return '• ' + key + ': ' + (parseInt(obj[key] || 0, 10));
      });
    };

    var emailLines = [
      '📊 Visitor Analytics Report',
      emailDivider,
      '',
      '🧭 Session Overview',
      fmtRow('👤', 'Visitor', analyticsReport.session.visitor_type + ' (visit #' + analyticsReport.session.visit_count + ')'),
      fmtRow('⏱️', 'Active time', analyticsReport.session.duration_human + ' (' + analyticsReport.session.duration_seconds + 's)'),
      fmtRow('🕒', 'Started', analyticsReport.session.started_at),
      fmtRow('🕓', 'Ended', analyticsReport.session.ended_at),
      '',
      '🗺️ Journey',
      fmtRow('🚪', 'Entry page', analyticsReport.journey.entry_page),
      fmtRow('🏁', 'Exit page', analyticsReport.journey.exit_page),
      fmtRow('🔀', 'Flow', analyticsReport.journey.page_flow_text),
      fmtRow('📄', 'Pages viewed', analyticsReport.journey.pages_viewed),
      '',
      '⏳ Time per page',
      formatObjectLines(analyticsReport.journey.page_durations_human, '').join('\n'),
      '',
      '📈 Engagement',
      fmtRow('📜', 'Max scroll', analyticsReport.engagement.max_scroll_percent + '%'),
      '',
      '📑 Scroll by page',
      formatObjectLines(analyticsReport.engagement.max_scroll_by_page_percent, '%').join('\n'),
      '',
      '⚡ Actions (count)',
      formatActionCountLines(analyticsReport.engagement.action_counts).join('\n'),
      '',
      '🎯 CTA Funnel',
      fmtRow('📄', 'CV clicks', analyticsReport.engagement.cta_funnel.cv_clicks),
      fmtRow('🐙', 'GitHub clicks', analyticsReport.engagement.cta_funnel.github_clicks),
      fmtRow('💼', 'LinkedIn clicks', analyticsReport.engagement.cta_funnel.linkedin_clicks),
      fmtRow('✉️', 'Email clicks', analyticsReport.engagement.cta_funnel.contact_email_clicks),
      fmtRow('📝', 'Form started', analyticsReport.engagement.cta_funnel.contact_form_started),
      fmtRow('✅', 'Form submitted', analyticsReport.engagement.cta_funnel.contact_form_submitted),
      fmtRow('🤖', 'AI chat opens', analyticsReport.engagement.cta_funnel.ai_chat_opens),
      '',
      '🌍 Context',
      fmtRow('📍', 'Country', analyticsReport.context.country),
      fmtRow('🌤️', 'Weather', analyticsReport.context.weather || 'N/A'),
      fmtRow('🧭', 'Timezone', analyticsReport.context.timezone),
      fmtRow('🗣️', 'Language', analyticsReport.context.language),
      fmtRow('🔗', 'Source', analyticsReport.context.traffic_source),
      fmtRow('📶', 'Network', analyticsReport.context.network),
      fmtRow('💻', 'Device', (analyticsReport.context.device.is_mobile ? 'mobile' : 'desktop') + ' | ' + analyticsReport.context.device.os + ' | ' + analyticsReport.context.device.browser + ' | ' + analyticsReport.context.device.screen),
      fmtRow('🕘', 'Local visit time', analyticsReport.context.visit_time_local)
    ];

    var emailMessage = emailLines.join('\n');

    var payload = {
      access_key: '7d50b277-b05f-4d36-a340-db1f5dcac793',
      subject: '📊 Visitor Analytics: ' + (country || 'Unknown') + ' | ' + (flowForEmail[0] || currentPageName) + ' → ' + (flowForEmail[flowForEmail.length - 1] || currentPageName) + ' (' + durationText + ')',
      from_name: 'Portfolio Visitor Alert',
      message: emailMessage,
      flow: flowString
    };

    if (typeof fetch === 'function') {
      try {
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true
        }).catch(function() {});
      } catch (err) {
        $.ajax({
          url: 'https://api.web3forms.com/submit',
          method: 'POST',
          dataType: 'json',
          data: payload
        });
      }
    } else {
      $.ajax({
        url: 'https://api.web3forms.com/submit',
        method: 'POST',
        dataType: 'json',
        data: payload
      });
    }
  };

  var INTERNAL_NAV_UNTIL_KEY = 'portfolioInternalNavUntil';
  var INTERNAL_NAV_WINDOW_MS = 4000;
  var navUntilAtBoot = parseInt(sessionStorage.getItem(INTERNAL_NAV_UNTIL_KEY) || '0', 10);
  if (navUntilAtBoot > Date.now()) {
    // Previous page marked an internal navigation; clear it once the next page has loaded.
    sessionStorage.removeItem(INTERNAL_NAV_UNTIL_KEY);
  }

  var isLikelyInternalLink = function(anchor) {
    if (!anchor || !anchor.getAttribute) return false;
    var href = anchor.getAttribute('href') || '';
    if (!href || href === '#' || href.indexOf('javascript:') === 0) return false;
    if (href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) return false;

    try {
      var url = new URL(href, window.location.href);
      return url.origin === window.location.origin;
    } catch (e) {
      return false;
    }
  };

  var markInternalNavigation = function() {
    sessionStorage.setItem(INTERNAL_NAV_UNTIL_KEY, (Date.now() + INTERNAL_NAV_WINDOW_MS).toString());
  };

  var isInternalNavigationInProgress = function() {
    var until = parseInt(sessionStorage.getItem(INTERNAL_NAV_UNTIL_KEY) || '0', 10);
    return until > Date.now();
  };

  // Mark in-site page transitions so they are not treated as session exits.
  document.addEventListener('click', function(e) {
    var target = e.target;
    var anchor = target && target.closest ? target.closest('a') : null;
    if (isLikelyInternalLink(anchor)) {
      markInternalNavigation();
    }
  }, true);

  // Send one notification email per browser session via Web3Forms
  var notifyVisitorEntry = function(country) {
    if (isBot) return;

    var hasSent = function() {
      return sessionStorage.getItem('visitorNotified') === 'true';
    };
    var markSent = function() {
      sessionStorage.setItem('visitorNotified', 'true');
    };

    // Send once when the user actually exits the site session.
    var handleExit = function() {
      if (hasSent()) return;
      if (isInternalNavigationInProgress()) return;
      markSent();
      sendWeb3Alert(country, true);
    };

    window.addEventListener('pagehide', handleExit, { capture: true });
    window.addEventListener('beforeunload', handleExit, { capture: true });
  };

  var applyGeoAndWeather = function(country, weatherText) {
    var countryDisplay = country || 'Earth';
    $('#visitor-location-short').text(countryDisplay);
    $('#visitor-weather-short').text(weatherText || '⛅ --');
    $('#expanded-location-text').text(countryDisplay);
    if (weatherText) {
      $('#expanded-weather-badge').html('<span style="color:#22eaaa; font-weight:500;">' + weatherText + '</span>');
    } else {
      $('#expanded-weather-badge').text('');
    }
    notifyVisitorEntry(countryDisplay);
  };

  var fetchVisitorLocationAndWeather = function() {
    // Check if cached in sessionStorage
    var cached = sessionStorage.getItem('visitorGeoData');
    if (cached) {
      try {
        var cachedObj = JSON.parse(cached);
        applyGeoAndWeather(cachedObj.country, cachedObj.weatherText);
        return;
      } catch (e) {}
    }

    // Fetch IP Geolocation
    $.getJSON('https://ipapi.co/json/', function(data) {
      var country = data.country_name || data.country || 'Tunisia';
      var lat = data.latitude;
      var lon = data.longitude;

      if (lat && lon) {
        // Fetch Real Weather from Open-Meteo with timezone=auto
        $.getJSON('https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&current_weather=true&timezone=auto', function(weatherRes) {
          var w = weatherRes.current_weather;
          var weatherText = formatWeather(w.temperature, w.weathercode, w.is_day);
          sessionStorage.setItem('visitorGeoData', JSON.stringify({ country: country, weatherText: weatherText }));
          applyGeoAndWeather(country, weatherText);
        }).fail(function() {
          sessionStorage.setItem('visitorGeoData', JSON.stringify({ country: country, weatherText: '' }));
          applyGeoAndWeather(country, '');
        });
      } else {
        sessionStorage.setItem('visitorGeoData', JSON.stringify({ country: country, weatherText: '' }));
        applyGeoAndWeather(country, '');
      }
    }).fail(function() {
      // Fallback Geolocation API
      $.getJSON('https://ipwho.is/', function(data2) {
        var country = data2.country || 'Tunisia';
        var lat = data2.latitude;
        var lon = data2.longitude;
        if (lat && lon) {
          $.getJSON('https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&current_weather=true&timezone=auto', function(weatherRes) {
            var w = weatherRes.current_weather;
            var weatherText = formatWeather(w.temperature, w.weathercode, w.is_day);
            sessionStorage.setItem('visitorGeoData', JSON.stringify({ country: country, weatherText: weatherText }));
            applyGeoAndWeather(country, weatherText);
          }).fail(function() {
            sessionStorage.setItem('visitorGeoData', JSON.stringify({ country: country, weatherText: '' }));
            applyGeoAndWeather(country, '');
          });
        } else {
          sessionStorage.setItem('visitorGeoData', JSON.stringify({ country: country, weatherText: '' }));
          applyGeoAndWeather(country, '');
        }
      }).fail(function() {
        sessionStorage.setItem('visitorGeoData', JSON.stringify({ country: 'Tunisia', weatherText: '' }));
        applyGeoAndWeather('Tunisia', '');
      });
    });
  };

  fetchVisitorLocationAndWeather();

  // Audio setup: Default volume (17%)
  var defaultVol = 0.17;
  audio.volume = defaultVol;
  volumeSlider.val(defaultVol);

  var isPlaying = false;
  var isTimeRestored = false;
  var targetSavedTime = parseFloat(sessionStorage.getItem('loungeAudioTime') || '0');

  // Safely restore timestamp only when audio is ready
  var applySavedTime = function() {
    if (!isTimeRestored && targetSavedTime > 0) {
      try {
        audio.currentTime = targetSavedTime;
        isTimeRestored = true;
      } catch (e) {}
    } else if (targetSavedTime <= 0) {
      isTimeRestored = true;
    }
  };

  audio.onloadedmetadata = applySavedTime;
  audio.oncanplay = applySavedTime;

  // Protect sessionStorage: ONLY save current time AFTER targetSavedTime has been restored!
  audio.ontimeupdate = function() {
    if (isTimeRestored && audio.currentTime > 0) {
      sessionStorage.setItem('loungeAudioTime', audio.currentTime.toString());
    }
  };

  // Capture exact timestamp right as user clicks a link to leave page
  $(window).on('beforeunload pagehide', function() {
    if (audio && audio.currentTime > 0) {
      sessionStorage.setItem('loungeAudioTime', audio.currentTime.toString());
    }
  });

  var playAudio = function() {
    applySavedTime();
    try {
      var playPromise = audio.play();
      if (playPromise !== undefined && typeof playPromise.then === 'function') {
        playPromise.then(function() {
          isPlaying = true;
          widget.addClass('playing');
          cardPlayIcon.removeClass('icon-play2').addClass('icon-pause2');
          sessionStorage.setItem('loungeAudioState', 'playing');
          try { localStorage.setItem('portfolioMusicPreference', 'enabled'); } catch (err) {}
        }).catch(function(e) {
          $(document).one('click scroll keydown touchstart', function() {
            if (!isPlaying) {
              playAudio();
            }
          });
        });
      } else {
        isPlaying = true;
        widget.addClass('playing');
        cardPlayIcon.removeClass('icon-play2').addClass('icon-pause2');
        sessionStorage.setItem('loungeAudioState', 'playing');
        try { localStorage.setItem('portfolioMusicPreference', 'enabled'); } catch (err) {}
      }
    } catch (e) {
      $(document).one('click scroll keydown touchstart', function() {
        if (!isPlaying) {
          playAudio();
        }
      });
    }
  };

  var pauseAudio = function() {
    audio.pause();
    isPlaying = false;
    widget.removeClass('playing');
    cardPlayIcon.removeClass('icon-pause2').addClass('icon-play2');
    sessionStorage.setItem('loungeAudioState', 'paused');
  };

  var togglePlay = function() {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  // Capsule Click -> Toggle Island Expansion
  capsule.on('click', function(e) {
    if ($(e.target).closest('.lounge-controls').length > 0) {
      return;
    }
    
    widget.toggleClass('expanded');
    if (!isPlaying) {
      playAudio();
    }
  });

  // Collapse island when clicking outside
  $(document).on('click', function(e) {
    if ($(e.target).closest('#lounge-player-widget').length === 0) {
      widget.removeClass('expanded');
    }
  });

  // Play / Pause button
  cardPlayBtn.on('click', function(e) {
    e.stopPropagation();
    togglePlay();
  });

  // Volume slider input
  volumeSlider.on('input change', function(e) {
    e.stopPropagation();
    var val = parseFloat($(this).val());
    audio.volume = val;
    if (val === 0) {
      muteIcon.removeClass('icon-volume-medium icon-volume-high').addClass('icon-volume-mute2');
    } else {
      muteIcon.removeClass('icon-volume-mute2').addClass('icon-volume-medium');
    }
  });

  // Mute button click
  muteBtn.on('click', function(e) {
    e.stopPropagation();
    if (audio.volume > 0) {
      audio.dataset.prevVolume = audio.volume;
      audio.volume = 0;
      volumeSlider.val(0);
      muteIcon.removeClass('icon-volume-medium icon-volume-high').addClass('icon-volume-mute2');
    } else {
      var prev = parseFloat(audio.dataset.prevVolume) || defaultVol;
      audio.volume = prev;
      volumeSlider.val(prev);
      muteIcon.removeClass('icon-volume-mute2').addClass('icon-volume-medium');
    }
  });

  // Auto-play only for users who previously opted in.
  var musicPref = '';
  try {
    musicPref = localStorage.getItem('portfolioMusicPreference') || '';
  } catch (e) {}
  if (musicPref === 'enabled' && sessionStorage.getItem('loungeAudioState') !== 'paused') {
    playAudio();
  }
};

});