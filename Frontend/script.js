// styling code for index.html
// 001
// Define API URL
const API_URL = 'http://localhost:5000/api';

// Typewriter Effect
const typewriterText = document.querySelector(".typewriter-text");
const words = ["Social Media", "Blog Writer", "Image Generation"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeWriter() {
  // Only run if typewriterText element exists
  if (!typewriterText) return;
  
  const currentWord = words[wordIndex];

  if (isDeleting) {
    typewriterText.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
    typingSpeed = 50;
  } else {
    typewriterText.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
    typingSpeed = 100;
  }

  if (!isDeleting && charIndex === currentWord.length) {
    isDeleting = true;
    typingSpeed = 1000; // Pause at end of word
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    typingSpeed = 500; // Pause before typing next word
  }

  setTimeout(typeWriter, typingSpeed);
}

// Start the typewriter effect only if the element exists
if (typewriterText) {
  setTimeout(typeWriter, 1000);
}

// 002
// Simple toggle for hamburger menu
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

if (hamburger && navLinks) {
    // Hamburger menu click handler
    hamburger.addEventListener("click", function () {
        navLinks.classList.toggle("active");
    });

    // Close hamburger menu when clicking outside
    document.addEventListener("click", function (e) {
        // Check if the click is outside both the nav-links and hamburger
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            navLinks.classList.remove("active");
        }
    });

    // Close hamburger menu when a nav link is clicked
    const navLinksAnchors = document.querySelectorAll(".nav-links a");
    navLinksAnchors.forEach((link) => {
        link.addEventListener("click", function () {
            navLinks.classList.remove("active");
        });
    });
}

// 003
// Intersection Observer for scroll animations
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");

        // Add animation to stat numbers when they come into view
        if (entry.target.classList.contains("stat-item")) {
          entry.target.querySelector(".stat-number").classList.add("show");
        }

        // Add animation to steps when they come into view
        if (entry.target.classList.contains("step")) {
          setTimeout(() => {
            entry.target.classList.add("show");
          }, Array.from(entry.target.parentNode.children).indexOf(entry.target) * 200);
        }
      }
    });
  },
  { threshold: 0.1 }
);

//  004
// Observe all sections, feature cards, testimonial cards, templates, and steps
const elementsToObserve = document.querySelectorAll(
  "section, .feature-card, .testimonial-card, .template, .step"
);
if (elementsToObserve.length > 0) {
  elementsToObserve.forEach((el) => {
    observer.observe(el);
  });
}

//  005
// Handle form submission for topic search
const topicForms = document.querySelectorAll('form:not(#loginForm):not(.signup-form)');
if (topicForms.length > 0) {
  topicForms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const topicInput = this.querySelector('input[name="topic"]');
      if (topicInput) {
        showLoading();
        window.location.href = `blog-generator.html?topic=${encodeURIComponent(topicInput.value)}`;
        setTimeout(hideLoading, 1000);
      }
    });
  });
}

//  006
// Add animated class to buttons on hover
const animatedButtons = document.querySelectorAll(".btn");
if (animatedButtons.length > 0) {
  animatedButtons.forEach((btn) => {
    btn.addEventListener("mouseenter", function () {
      const icon = this.querySelector("i");
      if (icon) icon.classList.add("fa-beat");
    });

    btn.addEventListener("mouseleave", function () {
      const icon = this.querySelector("i");
      if (icon) icon.classList.remove("fa-beat");
    });
  });
}

//  007
// Add scroll reveal functionality
const scrollRevealElements = document.querySelectorAll(".scroll-reveal");
const scrollRevealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.1 }
);

if (scrollRevealElements.length > 0) {
  scrollRevealElements.forEach((el) => scrollRevealObserver.observe(el));
}

//  008
// Chart Animation
const chartCards = document.querySelectorAll(".chart-card");
const chartObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        const bars = entry.target.querySelectorAll(".chart-bar");
        bars.forEach((bar) => {
          const targetHeight = bar.style.getPropertyValue("--target-height");
          bar.style.height = targetHeight;
        });
      }
    });
  },
  { threshold: 0.2 }
);

if (chartCards.length > 0) {
  chartCards.forEach((card) => {
    chartObserver.observe(card);
  });
}

//  009
// Add loading animation handler
function showLoading() {
  const loadingElement = document.querySelector(".loading");
  if (loadingElement) {
    loadingElement.style.display = "block";
  }
}

function hideLoading() {
  const loadingElement = document.querySelector(".loading");
  if (loadingElement) {
    loadingElement.style.display = "none";
  }
}

//  010
// Enhanced Stats Animation
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const stats = entry.target.querySelectorAll(".stat-item");
        stats.forEach((stat, index) => {
          setTimeout(() => {
            stat.classList.add("show");
            const number = stat.querySelector(".stat-number");
            const value = number.textContent;
            let targetValue;

            // Store the original value as a data attribute
            number.dataset.originalValue = value;

            if (value.includes("K")) {
              targetValue = parseFloat(value) * 1000;
            } else if (value.includes("M")) {
              targetValue = parseFloat(value) * 1000000;
            } else if (value.includes("%")) {
              targetValue = parseFloat(value);
            } else {
              targetValue = parseFloat(value);
            }

            // Only animate if not already animated
            if (!number.dataset.animated) {
              number.textContent = "0";
              animateValue(number, 0, targetValue, 2000);
              number.dataset.animated = "true";
            }
          }, index * 200);
        });
      }
    });
  },
  { threshold: 0.5 }
);

