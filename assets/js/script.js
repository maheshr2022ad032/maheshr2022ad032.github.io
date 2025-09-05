'use strict';



// add Event on multiple elment

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}



// PRELOADING

const loadingElement = document.querySelector("[data-loading]");

window.addEventListener("load", function () {
  loadingElement.classList.add("loaded");
  document.body.classList.remove("active");
});

// document.addEventListener('contextmenu', function(event) {
//   event.preventDefault();
//   return false;
// }, false);

// MOBILE NAV TOGGLE

const [navTogglers, navLinks, navbar, overlay] = [
  document.querySelectorAll("[data-nav-toggler]"),
  document.querySelectorAll("[data-nav-link]"),
  document.querySelector("[data-navbar]"),
  document.querySelector("[data-overlay]")
];

const toggleNav = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("active");
}

addEventOnElements(navTogglers, "click", toggleNav);

const closeNav = function () {
  navbar.classList.remove("active");
  overlay.classList.remove("active");
  document.body.classList.remove("active");
}

addEventOnElements(navLinks, "click", closeNav);



// HEADER

const header = document.querySelector("[data-header]");

const activeElementOnScroll = function () {
  if (window.scrollY > 50) {
    header.classList.add("active");
  } else {
    header.classList.remove("active");
  }
}

window.addEventListener("scroll", activeElementOnScroll);

// Resume Download Button Animation
document.addEventListener('DOMContentLoaded', function () {
  const resumeBtn = document.querySelector('.resume-btn');
  const progressBar = document.querySelector('.progress');

  if (!resumeBtn || !progressBar) return;

  resumeBtn.addEventListener('click', function (e) {
    if (!this.classList.contains('downloading')) {
      e.preventDefault();
      const downloadLink = this.getAttribute('href');

      this.classList.add('downloading');

      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 4;
        progressBar.style.width = `${progress}%`;

        if (progress >= 100) {
          clearInterval(progressInterval);

          setTimeout(() => {
            this.classList.remove('downloading');
            progressBar.style.width = '0%';

            // Trigger actual download
            const tempLink = document.createElement('a');
            tempLink.href = downloadLink;
            tempLink.setAttribute('download', '');
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
          }, 400);
        }
      }, 80);
    }
  });
});


/**
 * LETTER SWIRL ANIMATION FOR HERO SECTION
 */
document.addEventListener('DOMContentLoaded', function() {
  const roles = document.querySelectorAll('.role');
  let currentRoleIndex = 0;
  let animationInProgress = false;
  
 // Helper function to create letter spans
function wrapLettersInSpans(element) {
  const text = element.textContent;
  element.textContent = '';
  
  for (let i = 0; i < text.length; i++) {
    const span = document.createElement('span');
    
    // Special handling for space characters
    if (text[i] === ' ') {
      span.textContent = ' ';
      span.style.display = 'inline-block';
      span.style.width = '0.3em'; // Explicitly set width for space
    } else {
      span.textContent = text[i];
      span.style.animationDelay = `${i * 0.05}s`;
    }
    
    element.appendChild(span);
    
    // Add a small gap after each letter (but not after spaces)
    if (text[i] !== ' ') {
      const space = document.createElement('span');
      space.textContent = '';
      space.style.width = '1px';
      space.style.display = 'inline-block';
      element.appendChild(space);
    }
  }
}
  
  // Wrap all role text in spans for animation
  roles.forEach(role => {
    wrapLettersInSpans(role);
  });
  
  // Function to switch roles
  function switchRole() {
    if (animationInProgress) return;
    animationInProgress = true;
    
    // Add exit class to current role to trigger the reverse swirl animation
    roles[currentRoleIndex].classList.add('exit');
    
    // Wait for exit animation to complete before switching to next role
    setTimeout(() => {
      // Remove active and exit classes from current role
      roles[currentRoleIndex].classList.remove('active');
      roles[currentRoleIndex].classList.remove('exit');
      
      // Move to next role
      currentRoleIndex = (currentRoleIndex + 1) % roles.length;
      
      // Add active to new role to trigger entrance animation
      roles[currentRoleIndex].classList.add('active');
      
      // Allow next animation after entrance completes
      setTimeout(() => {
        animationInProgress = false;
      }, 1000); // Entrance animation duration plus buffer
      
    }, 1000); // Exit animation duration - increased to allow full reverse swirl
  }
  
  // Start the animation with first role
  roles[currentRoleIndex].classList.add('active');
  
  // Switch roles every 4 seconds
  setInterval(switchRole, 4000);
  
  // Resume button download animation
  const resumeBtn = document.querySelector('.resume-btn');
  
  if (resumeBtn) {
    resumeBtn.addEventListener('click', function() {
      this.classList.add('downloading');
      
      const progress = this.querySelector('.progress');
      let width = 0;
      
      const progressInterval = setInterval(() => {
        if (width >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            this.classList.remove('downloading');
          }, 500);
        } else {
          width += 5;
          progress.style.width = width + '%';
        }
      }, 100);
    });
  }
});


