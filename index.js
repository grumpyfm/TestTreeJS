let data = [];
let root = document.getElementById('root');

TreeAPI.getData().then((res) => {
    data = res.data;
    for (let i = 0; i < data.length; i++) {
        createTreeElement(i);
    }
    drawLines();
});

function createTreeElement(i) {
    let newElement = document.createElement('div');
    newElement.id = data[i].id;
    newElement.className = 'treeElement';
    let textSpace = document.createElement('div');
    textSpace.className = 'textSpace';
    let innerText = document.createElement('div');

    let delButton = document.createElement('button');
    delButton.innerText = '-';
    delButton.setAttribute('data', 'del');
    let addButton = document.createElement('button');
    addButton.innerText = '+';
    addButton.setAttribute('data', 'add');

    innerText.innerText = data[i].id;
    if (data[i].parent === null) {
        root.appendChild(newElement);
    } else {
        let parent = document.getElementById(data[i].parent);
        parent.appendChild(newElement);
    }
    newElement.appendChild(textSpace);
    textSpace.appendChild(innerText);
    innerText.appendChild(delButton);
    innerText.appendChild(addButton);
}

function createLineElement(x, y, length, angle) {
    let line = document.createElement("div");
    let styles = 'border: 1px solid black; '
        + 'width: ' + length + 'px; '
        + 'height: 0px; '
        + '-moz-transform: rotate(' + angle + 'rad); '
        + '-webkit-transform: rotate(' + angle + 'rad); '
        + '-o-transform: rotate(' + angle + 'rad); '
        + '-ms-transform: rotate(' + angle + 'rad); '
        + 'position: absolute; '
        + 'top: ' + y + 'px; '
        + 'left: ' + x + 'px; ';
    line.setAttribute('style', styles);
    return line;
}

function drawLines() {
    let elements = root.getElementsByClassName("line");
    while (elements[0]) {
        elements[0].parentNode.removeChild(elements[0]);
    }
    for (let i = 0; i < data.length; i++) {
        if (data[i].parent !== null) {
            let elementTo = document.getElementById(data[i].id);
            if (elementTo !== null) {
                let elementFrom = document.getElementById(data[i].parent);
                let textFrom = elementFrom.querySelector('.textSpace div');
                let from = textFrom.getBoundingClientRect();
                let x1 = (from.right - from.left) / 2 + from.left;
                let y1 = from.bottom;
                let textTo = elementTo.querySelector('.textSpace div');
                let to = textTo.getBoundingClientRect();
                let x2 = (to.right - to.left) / 2 + to.left;
                let y2 = to.top;
                let line = createLine(x1, y1, x2, y2);
                line.className = 'line';

                root.appendChild(line);
            }
        }
    }
}

function createLine(x1, y1, x2, y2) {
    let a = x1 - x2,
        b = y1 - y2,
        c = Math.sqrt(a * a + b * b);
    let sx = (x1 + x2) / 2,
        sy = (y1 + y2) / 2;
    let x = sx - c / 2,
        y = sy;

    let alpha = Math.PI - Math.atan2(-b, a);

    return createLineElement(x, y, c, alpha);
}

function addDel(elem) {
    this.del = function (e) {
        let target = e.target;
        let td = target.closest('.treeElement');
        td.parentNode.removeChild(td);
        drawLines();
    };
    this.add = function (e) {
        let target = e.target;
        let td = target.closest('.treeElement');
        data.push({id: (data.length + 1).toString(), parent: td.id});
        createTreeElement(data.length - 1);
        drawLines();
    };
    let self = this;
    elem.onclick = function (e) {
        let target = e.target;
        let action = target.getAttribute('data');
        if (action) {
            self[action](e);
        }
    }
}
new addDel(document.querySelector('#root'));