// Observe the stats section
const statsSection = document.querySelector(".stats");
if (statsSection) {
  statsObserver.observe(statsSection);
}

//  011
// Enhanced Value Animation
function animateValue(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.textContent = formatNumber(value);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      // When animation is complete, restore the original format
      element.textContent = element.dataset.originalValue;
    }
  };
  window.requestAnimationFrame(step);
}

//  012
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  } else if (num % 1 !== 0) {
    return num.toFixed(1);
  }
  return num.toString();
}

//  013
// Add hover effects to stats
document.querySelectorAll(".stat-item").forEach((stat) => {
  stat.addEventListener("mouseenter", () => {
    const number = stat.querySelector(".stat-number");
    const originalValue = number.textContent;
    const trend = stat.querySelector(".stat-trend");

    // Add pulse animation
    number.style.animation = "pulse 1s ease-in-out";
    trend.style.transform = "scale(1.1)";

    // Reset after animation
    setTimeout(() => {
      number.style.animation = "";
      trend.style.transform = "";
    }, 1000);
  });
});

//  014
// Feature Popup Functionality
const featureCards = document.querySelectorAll(".feature-card");
const popup = document.querySelector(".feature-popup");
const overlay = document.querySelector(".feature-popup-overlay");
const closeBtn = document.querySelector(".popup-close");

const featureData = {
  "ai-content": {
    icon: "fa-robot",
    title: "AI Content Generator",
    description: "Create high-quality blog posts with our AI assistant.",
    details:
      "Our advanced AI uses state-of-the-art language models to help you craft engaging content that resonates with your audience. Get suggestions, overcome writer's block, and optimize your content for maximum impact.",
  },
  templates: {
    icon: "fa-palette",
    title: "Beautiful Templates",
    description: "Choose from hundreds of professionally designed templates.",
    details:
      "Each template is fully responsive and customizable to match your brand identity and content style. Make your blog stand out from the crowd with our carefully crafted designs.",
  },
  seo: {
    icon: "fa-magnifying-glass",
    title: "SEO Optimization",
    description: "Improve your search engine ranking with built-in SEO tools.",
    details:
      "Get real-time recommendations for keywords, meta descriptions, and content structure to maximize your organic reach. Our SEO tools help you create content that ranks higher in search results.",
  },
  export: {
    icon: "fa-file-export",
    title: "Easy Export",
    description: "Export your blog posts in multiple formats.",
    details:
      "Seamlessly publish to your existing platforms or download your content for offline use. Support for HTML, Markdown, and direct WordPress integration makes publishing a breeze.",
  },
};

featureCards.forEach((card) => {
  card.addEventListener("click", () => {
    const feature = card.dataset.feature;
    const data = featureData[feature];

    // Update popup content
    popup.querySelector(
      ".popup-icon"
    ).innerHTML = `<i class="fa-solid ${data.icon}"></i>`;
    popup.querySelector(".popup-title").textContent = data.title;
    popup.querySelector(".popup-description").textContent = data.description;
    popup.querySelector(".popup-details").textContent = data.details;

    // Show popup and overlay
    popup.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  });
});

//  015
function closePopup() {
  if (popup && overlay) {
    popup.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }
}

// Only add event listeners if popup elements exist
if (closeBtn && overlay) {
  closeBtn.addEventListener("click", closePopup);
  overlay.addEventListener("click", closePopup);

  // Close popup on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closePopup();
    }
  });
}

// Scroll-based decorative elements behavior
const starsContainer = document.querySelector(".stars-container");
const squaresContainer = document.querySelector(".squares-container");
const stars = document.querySelectorAll(
  ".star, .star-small, .star-medium, .star-large"
);
const squares = document.querySelectorAll(".square");

function handleScroll() {
  if (!stars.length && !squares.length) return;

  const scrollPosition = window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollPercentage =
    (scrollPosition / (documentHeight - windowHeight)) * 100;

  // Reduce stars opacity and scale as we scroll down
  stars.forEach((star) => {
    const opacity = Math.max(0, 1 - scrollPercentage * 0.01);
    const scale = Math.max(0.5, 1 - scrollPercentage * 0.005);
    star.style.opacity = opacity;
    star.style.transform = `scale(${scale})`;
  });

  // Increase squares opacity and scale as we scroll down
  squares.forEach((square) => {
    const opacity = Math.min(1, scrollPercentage * 0.01);
    const scale = Math.min(1.5, 1 + scrollPercentage * 0.005);
    square.style.opacity = opacity;
    square.style.transform = `scale(${scale})`;
  });
}

// Add scroll event listener only if we have stars or squares
if (stars.length > 0 || squares.length > 0) {
  window.addEventListener("scroll", handleScroll);
  // Initial call to set initial states
  handleScroll();
}

// Intersection Observer for FAQ items
const faqItems = document.querySelectorAll(".faq-item");

if (faqItems.length > 0) {
  const faqObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.1 }
  );

  // Observe all FAQ items
  faqItems.forEach((item) => {
    faqObserver.observe(item);
  });

  // FAQ Accordion Functionality
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    const icon = item.querySelector(".faq-icon i");

    if (question && answer && icon) {
      question.addEventListener("click", () => {
        const isOpen = answer.style.maxHeight;

        // Close all other FAQ items
        document.querySelectorAll(".faq-answer").forEach((otherAnswer) => {
          if (otherAnswer !== answer) {
            otherAnswer.style.maxHeight = null;
            otherAnswer.parentElement.classList.remove("active");
            const otherIcon = otherAnswer.parentElement.querySelector(".faq-icon i");
            if (otherIcon) {
              otherIcon.classList.remove("fa-minus");
              otherIcon.classList.add("fa-plus");
            }
          }
        });

        // Toggle current FAQ item
        if (isOpen) {
          answer.style.maxHeight = null;
          item.classList.remove("active");
          icon.classList.remove("fa-plus");
          icon.classList.add("fa-minus");
        } else {
          answer.style.maxHeight = answer.scrollHeight + "px";
          item.classList.add("active");
          icon.classList.remove("fa-minus");
          icon.classList.add("fa-plus");
        }
      });
    }
  });
}

