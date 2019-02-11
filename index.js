TreeAPI.getData().then((res) => {
    let data = res.data;
    let tree = new Tree(data);
    tree.createTreeElement();
});

class Tree {

    constructor(data) {
        this.treeData = this.flatToHierarchy(data);
        this.root = document.querySelector('.root ul');
    }

    createTreeElement(array = this.treeData, parent = this.root) {
        for (let i = 0; i < array.length; i++) {
            let newElement = document.createElement('li');
            newElement.id = array[i].id;

            let innerText = this.createNodeContent(array[i].id);

            parent.appendChild(newElement);
            newElement.appendChild(innerText);

            if (array[i].children) {
                let subTree = document.createElement('ul');
                newElement.appendChild(subTree);
                this.createTreeElement(array[i].children, subTree);
            }

        }
        this.root.onclick = (event) => this.handleClick(event);
    }

    createNodeContent(text) {
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


    flatToHierarchy(data) {
        let roots = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].parent === null) {
                roots.push(data[i])
            }
            for (let j = i + 1; j < data.length; j++) {
                if (data[i].id === data[j].parent) {

                    if (!('children' in data[i])) {
                        data[i].children = []
                    }
                    data[i].children.push(data[j])
                }
            }
        }
        return roots;
    }


    searchInTree(element, matchingId) {
        if (element.id === matchingId) {
            return element;
        } else if (element.children != null) {
            let i;
            let result = null;
            for (i = 0; result == null && i < element.children.length; i++) {
                result = this.searchInTree(element.children[i], matchingId);
            }
            return result;
        }
        return null;
    }

    handleClick(e) {
        let target = e.target;
        let action = target.getAttribute('data');
        if (action) {
            this[action](e);
        }
    }

    del(e) {
        let target = e.target;
        let targetClosest = target.closest('li');
        let subtreeToDelete = this.searchInTree(this.treeData[0], targetClosest.getAttribute('id'));
        if (subtreeToDelete) {
            let parent = this.searchInTree(this.treeData[0], subtreeToDelete.parent);
            if (parent !== null) {
                parent.children.forEach((elem, index) => {
                    if (elem.id === subtreeToDelete.id) {
                        parent.children.splice(index, 1);
                    }
                });
            }
        }
        targetClosest.parentNode.removeChild(targetClosest);
    }

    add(e) {
        let target = e.target;
        let targetClosest = target.closest('li');
        let parent = this.searchInTree(this.treeData[0], targetClosest.id);
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
        this.createTreeElement([newElement], parentUlElement);
    }

}
