// =============== PART 1: Content Loading Function ===============

async function loadContent(contentFilePath, boxId, targetElementId) {
    const response = await fetch(contentFilePath);
    if (!response.ok) {
        console.error(`Failed to fetch ${contentFilePath}: ${response.statusText}`);
        // Optionally, display an error message in the placeholder
        const targetElement = document.getElementById(targetElementId);
        if (targetElement) {
            targetElement.innerHTML = `<p style="color:red;">Error loading content for ${boxId}.</p>`;
        }
        return null; // Return null or throw error to indicate failure
    }
    const htmlText = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');
    const contentBox = doc.getElementById(boxId);
    const targetElement = document.getElementById(targetElementId);

    if (contentBox && targetElement) {
        const clonedNode = contentBox.cloneNode(true);
        targetElement.replaceWith(clonedNode);
        return clonedNode; // Return the newly added element for potential further processing
    } else {
        console.error(`Could not find contentBox (ID: ${boxId}) in ${contentFilePath} or targetElement (ID: ${targetElementId}) in the main document.`);
        if (targetElement) {
            targetElement.innerHTML = `<p style="color:red;">Error finding content for ${boxId}.</p>`;
        }
        return null; // Return null or throw error
    }
}


// =============== PART 2: Run Everything When Page Loads ===============

document.addEventListener('DOMContentLoaded', () => {

    // --- Section A: Load all the boxes ---
    const contentFilePath = 'allboxes.html';
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

    // Create an array of promises, one for each loadContent call
    const loadPromises = boxIds.map(boxId => {
        const targetElementId = `${boxId}-placeholder`;
        return loadContent(contentFilePath, boxId, targetElementId);
    });

    // Wait for all content to be loaded
    Promise.all(loadPromises).then(loadedElements => {
        // All content is loaded (or failed gracefully if you added error handling)
        // Now, tell MathJax to typeset the document
        if (typeof MathJax !== "undefined" && MathJax.typesetPromise) {
            console.log("All content loaded. Typesetting with MathJax...");
            MathJax.typesetPromise().then(() => {
                console.log("MathJax typesetting complete.");
            }).catch((err) => {
                console.error("MathJax typesetting failed:", err);
            });
        } else {
            console.warn("MathJax script not loaded or typesetPromise not available.");
        }
    }).catch(error => {
        console.error("Error loading one or more content boxes:", error);
        // You might still want to try typesetting if some boxes loaded
        if (typeof MathJax !== "undefined" && MathJax.typesetPromise) {
            MathJax.typesetPromise().catch(err => console.error("MathJax typesetting failed after errors:", err));
        }
    });


    // --- Section B: Set up the click interactions (Event Delegation Version) ---
    // (Your existing click interaction code remains the same)
    const interactiveArea = document.body;
    let currentlyActive = null;

    function deactivateCurrent(callback) {
        if (currentlyActive) {
            currentlyActive.classList.remove('active');
            setTimeout(() => {
                if (callback) callback();
            }, 400);
        } else {
            if (callback) callback();
        }
    }

    function activateNew(element) {
        element.classList.add('active');
        currentlyActive = element;
    }

    function handleClick(element) {
        if (currentlyActive === element) {
            deactivateCurrent(() => { currentlyActive = null; });
        } else {
            deactivateCurrent(() => { activateNew(element); });
        }
    }

    interactiveArea.addEventListener('click', (e) => {
        const clickedBox = e.target.closest('.box');
        const clickedGraphsSection = e.target.closest('.graphs-section');

        if (clickedBox && interactiveArea.contains(clickedBox)) {
            handleClick(clickedBox);
        } else if (clickedGraphsSection && interactiveArea.contains(clickedGraphsSection)) {
            handleClick(clickedGraphsSection);
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.box') && !e.target.closest('.graphs-section')) {
            if (currentlyActive) {
                deactivateCurrent(() => {
                    currentlyActive = null;
                });
            }
        }
    });
});