// SEO KEYWORDS

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "9f86168378mshcc0a7c32818d149p12ff05jsnf6e51b7bfdbf",
    "X-RapidAPI-Host": "seo-keyword-research-api.p.rapidapi.com",
  },
};

// UI Elements
const elements = {
  input: document.getElementById("user-input"),
  button: document.querySelector(".send-button"),
  loading: document.getElementById("loading"),
  results: document.getElementById("results"),
  totalCount: document.getElementById("totalCount"),
  error: document.getElementById("error"),
  status: document.getElementById("status"),
};

// Show/hide UI elements
function updateUI(state) {
  elements.error.style.display = "none";
  elements.status.style.display = "none";
  elements.status.className = "status";

  switch (state) {
    case "loading":
      elements.loading.style.display = "block";
      elements.button.disabled = true;
      elements.results.innerHTML = "";
      elements.totalCount.innerHTML = "";
      break;
    case "error":
      elements.loading.style.display = "none";
      elements.button.disabled = false;
      break;
    case "success":
      elements.loading.style.display = "none";
      elements.button.disabled = false;
      break;
    default:
      elements.loading.style.display = "none";
      elements.button.disabled = false;
  }
}

// Show error message
function showError(message) {
  elements.error.style.display = "block";
  elements.error.textContent = message;
  updateUI("error");
}

// Show status message
function showStatus(message, type = "success") {
  elements.status.style.display = "block";
  elements.status.className = `status ${type}`;
  elements.status.textContent = message;
}

async function getKeywords(query, country = "us") {
  try {
    // Update UI to loading state
    updateUI("loading");

    // Validate input
    if (!query.trim()) {
      throw new Error("Please enter a keyword");
    }

    // URL encode the query parameter
    const encodedQuery = encodeURIComponent(query);
    const url = `https://seo-keyword-research-api.p.rapidapi.com/keyword-research?keyword=${encodedQuery}&country=${country}`;

    console.log("Fetching from URL:", url);
    const response = await fetch(url, options);

    // Log the raw response
    console.log("Raw Response:", response);
    console.log("Response Status:", response.status);
    console.log(
      "Response Headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Detailed logging of the response
    console.log("API Response Data:", {
      type: typeof data,
      isArray: Array.isArray(data),
      keys: data ? Object.keys(data) : null,
      rawData: JSON.stringify(data, null, 2),
    });

    // Check if we have valid data
    if (!data) {
      throw new Error("No data received from API");
    }

    // Handle API error messages
    if (typeof data === "object" && data.message) {
      throw new Error(`API Error: ${data.message}`);
    }

    // Extract keywords and their metrics
    let keywordData = [];
    let dataSource = null;

    // Try to find the array of keywords in the response
    if (Array.isArray(data)) {
      console.log("Found data as root array");
      keywordData = data;
      dataSource = "root";
    } else if (data.data && Array.isArray(data.data)) {
      console.log("Found data in data property");
      keywordData = data.data;
      dataSource = "data";
    } else if (data.keywords && Array.isArray(data.keywords)) {
      console.log("Found data in keywords property");
      keywordData = data.keywords;
      dataSource = "keywords";
    } else if (data.suggestions && Array.isArray(data.suggestions)) {
      console.log("Found data in suggestions property");
      keywordData = data.suggestions;
      dataSource = "suggestions";
    } else if (data.results && Array.isArray(data.results)) {
      console.log("Found data in results property");
      keywordData = data.results;
      dataSource = "results";
    }

    // Log the structure we found
    console.log("Data source:", dataSource);
    console.log("Data structure found:", {
      hasData: keywordData.length > 0,
      firstItem: keywordData[0],
      totalItems: keywordData.length,
    });

    if (keywordData.length === 0) {
      // If we have data but couldn't find keywords, log the full structure
      console.log(
        "Full API response structure:",
        JSON.stringify(data, null, 2)
      );
      throw new Error(
        "No keywords found in the response. Please try a different keyword or check the API documentation."
      );
    }

    // Map the data to our format with more flexible property mapping
    const formattedData = keywordData.map((item) => {
      // Log each item's structure before processing
      console.log("Processing item structure:", Object.keys(item));

      return {
        keyword:
          item.keyword ||
          item.term ||
          item.suggestion ||
          item.text ||
          item.query ||
          "",
        avgSearches: parseInt(
          item.avg_monthly_searches ||
            item.volume ||
            item.search_volume ||
            item.monthly_searches ||
            "0"
        ),
        competition:
          item.competition_value || item.competition || item.comp || "N/A",
        highCPC:
          item.High_CPC || item.cpc_high || item.max_cpc || item.cpc || "$0.00",
        lowCPC:
          item.Low_CPC || item.cpc_low || item.min_cpc || item.cpc || "$0.00",
      };
    });

    // Sort by average monthly searches
    formattedData.sort((a, b) => b.avgSearches - a.avgSearches);

    // Display results
    if (formattedData.length === 0) {
      showStatus("No keywords found. Try a different search term.", "error");
    } else {
      const top20Keywords = formattedData.slice(0, 20);

      elements.results.innerHTML = top20Keywords
        .map(
          (item, index) => `
          <div class="keyword-item">
            <h3>#${index + 1}. ${item.keyword}</h3>
            <p>Monthly Searches: ${item.avgSearches.toLocaleString()}</p>
            <p>Competition: ${item.competition}</p>
            <p>CPC Range: ${item.lowCPC} - ${item.highCPC}</p>
          </div>
        `
        )
        .join("");

      elements.totalCount.textContent = `Total keywords found: ${formattedData.length}`;
      showStatus(`Successfully found ${formattedData.length} keywords!`);
    }

    // Update UI to success state
    updateUI("success");

    return formattedData.map((item) => item.keyword);
  } catch (error) {
    console.error("Error fetching keywords:", error);
    showError(`Error: ${error.message}`);
    return [];
  }
}

// Initialize keyword search functionality if elements exist
if (elements.button && elements.input) {
  // Add event listeners
  elements.button.addEventListener("click", () => {
    const keyword = elements.input.value.trim();
    if (keyword) {
      getKeywords(keyword);
    } else {
      showError("Please enter a keyword");
    }
  });

  // Allow Enter key to trigger search
  elements.input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const keyword = e.target.value.trim();
      if (keyword) {
        getKeywords(keyword);
      } else {
        showError("Please enter a keyword");
      }
    }
  });

  // Add button to show top relevant keywords
  const filterButton = document.createElement('button');
  filterButton.textContent = 'Show Top Keywords (2500+ Searches)';
  filterButton.className = 'filter-button';
  filterButton.onclick = displayTopRelevantKeywords;

  // Insert the button after the existing search button
  elements.button.parentNode.insertBefore(filterButton, elements.button.nextSibling);
}

