let root = document.querySelector('.root ul');
let treeData;
TreeAPI.getData().then((res) => {
    data = res.data;
    treeData = flatToHierarchy(data);
    createTreeElement(treeData, root);

});

function createTreeElement(array, parent) {
    for (let i = 0; i < array.length; i++) {
        let newElement = document.createElement('li');
        newElement.id = array[i].id;
        let innerText = document.createElement('p');
        let delButton = document.createElement('button');
        delButton.innerText = '-';
        delButton.setAttribute('data', 'del');
        let addButton = document.createElement('button');
        addButton.innerText = '+';
        addButton.setAttribute('data', 'add');
        innerText.innerText = array[i].id;
        parent.appendChild(newElement);
        newElement.appendChild(innerText);
        innerText.appendChild(delButton);
        innerText.appendChild(addButton);
        if (array[i].Children) {
            let subTree = document.createElement('ul');
            newElement.appendChild(subTree);
            createTreeElement(array[i].Children, subTree);
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
            if (!('Children' in p)) {
                p.Children = []
            }
            p.Children.push(item)
        }
    });
    return roots;
}


function searchTree(element, matchingId) {
    if (element.id === matchingId) {
        return element;
    } else if (element.Children != null) {
        let i;
        let result = null;
        for (i = 0; result == null && i < element.Children.length; i++) {
            result = searchTree(element.Children[i], matchingId);
        }
        return result;
    }
    return null;
}

function addDel(elem) {
    this.del = function (e) {
        let target = e.target;
        let targetClosest = target.closest('li');
        let subtreeToDelete = searchTree(treeData[0], targetClosest.getAttribute('id'));
        if (subtreeToDelete) {
            let parent = searchTree(treeData[0], subtreeToDelete.parent);
            parent.Children.forEach((elem, index) => {
                if (elem.id === subtreeToDelete.id) {
                    parent.Children.splice(index, 1);
                }
            });
        }
        targetClosest.parentNode.removeChild(targetClosest);

    };

    this.add = function (e) {
        let target = e.target;
        let targetClosest = target.closest('li');
        let parent = searchTree(treeData[0], targetClosest.id);
        if (!('Children' in parent)) {

            parent.Children = []
        }
        let dateString = "" + new Date().getTime();
        parent.Children.push({id: dateString.substr(dateString.length - 6, 6), parent: targetClosest.id});
        root.removeChild(root.querySelector('li'));
        createTreeElement(treeData, root);

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

new addDel(document.querySelector('.root'));

