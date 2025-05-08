// Combined loadcontent.js

// =============== PART 1: Content Loading Function ===============

async function loadContent(contentFilePath, boxId, targetElementId) {
    // Fetches the file, parses it, finds elements.
    const response = await fetch(contentFilePath);
    const htmlText = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');
    const contentBox = doc.getElementById(boxId); 
    const targetElement = document.getElementById(targetElementId); 

    // Replaces the placeholder div with the actual box div from the other file.
    // Assumes elements are always found; will error otherwise.
    targetElement.replaceWith(contentBox.cloneNode(true)); // Correctly uses replaceWith
}


// =============== PART 2: Run Everything When Page Loads ===============

// Waits for page's HTML to be ready.
document.addEventListener('DOMContentLoaded', () => {

    // --- Section A: Load all the boxes ---

    // Path to content file. (MUST BE ACCURATE)
    const contentFilePath = 'allboxes.html'; 

    // List of box IDs to load. (MATCH IDs IN allboxes.html AND [boxId]-placeholder IN THIS PAGE)
    const boxIds = [
        'log-props', 'factoring-techniques', 'function-behavior', 'algebraic-limit-techniques',
        'unit-circle', 'reciprocal-identities', 'pythagorean-identities', 'even-odd-periodic',
        'double-angle', 'half-angle', 'sum-difference', 'product-to-sum', 'limit-definition',
        'derivative-differentials-approx', 'special-limits', 'rolles', 'mvt', 'ivt',
        'graph-sketching', 'asymptotes', 'diff-rules', 'trig-derivatives', 'related-rates',
        'optimization', 'sqrt-approx', 'summation-identities', 'Riemann-Sums',
        'integration-rules', 'u-Substitution', 'even-odd-integration', 'inverse-log-integrals',
        'definite-integral', 'properties-integrals', 'fundamental-theorem-of-calculus',
        'second-fundamental-theorem', 'mvt-integrals', 'lhopital', 'integration-by-parts',
        'trig-substitution', 'completing-the-square', 'trig-graphs-container'
    ];

    // Loads each box listed above.
    boxIds.forEach(boxId => {
        const targetElementId = `${boxId}-placeholder`; 
        loadContent(contentFilePath, boxId, targetElementId);
    });


    // --- Section B: Set up the click interactions (Event Delegation Version) ---

    // Area containing boxes (change 'body' if boxes are inside a specific container like <div id="main">).
    const interactiveArea = document.body; 

    let currentlyActive = null; // Tracks the active element.

    // Makes the current active element inactive.
    function deactivateCurrent(callback) {
        if (currentlyActive) {
            currentlyActive.classList.remove('active');
            // Waits for CSS animation (400ms).
            setTimeout(() => {
                if (callback) callback();
            }, 400); 
        } else {
            if (callback) callback(); // No active element.
        }
    }

    // Makes the clicked element active.
    function activateNew(element) {
        element.classList.add('active');
        currentlyActive = element;
    }

    // Decides whether to activate or deactivate.
    function handleClick(element) {
        if (currentlyActive === element) { // Clicked same one?
            deactivateCurrent(() => { currentlyActive = null; }); // Deactivate.
        } else { // Clicked a new one?
            deactivateCurrent(() => { activateNew(element); }); // Deactivate old, activate new.
        }
    }

    // Listens for clicks inside the interactiveArea (using delegation).
    interactiveArea.addEventListener('click', (e) => {
        // Checks if the click was inside a .box or .graphs-section.
        const clickedBox = e.target.closest('.box');
        const clickedGraphsSection = e.target.closest('.graphs-section');

        if (clickedBox && interactiveArea.contains(clickedBox)) {
            handleClick(clickedBox); // Handle click on a box.
        } else if (clickedGraphsSection && interactiveArea.contains(clickedGraphsSection)) {
            handleClick(clickedGraphsSection); // Handle click on graphs section.
        } 
    });

    // Listens for clicks anywhere on the page (to deactivate).
    document.addEventListener('click', (e) => {
        // If the click was *not* inside a box or graphs section...
        if (!e.target.closest('.box') && !e.target.closest('.graphs-section')) {
            if (currentlyActive) { // ...and something is active...
                deactivateCurrent(() => { // ...deactivate it.
                    currentlyActive = null;
                });
            }
        }
    });

}); // End of DOMContentLoaded listener