// Smooth Continuous Portfolio Scrolling
document.addEventListener('DOMContentLoaded', function() {
  const portfolioList = document.querySelector('.portfolio-list');
  const prevBtn = document.querySelector('.portfolio-nav-btn.prev');
  const nextBtn = document.querySelector('.portfolio-nav-btn.next');
  
  if (!portfolioList || !prevBtn || !nextBtn) return;
  
  // Get all original cards
  const originalCards = Array.from(portfolioList.querySelectorAll('.portfolio-card'));
  if (!originalCards.length) return;
  
  // Configuration
  const scrollSpeed = 1; // Pixels per animation frame (lower = slower, smoother)
  const cardWidth = 590; // Card width (550px) + margins (40px)
  
  // Clone cards for seamless infinite loop
  function setupInfiniteScroll() {
    // Remove any existing clones first (in case of reinitialization)
    portfolioList.querySelectorAll('.cloned-card').forEach(clone => clone.remove());
    
    // Clone all cards and add to the end
    originalCards.forEach(card => {
      const clone = card.cloneNode(true);
      clone.classList.add('cloned-card');
      clone.setAttribute('aria-hidden', 'true'); // For accessibility
      portfolioList.appendChild(clone);
    });
    
    // Set initial scroll position to first card
    resetScrollPosition();
  }
  
  // Reset scroll position when needed (for looping)
  function resetScrollPosition() {
    portfolioList.scrollLeft = 0;
  }
  
  // Animation variables
  let isScrolling = false;
  let animationFrameId;
  let userInteracted = false;
  
  // Smooth scrolling animation function
  function smoothScroll() {
    if (!isScrolling) return;
    
    // Calculate the total scrollable width
    const maxScroll = portfolioList.scrollWidth - portfolioList.clientWidth;
    const originalContentWidth = originalCards.length * cardWidth;
    
    // Increment scroll position
    portfolioList.scrollLeft += scrollSpeed;
    
    // Check if we need to loop
    if (portfolioList.scrollLeft >= originalContentWidth) {
      // Reset to beginning without visual interruption
      portfolioList.scrollLeft = 0;
    }
    
    // Continue the animation
    animationFrameId = requestAnimationFrame(smoothScroll);
  }
  
  // Start smooth scrolling
  function startScrolling() {
    if (isScrolling) return;
    isScrolling = true;
    animationFrameId = requestAnimationFrame(smoothScroll);
  }
  
  // Stop scrolling
  function stopScrolling() {
    isScrolling = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }
  
  // Set up the infinite scroll
  setupInfiniteScroll();
  
  // Start automatic scrolling
  startScrolling();
  
  // Navigation buttons
  prevBtn.addEventListener('click', () => {
    stopScrolling();
    userInteracted = true;
    
    // Scroll to previous card with animation
    portfolioList.scrollBy({
      left: -cardWidth,
      behavior: 'smooth'
    });
    
    // Resume scrolling after animation completes
    setTimeout(() => {
      // Check if we need to loop
      if (portfolioList.scrollLeft < cardWidth) {
        // Find equivalent position in the first set of cards
        const currentPosition = portfolioList.scrollLeft;
        const totalOriginalWidth = originalCards.length * cardWidth;
        portfolioList.scrollLeft = totalOriginalWidth + currentPosition;
      }
      userInteracted = false;
      startScrolling();
    }, 500); // wait for smooth scroll to complete
  });
  
  nextBtn.addEventListener('click', () => {
    stopScrolling();
    userInteracted = true;
    
    // Scroll to next card with animation
    portfolioList.scrollBy({
      left: cardWidth,
      behavior: 'smooth'
    });
    
    // Resume scrolling after animation completes
    setTimeout(() => {
      // Check if we need to loop
      const maxOriginalScroll = originalCards.length * cardWidth;
      if (portfolioList.scrollLeft >= maxOriginalScroll) {
        portfolioList.scrollLeft = portfolioList.scrollLeft % maxOriginalScroll;
      }
      userInteracted = false;
      startScrolling();
    }, 500); // wait for smooth scroll to complete
  });
  
  // Pause on user interaction
  portfolioList.addEventListener('mouseenter', () => {
    userInteracted = true;
    stopScrolling();
  });
  
  portfolioList.addEventListener('touchstart', () => {
    userInteracted = true;
    stopScrolling();
  }, { passive: true });
  
  // Manual scrolling handling
  portfolioList.addEventListener('scroll', () => {
    if (!userInteracted) return; // Only handle during manual scrolling
    
    // Check if we need to loop during manual scrolling
    const maxOriginalScroll = originalCards.length * cardWidth;
    
    // If scrolled past the original cards, loop back
    if (portfolioList.scrollLeft >= maxOriginalScroll) {
      portfolioList.scrollLeft = portfolioList.scrollLeft % maxOriginalScroll;
    }
    
    // If scrolled before the start (can happen with momentum scrolling)
    if (portfolioList.scrollLeft < 0) {
      portfolioList.scrollLeft = maxOriginalScroll + (portfolioList.scrollLeft % maxOriginalScroll);
    }
  });
  
  // Resume on interaction end
  portfolioList.addEventListener('mouseleave', () => {
    if (userInteracted) {
      userInteracted = false;
      startScrolling();
    }
  });
  
  portfolioList.addEventListener('touchend', () => {
    setTimeout(() => {
      if (userInteracted) {
        userInteracted = false;
        startScrolling();
      }
    }, 1000); // Give some time after touch before resuming
  }, { passive: true });
  
  // Handle visibility changes (tab switching)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopScrolling();
    } else {
      // Only start if user hasn't interacted
      if (!userInteracted) {
        startScrolling();
      }
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', () => {
    // Recalculate positions after resize
    setupInfiniteScroll();
    
    // Only restart if not user-paused
    if (!userInteracted) {
      stopScrolling();
      startScrolling();
    }
  });
  
  // Add any necessary styles
  const style = document.createElement('style');
  style.textContent = `
    .portfolio-list {
      -webkit-overflow-scrolling: touch;
    }
    
    .portfolio-card {
      transition: transform 0.3s ease;
    }
  `;
  document.head.appendChild(style);
});