// Function to get top relevant keywords from localStorage
function getTopRelevantKeywords() {
    // Get keywords from localStorage
    const storedKeywords = localStorage.getItem('generatedKeywords');
    if (!storedKeywords) {
        console.log('No keywords found in localStorage');
        return [];
    }

    try {
        // Parse the stored keywords
        const keywords = JSON.parse(storedKeywords);
        
        // Filter keywords with average searches >= 2500
        const highVolumeKeywords = keywords.filter(keyword => {
            const avgSearches = typeof keyword === 'object' ? 
                (keyword.avg_monthly_searches || 0) : 0;
            return avgSearches >= 2500;
        });

        // Sort by average searches in descending order
        highVolumeKeywords.sort((a, b) => {
            const aSearches = typeof a === 'object' ? 
                (a.avg_monthly_searches || 0) : 0;
            const bSearches = typeof b === 'object' ? 
                (b.avg_monthly_searches || 0) : 0;
            return bSearches - aSearches;
        });

        // Return top 30 keywords
        return highVolumeKeywords.slice(0, 30);
    } catch (error) {
        console.error('Error processing keywords:', error);
        return [];
    }
}

// Function to display top relevant keywords
function displayTopRelevantKeywords() {
    const topKeywords = getTopRelevantKeywords();
    
    if (topKeywords.length === 0) {
        elements.results.innerHTML = '<div class="error-message">No high-volume keywords found (minimum 2500 monthly searches required)</div>';
        elements.totalCount.textContent = '';
        return;
    }

    elements.results.innerHTML = topKeywords
        .map((item, index) => {
            const avgSearches = typeof item === 'object' ? 
                (item.avg_monthly_searches || 0) : 0;
            const keyword = typeof item === 'object' ? 
                (item.keyword || item.term || item.suggestion || item.text || item.query) : item;
            
            return `
            <div class="keyword-item">
                <h3>#${index + 1}. ${keyword}</h3>
                <p>Monthly Searches: ${avgSearches.toLocaleString()}</p>
                <p>Competition: ${item.competition || item.competition_value || 'N/A'}</p>
                <p>CPC Range: ${item.Low_CPC || item.cpc_low || item.min_cpc || '$0.00'} - ${item.High_CPC || item.cpc_high || item.max_cpc || '$0.00'}</p>
            </div>
            `;
        })
        .join('');

    elements.totalCount.textContent = `Top ${topKeywords.length} high-volume keywords (2500+ monthly searches)`;
    showStatus(`Successfully filtered ${topKeywords.length} high-volume keywords!`);
}

// Add some CSS for the new button
const style = document.createElement('style');
style.textContent = `
    .filter-button {
        background-color: #4CAF50;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-left: 10px;
        font-size: 14px;
        transition: background-color 0.3s;
    }
    
    .filter-button:hover {
        background-color: #45a049;
    }
    
    .error-message {
        color: #ff4444;
        padding: 15px;
        background-color: #ffebee;
        border-radius: 4px;
        margin: 10px 0;
        text-align: center;
    }
`;
document.head.appendChild(style);

// Authentication Functions

// Function to show toast messages
function showToast(message, type = 'success') {
    const backgroundColor = type === 'success' ? '#963FFF' : 
                          type === 'error' ? '#FF4B4B' : 
                          '#963FFF';
    
    Toastify({
        text: message,
        duration: 3000,
        gravity: "right",
        position: "right",
        style: {
            background: backgroundColor,
            boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            fontWeight: '500'
        },
        offset: {
            x: 20,
            y: 20
        },
        stopOnFocus: true,
    }).showToast();
}

