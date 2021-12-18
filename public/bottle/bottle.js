if (window.isBottleOpen)
    document.getElementById("cap").setAttribute("class", "opened");

// Bubbles
document.getElementById("bubbles").innerHTML = generateBubbles();

function generateBubbles() {
    const createBubble = () => {
        return {};
    };
    const bubbles = [
        createBubble(),
        createBubble(),
        createBubble(),
        createBubble(),
        createBubble(),
        createBubble(),
    ];

    return `${bubbles
        .map(
            (bubble, i) =>
                `<div style="left:${80 + i * 10}px" class="bubble ${
                    window.isBottleOpen ? "bubbleActive" : ""
                }"></div>`
        )
        .join("")}`;
}