/**
 * BACK TO TOP BUTTON
 */

const backTopBtn = document.querySelector("[data-back-top-btn]");

window.addEventListener("scroll", function () {
  const bodyHeight = document.body.scrollHeight;
  const windowHeight = window.innerHeight;
  const scrollEndPos = bodyHeight - windowHeight;
  const totalScrollPercent = (window.scrollY / scrollEndPos) * 100;

  backTopBtn.textContent = `${totalScrollPercent.toFixed(0)}%`;

  // visible back top btn when scrolled 5% of the page
  if (totalScrollPercent > 5) {
    backTopBtn.classList.add("show");
  } else {
    backTopBtn.classList.remove("show");
  }
});



/**
 * SCROLL REVEAL
 */

const revealElements = document.querySelectorAll("[data-reveal]");

const scrollReveal = function () {
  for (let i = 0; i < revealElements.length; i++) {
    const elementIsInScreen = revealElements[i].getBoundingClientRect().top < window.innerHeight / 1.15;

    if (elementIsInScreen) {
      revealElements[i].classList.add("revealed");
    } else {
      revealElements[i].classList.remove("revealed");
    }
  }
}

window.addEventListener("scroll", scrollReveal);

scrollReveal();



/**
 * CUSTOM CURSOR
 */

const cursor = document.querySelector("[data-cursor]");
const anchorElements = document.querySelectorAll("a");
const buttons = document.querySelectorAll("button");

// change cursorElement position based on cursor move
document.body.addEventListener("mousemove", function (event) {
  setTimeout(function () {
    cursor.style.top = `${event.clientY}px`;
    cursor.style.left = `${event.clientX}px`;
  }, 100);
});

// add cursor hoverd class
const hoverActive = function () { cursor.classList.add("hovered"); }

// remove cursor hovered class
const hoverDeactive = function () { cursor.classList.remove("hovered"); }

// add hover effect on cursor, when hover on any button or hyperlink
addEventOnElements(anchorElements, "mouseover", hoverActive);
addEventOnElements(anchorElements, "mouseout", hoverDeactive);
addEventOnElements(buttons, "mouseover", hoverActive);
addEventOnElements(buttons, "mouseout", hoverDeactive);

// add disabled class on cursorElement, when mouse out of body
document.body.addEventListener("mouseout", function () {
  cursor.classList.add("disabled");
});

// remove diabled class on cursorElement, when mouse in the body
document.body.addEventListener("mouseover", function () {
  cursor.classList.remove("disabled");
});