// Function to check if passwords match
function checkPasswordMatch() {
  const password = document.getElementById('signupPassword');
  const confirmPassword = document.getElementById('signupConfirmPassword');
  const messageDiv = document.getElementById('passwordMatchMessage');
  
  if (!password || !confirmPassword || !messageDiv) return;
  
  if (confirmPassword.value === '') {
    messageDiv.textContent = '';
  } else if (password.value !== confirmPassword.value) {
    messageDiv.textContent = 'Passwords do not match';
  } else {
    messageDiv.textContent = '';
  }
}

// Add event listeners for password fields
document.addEventListener('DOMContentLoaded', function() {
  const password = document.getElementById('signupPassword');
  const confirmPassword = document.getElementById('signupConfirmPassword');
  
  if (password && confirmPassword) {
    password.addEventListener('input', checkPasswordMatch);
    confirmPassword.addEventListener('input', checkPasswordMatch);
  }
});

// Modify handleSignup function to check password match before submission
async function handleSignup(event) {
    event.preventDefault();
    
  const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
        fullName: name,
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        // Store the token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        showToast('Registration successful! Redirecting...', 'success');
        
        // Redirect to index page after successful signup
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);

    } catch (error) {
        showToast(error.message, 'error');
    }
}

// Function to handle user login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        // Store the token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        showToast('Login successful! Redirecting...', 'success');
        
        // Redirect to index page after successful login
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);

    } catch (error) {
        showToast(error.message, 'error');
    }
}

// Function to check if user is authenticated
function isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
}

// Function to logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Add event listeners for forms if they exist
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.querySelector('.signup-form');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Clear user data from localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Redirect to login page
            window.location.href = 'login.html';
        });
    }

    // Check if user is authenticated when accessing protected pages
    const protectedPages = ['index.html', 'blog-generator.html'];
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // If on a protected page and not authenticated, redirect to login
    if (protectedPages.includes(currentPage) && !isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
    // If on login/signup page and already authenticated, redirect to index
    const authPages = ['login.html', 'signup.html'];
    if (authPages.includes(currentPage) && isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }
});

