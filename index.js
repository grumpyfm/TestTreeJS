TreeAPI.getData().then((res) => {
    let data = res.data;
    let tree = new Tree(data);
    tree.createTreeElement();
});
