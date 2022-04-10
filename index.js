const palettes = document.querySelectorAll(".palette");
const list = document.querySelector(".palette-container");
const mask = document.querySelector(".mask");
const changeButton = document.querySelector(".changeColor");
const turnBackButton = document.querySelector(".back");
const turnFrontButton = document.querySelector(".front");
const lockButtons = document.querySelectorAll(".lock");
const saveButton = document.querySelector(".saveColor");
const closeButton = document.querySelector(".saveColorWindow .close");
const saveColorWindow = document.querySelector(".saveColorWindow");
const cancelButton = document.querySelector(".saveColorWindow .cancel");
const save = document.querySelector(".saveColorWindow .save");
const colorSideMenuButton = document.querySelector(".colorSideMenuButton");
const colorSideMenu = document.querySelector(".colorSideMenu");
const colorSideMenuClose = document.querySelector(".colorSideMenuClose");
const sideMenuContainer = document.querySelector(".sideMenuContainer");
const copyButton = document.querySelector(".copy");
const colorSelectors = document.querySelectorAll("input[type=color]");

let colorHistory = [];
let currentHistory = 0;
//create a random hex
function randomHex() {
    let hex = Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padEnd(6, "0");
    return hex;
}
// transform hex to RGB
function hexToRGB(hex) {
    let RGB =
        "rgb(" +
        parseInt("0x" + hex.slice(0, 2)) +
        "," +
        parseInt("0x" + hex.slice(2, 4)) +
        "," +
        parseInt("0x" + hex.slice(4, 6)) +
        ")";
    return {
        r: parseInt("0x" + hex.slice(0, 2)),
        g: parseInt("0x" + hex.slice(2, 4)),
        b: parseInt("0x" + hex.slice(4, 6)),
        rgb: RGB,
    };
}
function brightnessChange(palette, hex) {
    const { r, g, b } = hexToRGB(hex);
    console.log(r * 0.299 + g * 0.578 + b * 0.114);
    //乘上的數值為網路上的公式
    if (r * 0.299 + g * 0.578 + b * 0.114 >= 160) {
        palette.children[0].style.color = "black";
        palette.children[1].style.color = "black";
        palette.children[2].style.color = "black";
        palette.children[3].style.color = "black";
        palette.children[4].style.color = "black";
    } else {
        palette.children[0].style.color = "white";
        palette.children[1].style.color = "white";
        palette.children[2].style.color = "white";
        palette.children[3].style.color = "white";
        palette.children[4].style.color = "white";
    }
}
//click button to change colors
function changeColor(palette) {
    const hex = randomHex().toUpperCase();
    palette.style.backgroundColor = `#${hex}`;
    palette.children[3].value = `#${hex}`;
    palette.children[0].innerHTML = hex;

    //whenever change color,saving color to the element's attribute:data-color
    palette.dataset.color = hex;
    brightnessChange(palette, hex);
}
function selectColor(element) {
    element.addEventListener("change", () => {
        let palette = element.parentElement;
        let hex = element.value.toUpperCase();

        console.log(typeof hex);
        console.log(hex);
        palette.style.background = hex;
        palette.dataset.color = hex.slice(1, 7);
        palette.children[0].innerHTML = hex.slice(1, 7);

        brightnessChange(palette, hex.slice(1, 7));
    });
}

function initializePalette() {
    let subColorArr = [];
    palettes.forEach((palette) => {
        changeColor(palette);
        subColorArr.push(palette.dataset.color);

        //add colorHex to span
        const collection = document.querySelector(".collection");
        const colorBlock = document.createElement("div");
        const hexNumber = document.createElement("span");
        colorBlock.appendChild(hexNumber);
        colorBlock.classList.add("colorBlock");
        collection.appendChild(colorBlock);

        //add eventListener to copyButton
        const copyButton = palette.children[2];
        copyButton.addEventListener("click", copyHex);

        //use color input to change color;
        const colorSelector = palette.children[5];

        selectColor(colorSelector);

        // add Drag event to palette;
        addDragEvt(palette);
    });
    //push color set to colorHistory;
    colorHistory.push(subColorArr);
}

