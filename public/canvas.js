(function () {
    // console.log("test🤡");
    const can = document.querySelector("canvas");
    const ctx = can.getContext("2d");
    let x = 0;
    let y = 0;
    let drawOn = false;

    const drawSignature = (ctx, x1, y1, x2, y2) => {
        ctx.lineWidth = 1;
        ctx.strokeStyle = "mediumvioletred";
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    };

    can.addEventListener("mousedown", (evt) => {
        x = evt.offsetX;
        y = evt.offsetY;
        drawOn = true;
    });

    can.addEventListener("mousemove", (evt) => {
        if (drawOn === true) {
            drawSignature(ctx, x, y, evt.offsetX, evt.offsetY);
            x = evt.offsetX;
            y = evt.offsetY;
        }
    });

    can.addEventListener("mouseup", (evt) => {
        if (drawOn === true) {
            x = 0;
            y = 0;
            drawOn = false;
        }
        const data = can.toDataURL();
        document.getElementById("signature").setAttribute("value", data);
    });

    // ctx.moveTo(100, 50);
    // ctx.lineTo(100, 200);
    // ctx.stroke();

    // ctx.beginPath();
    // ctx.strokeStyle = "olivedrab";
    // ctx.moveTo(250, 200);
    // ctx.lineTo(100, 50);
    // ctx.stroke();

    // pageX, pageY?
    // clientX, clientY?
})();
