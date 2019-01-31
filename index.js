let data = [];
let root = document.getElementById('root');

TreeAPI.getData().then((res) => {
    data = res.data;
    for (let i = 0; i < data.length; i++) {
        createElement(i);
    }
});

function createElement(i) {
    let newElement = document.createElement('div');
    newElement.id = data[i].id;
    newElement.className = 'treeElement';
    let textSpace = document.createElement('div');
    textSpace.className = 'textSpace';
    let span = document.createElement('div');

    let delButton = document.createElement('button');
    delButton.innerText = '-';
    delButton.setAttribute('data', 'del');
    let addButton = document.createElement('button');
    addButton.innerText = '+';
    addButton.setAttribute('data', 'add');

    span.innerText = data[i].id;
    if (data[i].parent === null) {
        root.appendChild(newElement);
    } else {
        let parent = document.getElementById(data[i].parent);
        parent.appendChild(newElement);
    }
    newElement.appendChild(textSpace);
    textSpace.appendChild(span);
    span.appendChild(delButton);
    span.appendChild(addButton);
    let rect = textSpace.getBoundingClientRect();
    // newElement.setAttribute('data-top', 'del');
    console.log('top',rect.top);
    console.log('rect.right', rect.right);
    console.log('rect.bottom,', rect.bottom);
    console.log('left',rect.left);

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

root.appendChild(createLine(1321/2 , 147 , 1301, 167.4375 ));

function addDel(elem) {
    this.del = function (e) {
        let target = e.target;
        let td = target.closest('.treeElement');
        td.style.display = 'none';
    };

    this.add = function (e) {
        let target = e.target;
        let td = target.closest('.treeElement');
        data.push({id: (data.length + 1).toString(), parent: td.id});
        createElement(data.length - 1);
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

