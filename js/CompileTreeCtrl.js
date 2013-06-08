'use strict';

function treeItems() {
    $('li:has(ul)')
            .click(function(event) {
        if (this == event.target) {
            if ($(this).children().is(':hidden')) {
                $(this)
                        .css('list-style-image', 'url(img/minus.gif)')
                        .children().slideDown();
            }
            else {
                $(this)
                        .css('list-style-image', 'url(img/plus.gif)')
                        .children().slideUp();
            }
        }
        return false;
    })
            .css({cursor: 'pointer',
        'list-style-image': 'url(img/plus.gif)'})
            .children().hide();
    $('li:not(:has(ul))').css({
        cursor: 'default',
        'list-style-image': 'none'
    });
}

var treeModel1 = {
    "root": [
        {"self": "branch1", "branch": []},
        {self: "branch2", "branch": [{"self": "branch2.1", "branch": []}, {"self": "branch2.2", "branch": []}]},
        {"self": "branch3", "branch": []}
    ]
};

var treeModel2 = [
    {
        "name": "tree1",
        "children": [
            {name: "tree1.1", "children": [{"name": "tree1.1.1"}]}, {name: "tree1.2"}
        ]
    },
    {"name": "tree2", "children": [{name: "tree2.1"}]},
    {"name": "tree3"}
];

function CompileTreeCtrl($scope) {
    $scope.treeItem = treeModel1;
    $scope.tree = treeModel2;

    function treeItems() {
        $('li:has(ul)')
                .click(function(event) {
            if (this == event.target) {
                if ($(this).children().is(':hidden')) {
                    $(this)
                            .css('list-style-image', 'url(img/minus.gif)')
                            .children().slideDown();
                }
                else {
                    $(this)
                            .css('list-style-image', 'url(img/plus.gif)')
                            .children().slideUp();
                }
            }
            return false;
        })
                .css({cursor: 'pointer',
            'list-style-image': 'url(img/plus.gif)'})
                .children().hide();
        $('li:not(:has(ul))').css({
            cursor: 'default',
            'list-style-image': 'none'
        });
    }

}