// Handle forgot password form submission
async function handleForgotPassword(event) {
    event.preventDefault();
    
    const email = document.getElementById('forgotEmail').value;
    
    try {
        const response = await fetch(`${API_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
            showToast('Reset password link sent to your email', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            showToast(data.message || 'Error sending reset link', 'error');
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        showToast('Error sending reset link', 'error');
    }
}

// Handle reset password form submission
async function handleResetPassword(event) {
    event.preventDefault();
    
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }

    // Get token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        showToast('Invalid reset link', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token, newPassword })
        });

        const data = await response.json();

        if (response.ok) {
            showToast('Password reset successful', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            showToast(data.message || 'Error resetting password', 'error');
        }
    } catch (error) {
        console.error('Reset password error:', error);
        showToast('Error resetting password', 'error');
    }
}

// Add event listeners for the forms
document.addEventListener('DOMContentLoaded', function() {
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    }

    const resetPasswordForm = document.getElementById('resetPasswordForm');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', handleResetPassword);
    }
});

// Blog History Management

// Add these functions after the API_URL constant

async function saveBlogToMongoDB(blogData, blogId = null) {
    try {
        const token = localStorage.getItem('token');
        const url = blogId ? `${API_URL}/blogs/${blogId}` : `${API_URL}/blogs`;
        const method = blogId ? 'PATCH' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(blogData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error saving blog');
        }

        showToast(blogId ? 'Blog updated successfully!' : 'Blog saved successfully!', 'success');
        return data.data.blog;
    } catch (error) {
        console.error('Error saving blog:', error);
        showToast(blogId ? 'Error updating blog' : 'Error saving blog', 'error');
        throw error;
    }
}

// Add this at the top level
let currentBlogId = null;

// Modify the existing saveBlogToHistory function
async function saveBlogToHistory() {
    const content = quill.root.innerHTML;
    const title = extractBlogTitle(content) || 'Untitled Blog';
    const preview = extractBlogPreview(content);
    
    try {
        // Extract all image URLs from the content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        const images = tempDiv.getElementsByTagName('img');
        const featuredImage = images.length > 0 ? images[0].src : null;

        // Save to MongoDB
        const blogData = {
        title,
        content,
            summary: preview,
            category: 'General',
            isAIGenerated: true,
            generationPrompt: localStorage.getItem('lastGenerationPrompt') || '',
            featuredImage: featuredImage
        };

        const savedBlog = await saveBlogToMongoDB(blogData, currentBlogId);
        
        // If this was a new blog, store its ID
        if (!currentBlogId && savedBlog._id) {
            currentBlogId = savedBlog._id;
        }
        
        showToast(currentBlogId ? 'Blog updated successfully!' : 'Blog saved successfully!', 'success');
        return savedBlog;
    } catch (error) {
        console.error('Error in saveBlogToHistory:', error);
        showToast(currentBlogId ? 'Error updating blog' : 'Error saving blog', 'error');
    }
}

// Modify the showHistoryModal function
async function showHistoryModal() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/blogs/user/blogs`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        const blogs = Array.isArray(data) ? data : (data.data?.blogs || []);

        const historyList = document.getElementById('historyList');
        historyList.innerHTML = '';
        
        // Add "New Blog" button at the top
        const newBlogButton = document.createElement('button');
        newBlogButton.className = 'new-blog-button';
        newBlogButton.innerHTML = '<i class="fas fa-plus"></i> Create New Blog';
        newBlogButton.addEventListener('click', () => {
            if (confirm('Start a new blog? Current content will be cleared.')) {
                clearCurrentBlog();
                closeHistoryModal();
            }
        });
        historyList.appendChild(newBlogButton);
        
        if (blogs.length === 0) {
            historyList.innerHTML += '<p style="text-align: center; color: #636e72;">No blog history found</p>';
            return;
        }
        
        blogs.forEach((blog) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="history-item-header">
                    <h4 class="history-item-title">${blog.title}</h4>
                    <span class="history-item-date">${formatDate(blog.createdAt)}</span>
                </div>
                <p class="history-item-preview">${blog.summary || 'No preview available'}</p>
            `;
            
            historyItem.addEventListener('click', () => {
                if (confirm('Load this blog? Current content will be replaced.')) {
                    quill.root.innerHTML = blog.content;
                    currentBlogId = blog._id;
                    closeHistoryModal();
                }
            });
            
            historyList.appendChild(historyItem);
        });
        
        document.getElementById('historyModal').style.display = 'block';
        document.getElementById('historyModalOverlay').style.display = 'block';
    } catch (error) {
        console.error('Error fetching blog history:', error);
        showToast('Error loading blog history', 'error');
    }
}

function extractBlogTitle(content) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const firstH1 = tempDiv.querySelector('h1');
    const firstH2 = tempDiv.querySelector('h2');
    return (firstH1 && firstH1.textContent) || 
           (firstH2 && firstH2.textContent) || 
           'Untitled Blog';
}

function extractBlogPreview(content) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const paragraphs = tempDiv.querySelectorAll('p');
    let preview = '';
    
    for (let p of paragraphs) {
        if (p.textContent.trim()) {
            preview = p.textContent.trim();
            break;
        }
    }
    
    return preview.length > 150 ? preview.substring(0, 147) + '...' : preview;
}

function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function closeHistoryModal() {
    document.getElementById('historyModal').style.display = 'none';
    document.getElementById('historyModalOverlay').style.display = 'none';
}

// Event Listeners for History Feature
document.addEventListener('DOMContentLoaded', function() {
    const historyButton = document.getElementById('history-button');
    const closeHistoryModalBtn = document.getElementById('closeHistoryModal');
    const historyModalOverlay = document.getElementById('historyModalOverlay');
    
    if (historyButton) {
        historyButton.addEventListener('click', showHistoryModal);
    }
    
    if (closeHistoryModalBtn) {
        closeHistoryModalBtn.addEventListener('click', closeHistoryModal);
    }
    
    if (historyModalOverlay) {
        historyModalOverlay.addEventListener('click', closeHistoryModal);
    }
});

// Function to clear current blog and chat
function clearCurrentBlog() {
    // Clear blog content and ID
    localStorage.removeItem('currentBlogId');
    quill.root.innerHTML = '<h2>Write a blog here or generate a blog using the chat section</h2>';
    
    // Clear restoration flag
    localStorage.removeItem('isRestoringChat');
    
    // Clear chat messages
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
        chatMessages.innerHTML = '';
    }
    
    // Reset conversation state if available
    if (typeof window.isFirstPrompt !== 'undefined') {
        window.isFirstPrompt = true;
        window.conversationStarted = false;
    }
    
    // Call HTML page's reset function if available
    if (typeof window.resetConversationState === 'function') {
        window.resetConversationState();
    }
    
    showToast('New blog started', 'success');
}

// Add a "New Blog" button to the history modal
async function showHistoryModal() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/blogs/user/blogs`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        const blogs = Array.isArray(data) ? data : (data.data?.blogs || []);

        const historyList = document.getElementById('historyList');
        historyList.innerHTML = '';
        
        // Add "New Blog" button at the top
        const newBlogButton = document.createElement('button');
        newBlogButton.className = 'new-blog-button';
        newBlogButton.innerHTML = '<i class="fas fa-plus"></i> Create New Blog';
        newBlogButton.addEventListener('click', () => {
            if (confirm('Start a new blog? Current content will be cleared.')) {
                clearCurrentBlog();
                closeHistoryModal();
            }
        });
        historyList.appendChild(newBlogButton);
        
        if (blogs.length === 0) {
            historyList.innerHTML += '<p style="text-align: center; color: #636e72;">No blog history found</p>';
            return;
        }
        
        blogs.forEach((blog) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="history-item-header">
                    <h4 class="history-item-title">${blog.title}</h4>
                    <span class="history-item-date">${formatDate(blog.createdAt)}</span>
                </div>
                <p class="history-item-preview">${blog.summary || 'No preview available'}</p>
            `;
            
            historyItem.addEventListener('click', async () => {
                if (confirm('Load this blog? Current content and chat will be replaced.')) {
                    // Call the function defined in the HTML page
                    if (typeof window.loadBlogWithChatHistory === 'function') {
                        await window.loadBlogWithChatHistory(blog._id);
                    } else {
                        // Fallback to just loading content
                        quill.root.innerHTML = blog.content;
                        localStorage.setItem('currentBlogId', blog._id);
                    }
                    closeHistoryModal();
                }
            });
            
            historyList.appendChild(historyItem);
        });
        
        document.getElementById('historyModal').style.display = 'block';
        document.getElementById('historyModalOverlay').style.display = 'block';
    } catch (error) {
        console.error('Error fetching blog history:', error);
        showToast('Error loading blog history', 'error');
    }
}

// Remove the text-change event listener that auto-saves
const quillElement = document.querySelector('.quill-editor');
if (quillElement) {
    const quill = new Quill(quillElement, {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'align': [] }],
                ['link', 'image'],
                ['clean']
            ]
        }
    });
}

// Add a save button to manually save the blog
document.addEventListener('DOMContentLoaded', function() {
    // Only add save button on blog-generator.html page
    if (window.location.pathname.includes('blog-generator.html')) {
        const saveButton = document.createElement('button');
        saveButton.id = 'save-blog-button';
        saveButton.className = 'btn btn-primary';
        saveButton.innerHTML = '<i class="fas fa-save"></i> Save Blog';
        saveButton.style.position = 'fixed';
        saveButton.style.bottom = '20px';
        saveButton.style.right = '20px';
        saveButton.style.zIndex = '900';
        
        document.body.appendChild(saveButton);
        
        saveButton.addEventListener('click', async () => {
            try {
                await saveBlogToHistory();
            } catch (error) {
                console.error('Error saving blog:', error);
                showToast('Error saving blog', 'error');
            }
        });
    }
});

// Add validation function for blog ID
async function validateBlogId(blogId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/blogs/${blogId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.status === 404) {
            console.warn('Blog not found, clearing currentBlogId from localStorage');
            localStorage.removeItem('currentBlogId');
            return false;
        }
        
        return response.ok;
    } catch (error) {
        console.warn('Error validating blog ID:', error);
        return false;
    }
}

// Add these functions after the API_URL constant
async function saveChatMessage(content, senderType, metadata = {}) {
    try {
        const token = localStorage.getItem('token');
        console.log('Saving chat message:', { content, senderType, metadata });
        
        // Save to chat messages collection
        const response = await fetch(`${API_URL}/chat/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                content,
                senderType,
                metadata
            })
        });

        const responseText = await response.text();
        console.log('Save message response:', response.status, responseText);

        if (!response.ok) {
            console.error('Error saving chat message:', responseText);
            throw new Error(responseText);
        }

        // Also save to blog's chat history if a blog is active
        const currentBlogId = localStorage.getItem('currentBlogId');
        if (currentBlogId && await validateBlogId(currentBlogId)) {
            try {
                                        const blogChatResponse = await fetch(`${API_URL}/blogs/${currentBlogId}/chat`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                content,
                                type: senderType === 'bot' ? 'ai' : senderType,
                                metadata
                            })
                        });
                
                if (!blogChatResponse.ok) {
                    if (blogChatResponse.status === 404) {
                        console.warn('Blog not found, clearing currentBlogId from localStorage');
                        localStorage.removeItem('currentBlogId');
                    } else {
                        console.warn('Failed to save to blog chat history, status:', blogChatResponse.status);
                    }
                }
            } catch (blogChatError) {
                console.warn('Failed to save to blog chat history:', blogChatError);
                // Don't throw - the main chat message was saved successfully
            }
        }

        return JSON.parse(responseText);
    } catch (error) {
        console.error('Error saving chat message:', error);
        throw error;
    }
}