initializePalette();
function turnBack() {
    if (currentHistory > 0) {
        currentHistory--;
        palettes.forEach((palette, index) => {
            palette.dataset.color = `${colorHistory[currentHistory][index]}`;
            palette.style.backgroundColor = `#${colorHistory[currentHistory][index]}`;
            palette.children[0].innerHTML = colorHistory[currentHistory][index];
            palette.children[3].value = `#${colorHistory[currentHistory][index]}`;
            console.log(palette.style.backgroundColor);
        });
    }
}
function turnFront() {
    if (currentHistory < colorHistory.length - 1) {
        currentHistory++;
        palettes.forEach((palette, index) => {
            palette.dataset.color = `${colorHistory[currentHistory][index]}`;
            palette.style.backgroundColor = `#${colorHistory[currentHistory][index]}`;
            palette.children[0].innerHTML = colorHistory[currentHistory][index];
            palette.children[3].value = `#${colorHistory[currentHistory][index]}`;
        });
    }
}

changeButton.addEventListener("click", () => {
    const palettes = document.querySelectorAll(".palette");
    //當改變顏色時會將colorHistory[currentHistory]後面的顏色清空
    colorHistory = colorHistory.filter((colors, index) => {
        return index <= currentHistory;
    });

    palettes.forEach((palette) => {
        if (palette.children[1].dataset.lock == "false") {
            changeColor(palette);
        }
    });
    //to save current color set
    let subColorArr = [];
    palettes.forEach((palette) => {
        subColorArr.push(palette.dataset.color);
    });
    colorHistory.push(subColorArr);
    currentHistory++;
    console.log(colorHistory);
});

turnBackButton.addEventListener("click", turnBack);
turnFrontButton.addEventListener("click", turnFront);
lockButtons.forEach((button) => {
    button.addEventListener("click", function () {
        if (this.dataset.lock == "false") {
            this.dataset.lock = "true";
            this.children[0].style.display = "none";
            this.children[1].style.display = "inline-block";
        } else {
            this.dataset.lock = "false";
            this.children[0].style.display = "inline-block";
            this.children[1].style.display = "none";
        }
    });
});

function mapArrayColorsToSideMenu(colorArr) {
    let sideMenuItem = document.createElement("div");
    let sideMenuItemColors = document.createElement("div");
    let selectColor = document.createElement("button");
    selectColor.innerHTML = "選擇";
    selectColor.classList.add("selectColor");
    let deleteColor = document.createElement("button");
    deleteColor.innerHTML = "刪除";
    deleteColor.classList.add("deleteColor");
    sideMenuItemColors.classList.add("colors");
    sideMenuItem.classList.add("sideMenuItem");
    sideMenuItem.appendChild(sideMenuItemColors);

    sideMenuItem.appendChild(selectColor);
    sideMenuItem.appendChild(deleteColor);
    colorArr.forEach((hex) => {
        let colorBox = document.createElement("div");
        colorBox.dataset.color = hex;
        colorBox.style.background = `#${hex}`;
        sideMenuItemColors.appendChild(colorBox);
    });
    sideMenuContainer.appendChild(sideMenuItem);

    selectColor.addEventListener("click", (e) => {
        console.log(e.target.parentElement.children[0].childNodes);
        let colors = e.target.parentElement.children[0].childNodes;
        const palettes = document.querySelectorAll(".palette");
        console.log(palettes[0]);
        console.log(colors[1].dataset.color);

        colors.forEach((color, index) => {
            console.log(index);
            palettes[index].dataset.color = color.dataset.color;
            palettes[index].style.background = `#${color.dataset.color}`;
            palettes[index].children[0].innerHTML = color.dataset.color;
            palettes[index].children[3].value = `#${color.dataset.color}`;
            brightnessChange(palettes[index], color.dataset.color);
        });
        colorSideMenu.classList.toggle("colorSideMenuOn");
        mask.style.zIndex = "-1";
    });
    deleteColor.addEventListener("click", (e) => {
        let colorList = JSON.parse(localStorage.getItem("colorList"));

        console.log(sideMenuContainer.childNodes);

        sideMenuContainer.childNodes.forEach((child, index) => {
            if (child === e.target.parentElement) {
                colorList.splice(index, 1);
            }
        });

        localStorage.setItem("colorList", JSON.stringify(colorList));
        e.target.parentElement.remove();
    });
}

