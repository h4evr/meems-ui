YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Array",
        "Aside",
        "Button",
        "ButtonGroup",
        "Dom",
        "DomEvents",
        "Fn",
        "Footer",
        "Form",
        "Group",
        "Handler",
        "Header",
        "Html",
        "List",
        "ListItem",
        "Map",
        "Page",
        "PageHolder",
        "Scroll",
        "SplitView",
        "Tab",
        "TabGroup",
        "TextField",
        "Touch",
        "Widget",
        "meems-ui",
        "observable",
        "observable.Observable"
    ],
    "modules": [
        "aside",
        "button",
        "buttongroup",
        "footer",
        "form",
        "group",
        "header",
        "html",
        "list",
        "meems-events",
        "meems-scroll",
        "meems-ui",
        "meems-utils",
        "observable",
        "page",
        "pageholder",
        "splitview",
        "tab",
        "tabgroup",
        "textfield",
        "widget"
    ],
    "allModules": [
        {
            "displayName": "aside",
            "name": "aside",
            "description": "A component that holds a menu and a content area, allowing the menu to be toggled on and off."
        },
        {
            "displayName": "button",
            "name": "button",
            "description": "A component that represents a button."
        },
        {
            "displayName": "buttongroup",
            "name": "buttongroup",
            "description": "A component that represents a button group."
        },
        {
            "displayName": "footer",
            "name": "footer",
            "description": "A footer component, to be used with the Page component.\nExposes a 'buttons' facet."
        },
        {
            "displayName": "form",
            "name": "form",
            "description": "A form that can hold several input widgets.\nThe attributes 'action' and 'title' are available."
        },
        {
            "displayName": "group",
            "name": "group",
            "description": "Enables the grouping of several components in the same view."
        },
        {
            "displayName": "header",
            "name": "header",
            "description": "A header component, to be used with the Page component.\nExposes a 'buttonsleft' and 'buttonsright' facet.\nThe attribute 'title' must be used to set the title of the page."
        },
        {
            "displayName": "html",
            "name": "html",
            "description": "Component that can render HTML using Mustache templates.\nDefine the template using the 'html' attribute and bind data using the 'data' attribute.\nIf any of those are observable attributes, the component will be updated when any of them\nchanges."
        },
        {
            "displayName": "list",
            "name": "list",
            "description": "List component that will render based on templates.\nSupports header items for grouping."
        },
        {
            "displayName": "meems-events",
            "name": "meems-events",
            "description": "Module that provides methods and mixins related with event handling."
        },
        {
            "displayName": "meems-scroll",
            "name": "meems-scroll",
            "description": "Emulates scrolling on a set of components, with scroll-bars, as if on a mobile environment."
        },
        {
            "displayName": "meems-ui",
            "name": "meems-ui",
            "description": "Provides all Meems UI components.\nFactory module, allows the user to create any UI widget through a single method."
        },
        {
            "displayName": "meems-utils",
            "name": "meems-utils",
            "description": "Contains a set of methods that facilitate several tasks."
        },
        {
            "displayName": "observable",
            "name": "observable",
            "description": "This module provides helper methods for detecting changes in object properties,\ntriggering observers when anything happens."
        },
        {
            "displayName": "page",
            "name": "page",
            "description": "A page component.\nExposes several facets: header, content, footer."
        },
        {
            "displayName": "pageholder",
            "name": "pageholder",
            "description": "A bag for all the pages in a program. Allows to transition between pages."
        },
        {
            "displayName": "splitview",
            "name": "splitview",
            "description": "Component that holds two widgets and puts them side by side.\nExposes the facets `first` and `second`."
        },
        {
            "displayName": "tab",
            "name": "tab",
            "description": "A tab to be used with the `TabGroup` component.\nExposes the `content` facet."
        },
        {
            "displayName": "tabgroup",
            "name": "tabgroup",
            "description": "Groups several tabs and allows to change between them."
        },
        {
            "displayName": "textfield",
            "name": "textfield",
            "description": "A component that allows the user to input information.\nExposes the attributes `label` and `type`.\nThe later can be used to change the type of input it expects, according to the HTML5 specs."
        },
        {
            "displayName": "widget",
            "name": "widget",
            "description": "A base class for all widgets."
        }
    ]
} };
});