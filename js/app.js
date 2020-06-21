const navbar = document.querySelector("#navbar__list");
const sectionsList = document.querySelectorAll("section");
let activeClick = false;

/**
 * Build the navigation
 */

const buildNav = (sectionsList) => {
   // Create a new DocumentFragment to append each newly created nav item
   const navContainer = document.createDocumentFragment();

   // Loop through each section item and get the section ID and section name to build the structure of the nav item
   sectionsList.forEach(section => {
      const navLi = document.createElement("li");

      // Get each section name and ID to be used as menu link text and class
      const sectionID = section.getAttribute('id');
      const sectionName = section.getAttribute('data-nav');

      // The classes list t be added to each menu link item
      const classesList = ['menu__link', sectionID];
      navLi.classList.add(...classesList);

      // Check of the section has active class, and if it has the active class add it to the reference nav item
      section.className ? navLi.classList.add(section.className):"";

      // Set the menu link item text
      navLi.textContent = sectionName;

      // Append the newly created "li" item to the navbar
      navContainer.append(navLi);
   });

   // Append all the newly created nav items to the navbar
   navbar.appendChild(navContainer);
}


/**
 * Helper functions
 */

// Helper function to remove selected class name from selected selected elements
const removeClasses = (className, elements) => {
   Array.from(elements).forEach(element => element.classList.remove(className));
};

// Handle the click on each menu item
const handleMenuClick = (event) => {
   activeClick = true;

   const targetLi = event.target;
   const menuLinks = document.querySelectorAll('.menu__link');

   if (targetLi.nodeName === "LI") {
      // Get the section name from the menu link class list
      const target = targetLi.getAttribute("class").split(' ')[1];

      // Filter the requested section from the sections list as per the clicked section from the menu items
      const requestedSection = Array.from(sectionsList).find(
          section => section.id === target
      );

      // Remove the active classes from the current active menu class ans section
      removeClasses("active", sectionsList);
      removeClasses("active", menuLinks);

      /**
       * Add the active class to the new menu link item
       * Scroll the page to the requested section
       * Add the active class to the requested section
       */
      targetLi.classList.add("active");
      requestedSection.scrollIntoView({ behavior: "smooth" });
      requestedSection.classList.add("active");

      // Reset the activeClick helper to false.
      setTimeout(() => (activeClick = !activeClick), 2000);
   }
};

// Scroll the page to the requested section and hide the menu while scrolling, also show the back to top button
const handlePageScroll = () => {
   const menuLinks = document.querySelectorAll('.menu__link');

   // Hide header on window scrolling
   hideHeader(1000);

   // Fire the back to top button
   showTopBtn();

   // Prevent page scroll handler from running when the user is navigating through clicking on the menu links sections.
   if (activeClick) return;

   // Check if the next section appear in the viewport by 250 pixels or no
   const activeSection = Array.from(sectionsList).find(section => {
      const sectionTopOffset = section.offsetTop;
      const sectionTopOffsetHeight = section.offsetTop + section.offsetHeight;
      const bodyScroll = window.pageYOffset + 250;

      return bodyScroll >= sectionTopOffset && bodyScroll <= sectionTopOffsetHeight;
   });

   // Remove the active classes from the current active menu class ans section
   removeClasses("active", sectionsList);
   removeClasses("active", menuLinks);

   let activeNavAnchor;

   if (activeSection) {
      // Get the new active meu link item
      activeNavAnchor = Array.from(menuLinks).find(
          link => link.getAttribute("class").split(' ')[1] === activeSection.id
      );

      /**
       * Add the active class to the new menu link item
       * Add the active class to the requested section
       */
      activeSection.classList.add("active");
      activeNavAnchor.classList.add("active");
   }
};

// Helper function to hide the header while scrolling
function hideHeader(delay) {
   const header = document.querySelector('.page__header');
   let timer;

   // CLear the timer before running the setTimeout again
   timer && clearTimeout(timer);

   // Add "hide" class to the  header
   header.classList.add("hide");

   // Pass the setTimeout to a variable to be able to clear it.
   // After specific delay time, the "hide" class will be removed from the header as the user stopped scrolling
   timer = setTimeout(function () {
      header.classList.remove("hide");
   }, delay);
}

// Create the "Back to Top" button
function createTopBtn() {
   const HTML = `<a href="#" class="back2top hide">Back To top</a>`;
   document.body.insertAdjacentHTML("afterbegin", HTML);
}

// SHow the back to top button
function showTopBtn() {
   // Create and add the button to the DOM as hidden element
   const btn = document.querySelector(".back2top");

   // Remove the button if absolute scrolling y is lower than browser window viewport
   if (window.pageYOffset <= 0.75 * window.innerHeight) {
      btn.classList.add("hide");
   } else {
      btn.classList.remove("hide");

      // Add event handler only if button is visible
      btn.addEventListener("click", function (e) {
         e.preventDefault();

         // Smooth scroll to top of page
         window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
         });
      });
   }
}

buildNav(sectionsList);
createTopBtn();

navbar.addEventListener("click", handleMenuClick);
window.addEventListener("scroll", handlePageScroll);