//get localStorage data and map then to sidemenu
let colorList = localStorage.getItem("colorList");
if (colorList !== null) {
    colorList = JSON.parse(colorList);
    colorList.forEach(mapArrayColorsToSideMenu);
} else {
    colorList = [];
}

saveButton.addEventListener("click", () => {
    const palettes = document.querySelectorAll(".palette");
    const colorBlocks = document.querySelectorAll(".colorBlock");

    saveColorWindow.classList.toggle("saveColorWindowOn");
    mask.style.zIndex = "3";
    colorBlocks.forEach((colorBlock, index) => {
        colorBlock.style.backgroundColor = `#${palettes[index].dataset.color}`;
        colorBlock.children[0].innerHTML = palettes[index].dataset.color;
    });
});
closeButton.addEventListener("click", () => {
    mask.style.zIndex = "-1";
    saveColorWindow.classList.remove("saveColorWindowOn");
});
cancelButton.addEventListener("click", () => {
    mask.style.zIndex = "-1";
    saveColorWindow.classList.remove("saveColorWindowOn");
});

save.addEventListener("click", () => {
    const palettes = document.querySelectorAll(".palette");
    let arr = [];
    palettes.forEach((palette) => {
        arr.push(palette.dataset.color);
    });
    colorList.push(arr);
    localStorage.setItem("colorList", JSON.stringify(colorList));
    mapArrayColorsToSideMenu(arr);
    saveColorWindow.classList.remove("saveColorWindowOn");
    mask.style.zIndex = "-1";
});

colorSideMenuButton.addEventListener("click", () => {
    colorSideMenu.classList.toggle("colorSideMenuOn");
    mask.style.zIndex = "3";
});
colorSideMenuClose.addEventListener("click", () => {
    colorSideMenu.classList.toggle("colorSideMenuOn");
    mask.style.zIndex = "-1";
});

mask.addEventListener("click", () => {
    colorSideMenu.classList.remove("colorSideMenuOn");
    saveColorWindow.classList.remove("saveColorWindowOn");
    mask.style.zIndex = "-1";
});
function copyHex() {
    let colorHex = this.parentElement.dataset.color;
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.value = `#${colorHex}`;
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
    window.alert("已複製該顏色");
}

let spans = document.querySelectorAll("span");
spans.forEach((span) => {
    span.addEventListener("mousedown", (e) => {
        e.stopPropagation();
    });
});

function addDragEvt(element) {
    element.addEventListener("mousedown", () => {
        element.setAttribute("draggable", "true");
    });
    element.addEventListener("dragstart", (e) => {
        element.classList.add("dragging");
        source = element;
    });
    element.addEventListener("dragend", () => {
        element.classList.remove("dragging");
        element.removeAttribute("draggable");
        source = null;
    });
}

let overItem = null;
function cleanOverItem() {
    if (!overItem) return;
    overItem.classList.remove("before");
    overItem.classList.remove("after");
    overItem = null;
}
function addDropEvt(element) {
    element.addEventListener("dragover", (e) => {
        cleanOverItem();

        if (e.target.getAttribute("data-color") && e.target !== source) {
            overItem = e.target;

            if (e.offsetX > e.target.offsetWidth / 2) {
                overItem.classList.add("after");
            } else {
                overItem.classList.add("before");
            }
        }
        e.preventDefault();
    });
    element.addEventListener("drop", (e) => {
        const list = document.querySelector(".palette-container");
        if (overItem) {
            if (overItem.classList.contains("before")) {
                list.insertBefore(source, overItem);
            } else {
                list.insertBefore(source, overItem.nextElementSibling);
            }
        } else {
            if (e.currentTarget.contains(source)) return;
            list.appendChild(source);
        }
        cleanOverItem();
    });
}

addDropEvt(list);