async function loadChatHistory() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/chat/messages`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data.data.messages;
        } else {
            console.error('Error loading chat history:', await response.text());
            return [];
        }
    } catch (error) {
        console.error('Error loading chat history:', error);
        return [];
    }
}

function formatMessageTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

async function showChatHistoryModal() {
    const modal = document.getElementById('chatHistoryModal');
    const container = document.getElementById('chatHistoryContainer');
    container.innerHTML = '<div class="loading">Loading chat history...</div>';
    modal.style.display = 'block';

    const messages = await loadChatHistory();
    
    if (messages.length === 0) {
        container.innerHTML = '<div class="no-history-message">No chat history found</div>';
        return;
    }
    
    container.innerHTML = '';
    messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-history-item';
        messageElement.innerHTML = `
            <div class="message-meta">
                <span class="${message.senderType}-message">${message.senderType === 'user' ? 'You' : 'AI'}</span>
                <span class="message-time">${formatMessageTime(message.createdAt)}</span>
            </div>
            <div class="message-content">${message.content}</div>
        `;
        container.appendChild(messageElement);
    });
}

// Add this function to save the generated blog
async function saveGeneratedBlog() {
    try {
        const content = quill.root.innerHTML;
        const title = extractBlogTitle(content) || 'Untitled Blog';
        const preview = extractBlogPreview(content);
        const currentBlogId = localStorage.getItem('currentBlogId');
        
        const blogData = {
            title,
            content,
            summary: preview,
            category: 'General',
            isAIGenerated: true,
            generationPrompt: localStorage.getItem('lastGenerationPrompt') || ''
        };

        const savedBlog = await saveBlogToMongoDB(blogData, currentBlogId);
        
        // If this was a new blog, store its ID
        if (!currentBlogId) {
            localStorage.setItem('currentBlogId', savedBlog._id);
        }
        
        showToast(currentBlogId ? 'Blog updated successfully!' : 'Blog saved to database!', 'success');
        return savedBlog;
    } catch (error) {
        console.error('Error saving generated blog:', error);
        showToast(currentBlogId ? 'Error updating blog' : 'Error saving blog to database', 'error');
    }
}

// Modify addMessageToChat to save blog when AI response is received
async function addMessageToChat(message, isUser = true) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${isUser ? 'user' : 'bot'}`;
    
    // Create message wrapper
    const messageWrapper = document.createElement('div');
    messageWrapper.className = `message-wrapper ${isUser ? 'user' : ''}`;
    
    // Create avatar
    const avatar = document.createElement('div');
    avatar.className = isUser ? 'user-avatar' : 'ai-avatar';
    avatar.textContent = isUser ? 'You' : 'AI';
    
    // Create message meta container
    const messageMeta = document.createElement('div');
    messageMeta.className = 'message-meta';
    
    // Create message content
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    let metadata = {};
    
    // If this is a user message that will generate a blog
    if (isUser && message.toLowerCase().includes('generate a blog')) {
        localStorage.setItem('lastGenerationPrompt', message);
        // Clear current blog ID since we're generating a new blog
        localStorage.removeItem('currentBlogId');
    }

    // Process message content
    if (typeof message === 'string') {
        messageContent.innerHTML = `<p>${message}</p>`;
        
        // If this is a bot message and it looks like a generated blog
        if (!isUser && quill.root.innerHTML.trim() !== '') {
            // Save the blog to MongoDB
            await saveGeneratedBlog();
        }
    } else if (message.type === 'image') {
        messageContent.innerHTML = `
            <img src="${message.url}" alt="Generated image" />
            <p>Image generated successfully!</p>
        `;
        metadata.imageUrls = [message.url];
    }
    
    // Add timestamp
    const timestamp = document.createElement('span');
    timestamp.className = 'message-time';
    timestamp.textContent = formatMessageTime(new Date());
    
    // Assemble message components
    messageMeta.appendChild(messageContent);
    messageMeta.appendChild(timestamp);
    messageWrapper.appendChild(avatar);
    messageWrapper.appendChild(messageMeta);
    messageElement.appendChild(messageWrapper);
    
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Save the message to the database with metadata
    try {
        await saveChatMessage(
            typeof message === 'string' ? message : message.type === 'image' ? 'Image generated successfully!' : message,
            isUser ? 'user' : 'bot',
            metadata
        );
    } catch (error) {
        console.error('Failed to save chat message:', error);
        showToast('Failed to save chat message', 'error');
    }
}

