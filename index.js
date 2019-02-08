let root = document.querySelector('.root ul');
let treeData;
TreeAPI.getData().then((res) => {
    let data = res.data;
    treeData = flatToHierarchy(data);
    createTreeElement(treeData, root);

});

function createNodeContent(text) {
    let innerText = document.createElement('p');
    innerText.innerText = text;

    let delButton = document.createElement('button');
    delButton.innerText = '-';
    delButton.setAttribute('data', 'del');

    let addButton = document.createElement('button');
    addButton.innerText = '+';
    addButton.setAttribute('data', 'add');

    innerText.appendChild(delButton);
    innerText.appendChild(addButton);

    return innerText;
}

function createTreeElement(array, parent) {
    for (let i = 0; i < array.length; i++) {
        let newElement = document.createElement('li');
        newElement.id = array[i].id;

        let innerText = createNodeContent(array[i].id);

        parent.appendChild(newElement);
        newElement.appendChild(innerText);

        if (array[i].children) {
            let subTree = document.createElement('ul');
            newElement.appendChild(subTree);
            createTreeElement(array[i].children, subTree);
        }

    }
}

function flatToHierarchy(data) {
    let roots = [];
    let all = {};
    data.forEach(function (item) {
        all[item.id] = item
    });
    Object.keys(all).forEach(function (id) {
        let item = all[id];
        if (item.parent === null) {
            roots.push(item)
        } else if (item.parent in all) {
            let p = all[item.parent];
            if (!('children' in p)) {
                p.children = []
            }
            p.children.push(item)
        }
    });

    return roots;
}

/**
 *
 * @param element
 * @param matchingId
 * @returns {*}
 */
function searchInTree(element, matchingId) {
    if (element.id === matchingId) {
        return element;
    } else if (element.children != null) {
        let i;
        let result = null;
        for (i = 0; result == null && i < element.children.length; i++) {
            result = searchInTree(element.children[i], matchingId);
        }
        return result;
    }
    return null;
}

function handleClick(e) {
    let target = e.target;
    let action = target.getAttribute('data');
    if (action) {
        this[action](e);
    }
}

function del(e) {
    let target = e.target;
    let targetClosest = target.closest('li');
    let subtreeToDelete = searchInTree(treeData[0], targetClosest.getAttribute('id'));
    if (subtreeToDelete) {
        let parent = searchInTree(treeData[0], subtreeToDelete.parent);
        parent.children.forEach((elem, index) => {
            if (elem.id === subtreeToDelete.id) {
                parent.children.splice(index, 1);
            }
        });
    }
    targetClosest.parentNode.removeChild(targetClosest);

}

function add(e) {
    let target = e.target;

    let targetClosest = target.closest('li');
    let parent = searchInTree(treeData[0], targetClosest.id);
    if (!('children' in parent)) {
        parent.children = []
    }

    let dateString = '' + new Date().getTime();
    let newElement = {id: dateString.substr(dateString.length - 6, 6), parent: targetClosest.id};
    parent.children.push(newElement);
    let parentUlElement = document.getElementById(parent.id).getElementsByTagName('ul')[0];
    if (!parentUlElement) {
        parentUlElement = document.createElement('ul');
        document.getElementById(parent.id).appendChild(parentUlElement);
    }
    createTreeElement([newElement], parentUlElement);
}

root.onclick = (event) => {
    handleClick(event)
};

