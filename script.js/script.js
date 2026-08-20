/* =========================================
   INTRO
========================================= */

const intro = document.getElementById("intro");

const enterButton =
    document.getElementById("enterButton");


enterButton.addEventListener(
    "click",
    () => {

        intro.classList.add("hide");

    }
);


/* =========================================
   GALLERY
========================================= */

const track =
    document.getElementById(
        "artworkTrack"
    );

const artworks =
    document.querySelectorAll(
        ".artwork"
    );

const previous =
    document.getElementById(
        "previous"
    );

const next =
    document.getElementById(
        "next"
    );

const currentNumber =
    document.getElementById(
        "currentNumber"
    );


let currentIndex = 0;

let position = 0;

let isDragging = false;

let startX = 0;

let startPosition = 0;


/* =========================================
   GET ARTWORK WIDTH
========================================= */

function getArtworkStep() {

    if (!artworks.length) {
        return 0;
    }

    const artwork =
        artworks[0];

    const style =
        window.getComputedStyle(
            track
        );

    const gap =
        parseFloat(
            style.columnGap ||
            style.gap
        );

    return (
        artwork.offsetWidth +
        gap
    );
}


/* =========================================
   MAX SCROLL
========================================= */

function getMaxPosition() {

    return Math.max(
        0,

        track.scrollWidth -
        track.parentElement.clientWidth
    );
}


/* =========================================
   MOVE GALLERY
========================================= */

function moveGallery(direction) {

    const step =
        getArtworkStep();

    currentIndex += direction;


    /*
        Keep index within artwork range.
    */

    if (currentIndex < 0) {

        currentIndex = 0;

    }


    if (
        currentIndex >
        artworks.length - 1
    ) {

        currentIndex =
            artworks.length - 1;

    }


    position =
        -(currentIndex * step);


    const max =
        getMaxPosition();


    if (
        Math.abs(position) >
        max
    ) {

        position = -max;

    }


    track.style.transform =
        `translateX(${position}px)`;


    updateCounter();

}


/* =========================================
   COUNTER
========================================= */

function updateCounter() {

    let number =
        currentIndex + 1;

    currentNumber.textContent =
        String(number).padStart(
            2,
            "0"
        );

}


/* =========================================
   BUTTONS
========================================= */

previous.addEventListener(
    "click",
    () => {

        moveGallery(-1);

    }
);


next.addEventListener(
    "click",
    () => {

        moveGallery(1);

    }
);


/* =========================================
   DRAG
========================================= */

track.addEventListener(
    "pointerdown",
    (event) => {

        isDragging = true;

        startX =
            event.clientX;

        startPosition =
            position;

        track.classList.add(
            "dragging"
        );

        track.setPointerCapture(
            event.pointerId
        );

    }
);


track.addEventListener(
    "pointermove",
    (event) => {

        if (!isDragging) {
            return;
        }


        const distance =
            event.clientX -
            startX;


        position =
            startPosition +
            distance;


        /*
            Don't move beyond
            the beginning.
        */

        if (position > 0) {

            position = 0;

        }


        /*
            Don't move beyond
            the final artwork.
        */

        const max =
            getMaxPosition();


        if (
            Math.abs(position) >
            max
        ) {

            position = -max;

        }


        track.style.transform =
            `translateX(${position}px)`;

    }
);


track.addEventListener(
    "pointerup",
    finishDrag
);


track.addEventListener(
    "pointercancel",
    finishDrag
);


function finishDrag() {

    if (!isDragging) {
        return;
    }

    isDragging = false;

    track.classList.remove(
        "dragging"
    );


    /*
        Determine which artwork
        is closest to the current
        position.
    */

    const step =
        getArtworkStep();


    if (step > 0) {

        currentIndex =
            Math.round(
                Math.abs(position) /
                step
            );

    }


    if (
        currentIndex <
        0
    ) {

        currentIndex = 0;

    }


    if (
        currentIndex >
        artworks.length - 1
    ) {

        currentIndex =
            artworks.length - 1;

    }


    position =
        -(currentIndex * step);


    const max =
        getMaxPosition();


    if (
        Math.abs(position) >
        max
    ) {

        position = -max;

    }


    track.style.transform =
        `translateX(${position}px)`;


    updateCounter();

}


/* =========================================
   MOUSE WHEEL
========================================= */

track.addEventListener(
    "wheel",
    (event) => {

        event.preventDefault();


        const amount =
            Math.abs(
                event.deltaX
            ) >
            Math.abs(
                event.deltaY
            )
                ? event.deltaX
                : event.deltaY;


        if (amount > 0) {

            moveGallery(1);

        } else {

            moveGallery(-1);

        }

    },
    {
        passive: false
    }
);


/* =========================================
   KEYBOARD
========================================= */

document.addEventListener(
    "keydown",
    (event) => {

        /*
            Don't navigate gallery
            while typing.
        */

        if (
            event.target.tagName ===
            "INPUT"
        ) {

            return;

        }


        if (
            event.key ===
            "ArrowRight"
        ) {

            moveGallery(1);

        }


        if (
            event.key ===
            "ArrowLeft"
        ) {

            moveGallery(-1);

        }


        if (
            event.key ===
            "Escape"
        ) {

            closePanels();

        }

    }
);


/* =========================================
   ABOUT / CONTACT
========================================= */

const navButtons =
    document.querySelectorAll(
        ".nav-button"
    );

const panels =
    document.querySelectorAll(
        ".slide-panel"
    );

const closeButtons =
    document.querySelectorAll(
        ".close-panel"
    );


navButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                const panelID =
                    button.dataset.panel;

                openPanel(panelID);

            }
        );

    }
);


/* =========================================
   OPEN PANEL
========================================= */

function openPanel(panelID) {

    /*
        Close everything first.
    */

    panels.forEach(
        (panel) => {

            panel.classList.remove(
                "active"
            );

        }
    );


    const panel =
        document.getElementById(
            panelID
        );


    if (panel) {

        panel.classList.add(
            "active"
        );

    }

}


/* =========================================
   CLOSE PANELS
========================================= */

function closePanels() {

    panels.forEach(
        (panel) => {

            panel.classList.remove(
                "active"
            );

        }
    );

}


closeButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            closePanels
        );

    }
);


/* =========================================
   CLICK OUTSIDE PANEL
========================================= */

document.addEventListener(
    "click",
    (event) => {

        const activePanel =
            document.querySelector(
                ".slide-panel.active"
            );


        if (!activePanel) {
            return;
        }


        /*
            If clicking the gallery
            or background, close it.
        */

        if (
            !activePanel.contains(
                event.target
            ) &&
            !event.target.closest(
                ".nav-button"
            )
        ) {

            closePanels();

        }

    }
);


/* =========================================
   WINDOW RESIZE
========================================= */

window.addEventListener(
    "resize",
    () => {

        const step =
            getArtworkStep();


        position =
            -(currentIndex * step);


        const max =
            getMaxPosition();


        if (
            Math.abs(position) >
            max
        ) {

            position = -max;

        }


        track.style.transform =
            `translateX(${position}px)`;

    }
);