// Add event listeners for the chat history modal
document.addEventListener('DOMContentLoaded', function() {
    const historyButton = document.getElementById('history-button');
    const closeChatHistoryModal = document.getElementById('closeChatHistoryModal');
    const chatHistoryModal = document.getElementById('chatHistoryModal');

    // Only add event listeners if elements exist
    if (historyButton && chatHistoryModal) {
        historyButton.addEventListener('click', showChatHistoryModal);

    if (closeChatHistoryModal) {
        closeChatHistoryModal.addEventListener('click', () => {
            chatHistoryModal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    chatHistoryModal.addEventListener('click', (e) => {
        if (e.target === chatHistoryModal) {
            chatHistoryModal.style.display = 'none';
        }
    });
    }
});

// History dropdown functionality
const historyButton = document.getElementById('history-button');
const historyDropdown = document.getElementById('history-dropdown');
const closeHistoryDropdown = document.getElementById('close-history-dropdown');
const historyDropdownContent = document.getElementById('history-dropdown-content');

// Only proceed with history dropdown functionality if elements exist
if (historyButton && historyDropdown && historyDropdownContent) {
async function fetchBlogHistory() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/blogs/user-blogs`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch blog history');
        }

        const blogs = await response.json();
        return blogs;
    } catch (error) {
        console.error('Error fetching blog history:', error);
        showToast('Failed to load blog history', 'error');
        return [];
    }
}

async function displayBlogHistory() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/blogs/user/blogs`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch blog history');
        }

        const data = await response.json();
        const blogs = data.data.blogs;
        
        historyDropdownContent.innerHTML = '';

        if (blogs.length === 0) {
            historyDropdownContent.innerHTML = `
                <div class="history-item" style="justify-content: center;">
                    <span style="color: #999;">No blogs found</span>
                </div>
            `;
            return;
        }

        blogs.forEach(blog => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
                <div class="history-item-content">
            <div class="history-item-header">
                        <i class="fa-solid fa-file-lines"></i>
                        <span class="topic-title">${blog.title || 'Untitled Blog'}</span>
            </div>
                    <div class="history-item-details">
                        <span class="topic-category">${blog.category}</span>
                        <span class="topic-date">${formatDate(blog.createdAt)}</span>
                    </div>
                    <div class="history-item-preview">
                        ${blog.summary || 'No preview available'}
                    </div>
                </div>
        `;
        
        historyItem.addEventListener('click', async () => {
            if (confirm('Load this blog? Current content and chat will be replaced.')) {
                // Call the function defined in the HTML page
                if (typeof window.loadBlogWithChatHistory === 'function') {
                    await window.loadBlogWithChatHistory(blog._id);
                } else {
                    // Fallback to just loading content
                    quill.root.innerHTML = blog.content;
                    localStorage.setItem('currentBlogId', blog._id);
                }
                historyDropdown.classList.remove('show');
            }
        });

            historyDropdownContent.appendChild(historyItem);
        });
    } catch (error) {
        console.error('Error fetching blog history:', error);
        showToast('Failed to load blog history', 'error');
    }
}

// Event listeners for history dropdown
    historyButton.addEventListener('click', async (e) => {
        e.stopPropagation();
        historyDropdown.classList.toggle('show');
        if (historyDropdown.classList.contains('show')) {
            await displayBlogHistory();
        }
    });

if (closeHistoryDropdown) {
    closeHistoryDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
        historyDropdown.classList.remove('show');
    });
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
        if (!historyDropdown.contains(e.target) && !historyButton.contains(e.target)) {
            historyDropdown.classList.remove('show');
    }
});

// Note: loadBlogWithChatHistory and restoreChatMessages functions are now defined in the HTML file
}