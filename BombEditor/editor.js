// T: TODO Fix how phone is displayed in the simulator.
// T: TODO Investigate the incorrect use of "for" property of label
// T: TODO Remove animations from highligh side
// T: TODO Add on the top the possibiltiy to specify a name for the project?
// T: TODO Add a real beginning section
// T: TODO Add a section where you can manage projects, files...
// T: TODO I think it's necessary to add a transition for the section when it's closed and when it's opened.
// T: TODO Add an image of an analog stick in sections dedicated to it
// T: TODO Probably it's better to put scrolling on y-axis in Controller Content, so the rest of the 
// UI will be remain fixed where it is.
// T: TODO I think that is necessary to substitute some target.closest with currentTarget... search for them

import { Vector2 } from './vector2.js';





const CONST = {
    tab_header_id: "tab-header",
    new_tab_id: "new-tab",
    tab_controller: "controller-tab",
    cross_tab: "close-tab",

    pages_div_id: "pages-div",
    hidden_editor_page_id: "page_hidden",
    section_hidden_id: "editor_page_section_hidden",

    button_hidden_id: "button_hidden",
    slider_hidden_id: "slider_hidden",
    checkbox_hidden_id: "checkbox_hidden",
    radio_button_hidden_id: "radio_button_hidden",
    analog_stick_hidden_id: "analog_stick_hidden",
    dpad_hidden_id: "dpad_hidden",
    editor_page_buttons_id: "editor_page_buttons_hidden",
    scrollable_container_element_buttons_id: "scrollable_container_element_buttons_hidden",

    simple_textbox_id: "simple_textbox_hidden",
    simple_checkbox_id: "simple_checkbox_hidden",
    simple_slider_id: "simple_slider_hidden",
    simple_expandable_list_id: "simple_expandable_list_hidden",

    // T: This need to be completed by the id of the controller
    editor_simulator_phone_frame_id: "editor_simulator_phone_frame_",
    editor_simulator_phone_frame_class: "editor-simulator-phone-frame",

    controller_content_class: "editor-page-controller-content",
    scrollable_container_element_class: "scrollable-container-element",

    section_class: "editor-page-section",
    section_header_div_class: "editor-page-section-header",
    section_header_arrow_class: "editor-page-section-header-arrow",
    section_header_cross_class: "editor-page-section-cross",
    section_content_class: "editor-page-section-content",

    save_project_button_id: "save_project",
    import_project_button_id: "import_project",
    import_project_input_id: "import_project_input",
    export_html_button_id: "export_html",
    update_simulator_button_id: "update_simulator",
}

const DRAG_TYPE = {
    TAB: "tab",
    SECTION_CONTENT: "section_content",
    CONTAINER_ELEMENT: "scrollable-container-element",
}

const UI = {
    selected_tab: null,
    current_page: null,

    // T: TODO Remove it and everything that is related to it because it's useless(probably)
    next_section: 0,
}

const INPUT_STATE = {
    grab_tab_offset: null,
    grabbed_tab: null,
    grabbed_section: null,
    grabbed_container_element: null,
    last_overed_container_element: null,

    // T: This variable represent the type of elements that are dragged around
    grabbed_type: null,
}





// T: This is the part of the code that interact with the project (START)
// T: TODO Note that in this part group is the correspondent of a section, it is obvious that is necessary
// that names become equals.
// T: TODO This class express the structure of the project and also the structure of the element
// that will be then displayed in the UI. But a lot of this code is expressed like setting elements
// in JSON. I think that this code needs at least to be re-structured.
class PROJECT {

    // T: This is the object that represent the project
    static CURRENT_PROJ = {
        controllers: {

        },
    }

    static next_controller_id = 0;
    static next_group_id = 0;
    static next_element_id = 0;

    // T: This are all the type of input that can be placed in the editor
    static TYPES = {
        BUTTON: "button",
        SLIDER: "slider",
        CHECKBOX: "checkbox",
        RADIO_BUTTON: "radio_button",
        ANALOG_STICK: "analog_stick",
        DPAD: "dpad",
    }

    // T: Each one of this will represent a specific type of field. Useful to auto-generate the editor on
    // the base of how the project is structured.
    // T: TODO Move out of this class?
    static TYPES_FIELD = {
        SIMPLE_TEXT: CONST.simple_textbox_id,
        SIMPLE_CHECKBOX: CONST.simple_checkbox_id,
        SIMPLE_SLIDER: CONST.simple_slider_id,
        SIMPLE_EXPANDABLE_LIST: CONST.simple_expandable_list_id,

        // T: TODO Define better this...
    }

    static new_controller()
    {
        const controller_id = "controller_" + this.next_controller_id;
        this.CURRENT_PROJ.controllers[controller_id] = {
            controller_name: controller_id,
            groups_order: [],
            groups: {},
        };
        this.next_controller_id += 1;

        this.CURRENT_PROJ.controllers[controller_id];

        // T: DEBUG
        console.log(this.CURRENT_PROJ);

        return controller_id;
    }

    static new_group(controller_id)
    {
        const new_group_id = "group_" + this.next_group_id;
        this.next_group_id += 1;
        const new_group = { 
            elems_order: [], 
            elems: {},
        };
        const controller = this.CURRENT_PROJ.controllers[controller_id];
        controller.groups_order.push(new_group_id);
        controller.groups[new_group_id] = new_group;

        return new_group_id;
    }

    static new_button(controller_id, group_id)
    {
        const controller = this.CURRENT_PROJ.controllers[controller_id];
        const new_el_id = "el_" + this.next_element_id;
        this.next_element_id += 1;

        const new_group = controller.groups[group_id];
        new_group.elems_order.push(new_el_id);
        new_group.elems[new_el_id] = {
            type: this.TYPES.BUTTON,

            fields:
            {
                id:                 { type: this.TYPES_FIELD.SIMPLE_TEXT, value: "new_button_id" },
                "text displayed":   { type: this.TYPES_FIELD.SIMPLE_TEXT, value: "new_button" },

                x:                  { type: this.TYPES_FIELD.SIMPLE_SLIDER, value: "0", min: "0", max: "100" },
                y:                  { type: this.TYPES_FIELD.SIMPLE_SLIDER, value: "0", min: "0", max: "101" },
            },
        };

        return new_el_id;
    }

    static new_slider(controller_id, group_id)
    {
        const controller = this.CURRENT_PROJ.controllers[controller_id];
        const new_el_id = "el_" + this.next_element_id;
        this.next_element_id += 1;

        const new_group = controller.groups[group_id];
        new_group.elems_order.push(new_el_id);
        new_group.elems[new_el_id] = {
            type: this.TYPES.SLIDER,

            fields:
            {
                id:                 { type: this.TYPES_FIELD.SIMPLE_TEXT,       value: "new_slider_id" },
                "text displayed":   { type: this.TYPES_FIELD.SIMPLE_TEXT,       value: "new_slider" },
                "min value":        { type: this.TYPES_FIELD.SIMPLE_TEXT,       value: "0" },
                "max value":        { type: this.TYPES_FIELD.SIMPLE_TEXT,       value: "100" },
                "default value":    { type: this.TYPES_FIELD.SIMPLE_TEXT,       value: "0" },
                sync:               { type: this.TYPES_FIELD.SIMPLE_CHECKBOX,   value: "true" }
            }
        };

        return new_el_id;
    }

    static new_checkbox(controller_id, group_id)
    {
        const controller = this.CURRENT_PROJ.controllers[controller_id];
        const new_el_id = "el_" + this.next_element_id;
        this.next_element_id += 1;

        const new_group = controller.groups[group_id];
        new_group.elems_order.push(new_el_id);
        new_group.elems[new_el_id] = {
            type: this.TYPES.CHECKBOX,

            fields:
            {
                id:                 { type: this.TYPES_FIELD.SIMPLE_TEXT,       value: "new_checkbox_id" },
                "text displayed":   { type: this.TYPES_FIELD.SIMPLE_TEXT,       value: "new_checkbox" },
                "default value":    { type: this.TYPES_FIELD.SIMPLE_CHECKBOX,   value: "true" },
                sync:               { type: this.TYPES_FIELD.SIMPLE_CHECKBOX,   value: "true" }
            }
        };

        return new_el_id;
    }

    static new_analog_stick(controller_id, group_id)
    {
        const controller = this.CURRENT_PROJ.controllers[controller_id];
        const new_el_id = "el_" + this.next_element_id;
        this.next_element_id += 1;
        
        const new_group = controller.groups[group_id];
        new_group.elems_order.push(new_el_id);
        new_group.elems[new_el_id] = {
            type: this.TYPES.ANALOG_STICK,

            fields:
            {
                id:                 { type: this.TYPES_FIELD.SIMPLE_TEXT,       value: "new_slider_id" },
            }
        };

        return new_el_id;
    }

    static new_dpad(controller_id, group_id)
    {
        const controller = this.CURRENT_PROJ.controllers[controller_id];
        const new_el_id = "el_" + this.next_element_id;
        this.next_element_id += 1;
        
        const new_group = controller.groups[group_id];
        new_group.elems_order.push(new_el_id);
        new_group.elems[new_el_id] = {
            type: this.TYPES.DPAD,

            fields:
            {
                up:                 { type: this.TYPES_FIELD.SIMPLE_TEXT,       value: "up_id", text_displayed: "▲" },
                right:              { type: this.TYPES_FIELD.SIMPLE_TEXT,       value: "right_id", text_displayed: "▶" },
                down:               { type: this.TYPES_FIELD.SIMPLE_TEXT,       value: "down_id", text_displayed: "▼" },
                left:               { type: this.TYPES_FIELD.SIMPLE_TEXT,       value: "left_id", text_displayed: "◀" },
            }
        };

        return new_el_id;
    }

    static new_radio_buttons(controller_id, group_id)
    {
        const controller = this.CURRENT_PROJ.controllers[controller_id];
        const new_el_id = "el_" + this.next_element_id;
        this.next_element_id += 1;
        
        const new_group = controller.groups[group_id];
        new_group.elems_order.push(new_el_id);
        new_group.elems[new_el_id] = {
            type: this.TYPES.RADIO_BUTTON,

            fields:
            {
                id:                 { type: this.TYPES_FIELD.SIMPLE_TEXT, value: "new_radio_button_id" },
                name:               { type: this.TYPES_FIELD.SIMPLE_TEXT, value: "new_radio_button" },
                options:            { type: this.TYPES_FIELD.SIMPLE_EXPANDABLE_LIST, value: [ "option_1", "option_2" ] },
            }
        };

        return new_el_id;
    }

    static remove_group(controller_id, group_id)
    {
        const controller = this.CURRENT_PROJ.controllers[controller_id];

        // T: DEBUG
        console.log(controller);

        delete controller.groups[group_id];

        const index = controller.groups_order.indexOf(group_id);
        if (index > -1)
        {
            controller.groups_order.splice(index, 1);
        }
    }

    // T: This function is used to remove a generic element with id: el_id contained in the group with id: group_id and in the
    // controller with id: controller_id.
    static remove_el(controller_id, group_id, el_id)
    {
        const controller = this.CURRENT_PROJ.controllers[controller_id];
        const group = controller.groups[group_id];
        delete group.elems[el_id];

        const index = group.elems_order.indexOf(el_id);
        if (index > -1)
        {
            group.elems_order.splice(index, 1);
        }
    }

    static move_group(controller_id, group_id_to_move, group_id_where_to_move)
    {
        const controller = this.CURRENT_PROJ.controllers[controller_id];

        // T: DEBUG
        // console.log(controller.groups_order);

        const index_to_move = controller.groups_order.indexOf(group_id_to_move);
        const index_where_to_move = controller.groups_order.indexOf(group_id_where_to_move);

        const group_to_remove = controller.groups_order[index_to_move];
        controller.groups_order.splice(index_to_move, 1);
        controller.groups_order.splice(index_where_to_move, 0, group_to_remove);

        // T: DEBUG
        // console.log(controller.groups_order);
    }

    static move_el(controller_id, el_id_to_move, el_id_where_to_move, group_id_from, group_id_to)
    {
        const controller = this.CURRENT_PROJ.controllers[controller_id];

        // T: DEBUG
        console.log(controller);

        // const index_group_from = controller.groups_order.indexOf(group_id_from);
        // const index_group_to = controller.groups_order.indexOf(group_id_to);

        const group_from = controller.groups[group_id_from];
        const group_to = controller.groups[group_id_to];

        // T: DEBUG
        console.log(group_from);
        console.log(group_to);

        const index_el_to_move = group_from.elems_order.indexOf(el_id_to_move);
        const index_el_where_to_move = group_to.elems_order.indexOf(el_id_where_to_move);

        const el_to_move = group_from.elems[el_id_to_move];
        const el_where_to_move = group_to.elems[el_id_where_to_move];

        // T: DEBUG
        // console.log(index_el_to_move);
        // console.log(index_el_where_to_move);
        console.log(el_to_move);
        console.log(el_where_to_move);

        group_from.elems_order.splice(index_el_to_move, 1);
        delete group_from.elems[el_id_to_move];
        group_to.elems_order.splice(index_el_where_to_move, 0, el_id_to_move);
        group_to.elems[el_id_to_move] = el_to_move;
    }

    static move_el_same_section(controller_id, el_id_to_move, el_id_where_to_move, group_id)
    {
        const controller = this.CURRENT_PROJ.controllers[controller_id];

        // T: DEBUG
        console.log(controller);

        const group = controller.groups[group_id];
    
        // T: DEBUG
        console.log(group);

        const index_el_to_move = group.elems_order.indexOf(el_id_to_move);
        const index_el_where_to_move = group.elems_order.indexOf(el_id_where_to_move);
    
        group.elems_order.splice(index_el_to_move, 1);
        group.elems_order.splice(index_el_where_to_move, 0, el_id_to_move);
    }

    // T: TODO Probably it's possible to make more granular this update, putting a specific id
    // on the HTML of each field.
    static update(controller_id, group_id, el_id)
    {
        const controller = this.CURRENT_PROJ.controllers[controller_id];

        // T: DEBUG
        console.log(controller);

        const group = controller.groups[group_id];

        // T: DEBUG
        console.log(group);

        const element = group.elems[el_id];

        // T: DEBUG
        console.log(element);

        const html_element = document.getElementById(el_id);

        for(const html_field of html_element.children)
        {
            const field_name = html_field.dataset.field_name;

            // T: TODO On this big if-else is where we are failing in my mind, it's not really
            // right for me that we are relying on this classes to retrieve what category is
            // the html field and so what to do. I think also that is wrong to rely on how
            // the html_element is made to understand how to retrieve data from the interface.
            // But at the same time I think that this is probably the unique way to do that...
            // Otherwise I can pratically assign a different id for each component and from
            // fields I start to retrieve the field to modify.
            // Also I think that is wrong to rely on how the html element is made to update
            // the content in the JSON file.
            if (html_field.dataset.type == PROJECT.TYPES_FIELD.SIMPLE_TEXT)
            {
                element.fields[field_name].value = html_field.children[1].value;
            }
            else if (html_field.dataset.type == PROJECT.TYPES_FIELD.SIMPLE_CHECKBOX)
            {
                element.fields[field_name].value = html_field.children[0].checked;
            }
            else if (html_field.dataset.type == PROJECT.TYPES_FIELD.SIMPLE_SLIDER)
            {
                element.fields[field_name].value = html_field.children[1].value;
            }
            else if (html_field.dataset.type == PROJECT.TYPES_FIELD.SIMPLE_EXPANDABLE_LIST)
            {
                element.fields[field_name].value = [];

                let index = 0;
                for (const html_field_2 of html_field.children)
                {
                    if (index > 0)
                    {
                        const option = html_field_2.children[1].value;
                        element.fields[field_name].value.push(option);
                    }

                    index += 1;
                }
            }
            else
            {
                // T: DEBUG
                console.log("It's not possible to handle this field:");
                console.log(html_field);
            }
        }
    }

    // T: TODO Temporary function to export in JSON the object.
    static export_json()
    {
        return JSON.stringify(this.CURRENT_PROJ);
    }

    // T: TODO This is temporary, we will decide in the future how to export
    // the project so that can be runned.
    static export(minimized)
    {
        const controllers = this.CURRENT_PROJ.controllers;
        let html_text = "<!DOCTYPE html>\n<html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover\"><title>BombTest</title><script src=\"eruda.js\"></script><link rel=\"stylesheet\" href=\"test_perfect_placement.css\"></head><body><div class=\"controller-viewport\">";
        // let css_text = "body,html{width:100%;height:100%}.controller-viewport{position:fixed;inset:0;width:100dvw;height:100dvh;overflow:hidden;touch-action:none;box-sizing:border-box;padding-top:env(safe-area-inset-top,0);padding-bottom:env(safe-area-inset-bottom,0);padding-left:env(safe-area-inset-left,0);padding-right:env(safe-area-inset-right,0);background-color:#00f}.control-element{position:absolute;width:auto;aspect-ratio:1/1;background-color:brown}\n";
        let css_text = `
            body, html {
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
                background-color: #000000; /* Phone screen bezel/outer background */
            }

            .controller-viewport {
                position: absolute;
                /* Inset the viewport away from the rounded corners */
                top: env(safe-area-inset-top, 12px);
                bottom: env(safe-area-inset-bottom, 12px);
                left: env(safe-area-inset-left, 24px);
                right: env(safe-area-inset-right, 24px);
                overflow: hidden;
                touch-action: none;
                box-sizing: border-box;
                background-color: #0000ff;
            }

            .control-element {
                position: absolute;
                width: auto;
                aspect-ratio: 1 / 1;
                background-color: brown;
            }
        `.replace(/\s+/g, " ");



        for(const [controller_name, controller] of Object.entries(controllers))
        {
            // T: DEBUG
            console.log(`controller_name=${controller_name}`);
            console.log(controller);

            for(const [group_name, group] of Object.entries(controller.groups))
            {
                // T: DEBUG
                console.log(`group_name=${group_name}`);
                console.log(group);

                for(const [element_name, element] of Object.entries(group.elems))
                {
                    // T: DEBUG
                    console.log(`element_name=${element_name}`);
                    console.log(element);

                    let html_element;
                    let css_element;

                    if (minimized)
                    {
                        html_element = `<div class=\"control-element\" id=\"${element_name}\"></div>`;
                        // let css_element = `#${element_name}{left:;top:;height:vmin;}`;
                        // let css_element = `#${element_name}{left:8%;top:50%;height:20vmin;}`;
                        css_element = `#${element_name}{left:${element.fields.x.value}%;top:${element.fields.y.value}%;height:20vmin;}`;
                    }
                    else
                    {
                        html_element = `<div class=\"control-element\" id=\"${element_name}\"></div>`;
                        // let css_element = `#${element_name}{left:;top:;height:vmin;}`;
                        // let css_element = `#${element_name}{left:8%;top:50%;height:20vmin;}`;
                        css_element = `\n#${element_name}\n{\n\tleft:${element.fields.x.value}%;\n\ttop:${element.fields.y.value}%;\n\theight:20vmin;\n}\n`;
                    }


                    html_text += html_element;
                    css_text += css_element;
                }
            }
        }

        html_text += "</div></body></html>";

        return [html_text, css_text];
    }

    static import_project(project_json)
    {
        // T: DEBUG
        console.log(project_json);

        this.CURRENT_PROJ = JSON.parse(project_json);

        // T: DEBUG
        console.log(this.CURRENT_PROJ);
    }
}

// T: TODO Only for debugging
window.PROJECT = PROJECT;
// T: This is the part of the code that interact with the project (END)





function on_click_tab(event)
{
    // T: DEBUG
    console.log(event);

    // T: TODO It will be necessary to find another solution to generate
    // only the event for when is clicked the close tab and not the rest
    // of the tab.
    if (event.target.classList.contains(CONST.cross_tab))
    {
        return;
    }

    const new_selected_tab = event.target.closest("." + CONST.tab_controller);
    if (new_selected_tab != UI.selected_tab)
    {
        UI.selected_tab.classList.remove("selected");
        new_selected_tab.classList.add("selected");
        UI.selected_tab = new_selected_tab;

        UI.current_page.classList.remove("selected");
        const new_selected_page = document.getElementById(UI.selected_tab.dataset.page_id);

        UI.current_page = new_selected_page;
        UI.current_page.classList.add("selected");
    }
}

// T: TODO Investigate why when I change the new selected tab, it needs some time
// to update in the UI it.
function on_close_tab(event)
{
    // T: DEBUG
    console.log(event);

    const closed_tab = event.target.closest("." + CONST.tab_controller);
    closed_tab.remove();

    if (closed_tab == UI.selected_tab)
    {
        const tab_header_div = document.getElementById(CONST.tab_header_id);
        UI.selected_tab = tab_header_div.children[0];
        UI.selected_tab.classList.add("selected");

        UI.current_page = document.getElementById(UI.selected_tab.dataset.page_id);
        UI.current_page.classList.add("selected");
    }

    const page = document.getElementById(closed_tab.dataset.page_id);
    page.remove();
}

function on_drag_tab(event)
{
    // T: DEBUG
    console.log(event);

    INPUT_STATE.grabbed_type = DRAG_TYPE.TAB;

    const grabbed_tab = event.target.closest("." + CONST.tab_controller);
    const rect = grabbed_tab.getBoundingClientRect();

    INPUT_STATE.grab_tab_offset = new Vector2(event.clientX - rect.left, event.clientY - rect.top);

    INPUT_STATE.grabbed_tab = grabbed_tab;

    // T: DEBUG
    // console.log(`x: ${INPUT_STATE.grab_tab_offset.x}, y: ${INPUT_STATE.grab_tab_offset.y}`);
}

function on_drag_end_tab(event)
{
    // T: DEBUG
    console.log(event);

    // T: Filter when the type of the element is dragged 
    if (INPUT_STATE.grabbed_type != DRAG_TYPE.TAB)
    {
        // T: DEBUG
        console.log(`Filtered drag type: ${INPUT_STATE.grabbed_type}`);

        return;
    }
    else
    {
        // T: Remove the stop-icon
        event.preventDefault();
    }

    const tab_header_div = document.getElementById(CONST.tab_header_id);
    const rect = tab_header_div.getBoundingClientRect();

    const x = event.clientX - rect.left - INPUT_STATE.grab_tab_offset.x;
    // const y = event.clientY - rect.top - INPUT_STATE.grab_tab_offset.y;

    const last_tab = tab_header_div.children[tab_header_div.children.length - 2];
    last_tab.classList.remove("right_highlight_side");

    let moved = false;

    for (let tab of tab_header_div.children)
    {
        // T: Clear precedent highlighted side from tabs
        tab.classList.remove("highlight_side");

        // T: Understand between what tabs are placed the dragged tab
        const rect_tab = tab.getBoundingClientRect();

        if (x >= rect_tab.left && x <= rect_tab.right)
        {
            tab_header_div.insertBefore(INPUT_STATE.grabbed_tab, tab);
            moved = true;
        }
    }

    if (! moved)
    {
        tab_header_div.insertBefore(INPUT_STATE.grabbed_tab, last_tab);
    }
}

function on_drag_over_tab(event)
{
    // T: DEBUG
    console.log(event);

    // T: Filter when the type of the element is dragged 
    if (INPUT_STATE.grabbed_type != DRAG_TYPE.TAB)
    {
        // T: DEBUG
        console.log(`Filtered drag type: ${INPUT_STATE.grabbed_type}`);

        return;
    }
    else
    {
        // T: Remove the stop-icon
        event.preventDefault();
    }

    const tab_header_div = document.getElementById(CONST.tab_header_id);
    const rect = tab_header_div.getBoundingClientRect();

    const x = event.clientX - rect.left - INPUT_STATE.grab_tab_offset.x;
    // const y = event.clientY - rect.top - INPUT_STATE.grab_tab_offset.y;

    const last_tab = tab_header_div.children[tab_header_div.children.length - 2];
    last_tab.classList.remove("right_highlight_side");

    let in_tab_controller = false;

    for (let tab of tab_header_div.children)
    {
        // T: Clear precedent highlighted side from tabs
        tab.classList.remove("highlight_side");

        // T: Understand between what tabs are placed the dragged tab
        const rect_tab = tab.getBoundingClientRect();

        if (x >= rect_tab.left && x < rect_tab.right)
        {
            if (tab.classList.contains(CONST.tab_controller))
            {
                in_tab_controller = true;

                tab.classList.add("highlight_side");
            }
        }
    }

    if (! in_tab_controller)
    {
        last_tab.classList.add("right_highlight_side");
    }

    // T: DEBUG
    console.log(`x: ${x}`);
}

// T: TODO Rename this function
function create_tab2(controller_id)
{
    const tab_header_div = document.getElementById(CONST.tab_header_id);
    const new_tab = tab_header_div.children[0].cloneNode(true);
    new_tab.classList.remove("selected");
    const new_button = tab_header_div.children[tab_header_div.children.length - 1];
    tab_header_div.insertBefore(new_tab, new_button);

    create_tab(new_tab, controller_id);
    create_editor_page(controller_id);
}

// T: TODO In this case we will add a new potential controller to the project.
function new_tab(event)
{
    // T: DEBUG
    console.log("new tab pressed.");

    const new_controller_id = PROJECT.new_controller();

    create_tab2(new_controller_id);
}

function on_section_header(event)
{
    // T: DEBUG
    console.log(event);

    const section = event.target.closest("." + CONST.section_class);
    const section_header = section.children[0];
    const section_content = section.querySelector("." + "editor-page-section-content");

    if (section_header.classList.contains("open"))
    {
        section_header.classList.remove("open");

        // T: Remove the "open" class for styling to the arrow
        section_header.children[0].classList.remove("open");

        // T: Hide the content of this section
        section_content.classList.remove("open");
    }
    else
    {
        section_header.classList.add("open");

        // T: Add the "open" class for styling to the arrow
        section_header.children[0].classList.add("open");

        // T: Show the content of this section
        section_content.classList.add("open");
    }
}

function on_cross_section_header(event)
{
    const section = event.target.closest("." + CONST.section_class);

    PROJECT.remove_group(UI.current_page.id, section.id);

    section.remove();
}

function on_drag_section(event)
{
    // T: DEBUG
    console.log(event);

    INPUT_STATE.grabbed_type = DRAG_TYPE.SECTION_CONTENT;

    const grabbed_section = event.target.closest("." + CONST.section_class);

    INPUT_STATE.grabbed_section = grabbed_section;
}

function on_drag_over_section(event)
{
    // T: DEBUG
    // console.log(event);

    if (INPUT_STATE.grabbed_type != DRAG_TYPE.SECTION_CONTENT)
    {
        // T: DEBUG
        console.log(`Filtered drag type: ${INPUT_STATE.grabbed_type}`);

        return;
    }
    else
    {
        // T: Remove the stop-icon
        event.preventDefault();
    }

    // T: DEBUG
    console.log("on_drag_over_section");

    const controller_content = UI.current_page.querySelector("." + CONST.controller_content_class);

    // T: Clear the border highligthing (START)
    for (const editor_section of controller_content.children)
    {
        editor_section.classList.remove("top_highligth");
    }
    // T: Clear the border highligthing (END)

    const section = event.currentTarget;

    // T: DEBUG
    console.log(section);

    section.classList.add("top_highligth");
}

function on_drag_drop_section(event)
{
    if (INPUT_STATE.grabbed_type != DRAG_TYPE.SECTION_CONTENT)
    {
        // T: DEBUG
        console.log(`Filtered drag type: ${INPUT_STATE.grabbed_type}`);

        return;
    }
    else
    {
        // T: Remove the stop-icon
        event.preventDefault();
    }

    const controller_content = UI.current_page.querySelector("." + CONST.controller_content_class);

    // T: Clear the border highligthing (START)
    for (let editor_section of controller_content.children)
    {
        editor_section.classList.remove("top_highligth");
    }
    // T: Clear the border highligthing (END)

    const section_overed = event.currentTarget;

    if (section_overed != INPUT_STATE.grabbed_section)
    {
        // T: DEBUG
        console.log("Section dropped!");

        controller_content.insertBefore(INPUT_STATE.grabbed_section, section_overed);

        PROJECT.move_group(UI.current_page.id, INPUT_STATE.grabbed_section.id, section_overed.id);
    }
}

function on_drag_leave_section(event)
{
    // T: DEBUG
    console.log(event);

    if (INPUT_STATE.grabbed_type != DRAG_TYPE.SECTION_CONTENT)
    {
        // T: DEBUG
        console.log(`Filtered drag type: ${INPUT_STATE.grabbed_type}`);

        return;
    }
    else
    {
        // T: Remove the stop-icon
        event.preventDefault();
    }

    if (event.currentTarget.contains(event.relatedTarget))
    {
        return;
    }

    const controller_content = UI.current_page.querySelector("." + CONST.controller_content_class);

    // T: Clear the border highligthing (START)
    for (let editor_section of controller_content.children)
    {
        editor_section.classList.remove("top_highligth");
    }
    // T: Clear the border highligthing (END)
}

function on_drag_container_element(event)
{
    // T: DEBUG
    console.log(event);
    console.log("on_drag_container_element");

    INPUT_STATE.grabbed_type = DRAG_TYPE.CONTAINER_ELEMENT;

    const grabbed_container = event.target.closest("." + CONST.scrollable_container_element_class);

    INPUT_STATE.grabbed_container_element = grabbed_container;

    const section = event.target.closest("." + CONST.section_class);

    INPUT_STATE.grabbed_section = section;

    // T: Stop the propagation of the event
    event.stopPropagation();
}

function on_drag_over_container_element(event)
{
    // T: DEBUG
    // console.log(event);

    if (INPUT_STATE.grabbed_type != DRAG_TYPE.CONTAINER_ELEMENT)
    {
        // T: DEBUG
        console.log(`Filtered drag type: ${INPUT_STATE.grabbed_type}`);

        return;
    }
    else
    {
        // T: Remove the stop-icon
        event.preventDefault();
    }

    if (INPUT_STATE.last_overed_container_element != null)
    {
        INPUT_STATE.last_overed_container_element.classList.remove("top_highligth");
    }

    const container_element_overed = event.target.closest("." + CONST.scrollable_container_element_class);
    container_element_overed.classList.add("top_highligth");

    INPUT_STATE.last_overed_container_element = container_element_overed;

    // T: DEBUG
    console.log("on_drag_over_container_element");

    // T: Stop the propagation of the event
    event.stopPropagation();
}

function on_drag_drop_container_element(event)
{
    // T: DEBUG
    console.log(event);

    if (INPUT_STATE.grabbed_type != DRAG_TYPE.CONTAINER_ELEMENT)
    {
        // T: DEBUG
        console.log(`Filtered drag type: ${INPUT_STATE.grabbed_type}`);

        return;
    }
    else
    {
        // T: Remove the stop-icon
        event.preventDefault();
    }

    INPUT_STATE.last_overed_container_element.classList.remove("top_highligth");
    INPUT_STATE.last_overed_container_element = null;

    const container_element_dropped = event.currentTarget.closest("." + CONST.scrollable_container_element_class);
    const section = event.currentTarget.closest("." + CONST.section_class);
    // T: TODO Better way to find the section_content?
    const section_content = section.children[1];

    section_content.insertBefore(INPUT_STATE.grabbed_container_element, container_element_dropped);

    // T: DEBUG
    console.log(INPUT_STATE.grabbed_container_element);
    console.log(container_element_dropped);
    console.log(section);

    const el_id_to_move = INPUT_STATE.grabbed_container_element.id;
    const el_id_where_to_move = container_element_dropped.id;
    const group_id_to = section.id;
    const group_id_from = INPUT_STATE.grabbed_section.id;

    if (INPUT_STATE.grabbed_section == section)
    {
        PROJECT.move_el_same_section(UI.current_page.id, el_id_to_move, el_id_where_to_move, group_id_from);
    }
    else // T: INPUT_STATE.grabbed_section != section
    {
        PROJECT.move_el(UI.current_page.id, el_id_to_move, el_id_where_to_move, group_id_from, group_id_to);
    }

    // T: Stop the propagation of the event
    event.stopPropagation();
}

function on_drag_leave_container_element(event)
{
    // T: DEBUG
    console.log("on_drag_leave_container_element");

    if (INPUT_STATE.grabbed_type != DRAG_TYPE.CONTAINER_ELEMENT)
    {
        // T: DEBUG
        console.log(`Filtered drag type: ${INPUT_STATE.grabbed_type}`);

        return;
    }

    if (event.currentTarget.contains(event.relatedTarget))
    {
        return;
    }

    if (INPUT_STATE.last_overed_container_element != null)
    {
        INPUT_STATE.last_overed_container_element.classList.remove("top_highligth");
        INPUT_STATE.last_overed_container_element = null;
    }

    // T: Stop the propagation of the event
    event.stopPropagation();
}





function create_tab(tab_el, page_id)
{
    tab_el.dataset.page_id = page_id;

    tab_el.addEventListener("pointerdown", on_click_tab);
    tab_el.children[1].addEventListener("click", on_close_tab);

    tab_el.addEventListener("dragstart", on_drag_tab);
    tab_el.addEventListener("dragend", on_drag_end_tab);
}

function setup_base_buttons(buttons)
{
    const new_button_butt = buttons[0];
    const new_slider_butt = buttons[1];
    const new_radio_buttons_butt = buttons[2];
    const new_checkbox_butt = buttons[3];
    const new_analog_stick_butt = buttons[4];
    const new_dpad_butt = buttons[5];

    new_button_butt.addEventListener("click", new_button);
    new_slider_butt.addEventListener("click", new_slider);
    new_radio_buttons_butt.addEventListener("click", new_radio_buttons);
    new_checkbox_butt.addEventListener("click", new_checkbox);
    new_analog_stick_butt.addEventListener("click", new_analog_stick);
    new_dpad_butt.addEventListener("click", new_dpad);
}

function setup_base_buttons_section(buttons)
{
    const new_button_butt = buttons[0];
    const new_slider_butt = buttons[1];
    const new_radio_buttons_butt = buttons[2];
    const new_checkbox_butt = buttons[3];

    new_button_butt.addEventListener("click", new_button_section);
    new_slider_butt.addEventListener("click", new_slider_section);
    new_radio_buttons_butt.addEventListener("click", new_radio_buttons_section);
    new_checkbox_butt.addEventListener("click", new_checkbox_section);
}

function setup_editor_page(editor_page)
{
    const sections = editor_page.querySelectorAll(".editor-page-section");

    // T: DEBUG
    console.log(sections);

    for (const section of sections)
    {
        const editor_section_header = section.children[0];
        editor_section_header.addEventListener("click", on_section_header);
    }

    const editor_page_buttons = editor_page.querySelector(".editor-page-buttons");

    if (editor_page_buttons != null)
    {
        setup_base_buttons(editor_page_buttons.children);
    }

    const phone_frame = editor_page.querySelector("." + CONST.editor_simulator_phone_frame_class);
    if (phone_frame != null)
    {
        phone_frame.id = CONST.editor_simulator_phone_frame_id + editor_page.id;
    }
}

function create_editor_page(page_id)
{
    const editor_pages_div = document.getElementById(CONST.pages_div_id);
    const editor_page_hidden = document.getElementById(CONST.hidden_editor_page_id);

    const new_editor_page = editor_page_hidden.cloneNode(true);
    new_editor_page.id = page_id;

    editor_pages_div.appendChild(new_editor_page);

    setup_editor_page(new_editor_page);
}

// T: TODO Add a boolean that control if a close button will be added to the section or not.
function create_section(setup_buttons, new_section_id)
{
    const editor_page_section = document.getElementById(CONST.section_hidden_id);
    const section_to_copy = editor_page_section;
    const new_section = section_to_copy.cloneNode(false);

    new_section.id = new_section_id;

    const new_section_header = section_to_copy.children[0].cloneNode(true);
    new_section.appendChild(new_section_header);
    new_section_header.addEventListener("click", on_section_header);

    const close_button = new_section_header.querySelector("." + CONST.section_header_cross_class);
    close_button.addEventListener("click", on_cross_section_header);

    let new_section_content = section_to_copy.children[1].cloneNode(false);
    console.log(new_section_content);

    if (setup_buttons)
    {
        const buttons = document.getElementById(CONST.scrollable_container_element_buttons_id).cloneNode(true);

        new_section_content.appendChild(buttons);

        setup_base_buttons_section(buttons.children);
    }

    new_section.appendChild(new_section_content);

    new_section.addEventListener("dragstart", on_drag_section);
    new_section.addEventListener("drop", on_drag_drop_section);
    new_section.addEventListener("dragleave", on_drag_leave_section);
    new_section.addEventListener("dragover", on_drag_over_section);

    return new_section;
}

function new_section(setup_buttons)
{
    const new_section_id = PROJECT.new_group(UI.current_page.id);
    const new_section = create_section(setup_buttons, new_section_id);
    return new_section;
}

// T: TODO This is a temporary function that will be deleted in the future...
function next_section()
{
    UI.next_section += 1;
    return "section_" + UI.next_section;
}

function create_element(controller_id, group_id, el_id, type_element, section)
{
    const html_element = document.getElementById("generic_element_hidden").cloneNode(true);

    html_element.id = el_id;

    const controller = PROJECT.CURRENT_PROJ.controllers[controller_id];
    const group = controller.groups[group_id];
    const element = group.elems[el_id];

    for (const [field_name, field] of Object.entries(element.fields))
    {
        // T: DEBUG
        console.log(`${field_name}=`);
        console.log(field);

        const html_field = document.getElementById(field.type).cloneNode(true);

        // T: Add in the generated html of the field the information that will 
        // be necessary to update the information in the JSON.
        html_field.dataset.type         = field.type;
        html_field.dataset.field_name   = field_name;

        if (field.type == PROJECT.TYPES_FIELD.SIMPLE_TEXT)
        {
            // T: Here we assume that:
            // - children[0] = span with the field_name in it.
            // - children[1] = text with value properties that bring the value to retrieve.
            const span = html_field.children[0];
            const text_field = html_field.children[1];

            if (Object.hasOwn(field, "text_displayed"))
            {
                span.textContent = field.text_displayed;
            }
            else
            {
                span.textContent = field_name;
            }

            text_field.value = field.value;

            text_field.addEventListener("change", (event) => {
                PROJECT.update(controller_id, group_id, el_id);
            });
        }
        else if (field.type == PROJECT.TYPES_FIELD.SIMPLE_CHECKBOX)
        {
            // T: Here we assume that:
            // - children[0] = input with name equal to field_name and contain the value in checked
            // - children[1] = label with textContent equal to field_name
            const input = html_field.children[0];
            const label = html_field.children[1];

            input.name = field_name;
            input.checked = field.value;
            label.for = field_name;

            if (Object.hasOwn(field, "text_displayed"))
            {
                label.textContent = field.text_displayed;
            }
            else
            {
                label.textContent = field_name;
            }

            input.addEventListener("change", (event) => {
                PROJECT.update(controller_id, group_id, el_id);
            });
        }
        // T: TODO Add the possibility to specify for the slider all the other properties: min, max, etc.
        else if (field.type == PROJECT.TYPES_FIELD.SIMPLE_SLIDER)
        {
            // T: Here we assume that:
            // - children[0] = label with name equal to the field_name.
            // - children[1] = input that represent the slider.
            // - children[2] = the div that contains the slider that represent min and max values.
            // - children[3] = the span that represent the current value of the slider.
            const label_name = html_field.children[0];
            const input = html_field.children[1];
            const labels = html_field.children[2];
            const span_value = html_field.children[3];

            input.value = field.value;
            input.min = field.min;
            input.max = field.max;
            if (Object.hasOwn(field, "text_displayed"))
            {
                label_name.textContent = field.text_displayed;
            }
            else
            {
                label_name.textContent = field_name;
            }
            labels.children[0].textContent = field.min;
            labels.children[1].textContent = field.max;
            span_value.textContent = field.value;

            // T: Prevent dragging of section and element (START)
            // T: These listeners are used to block the dragging of element and section
            // where the slider is contained and when the slider is dragged around.
            input.addEventListener("dragstart", (event) => {
                event.preventDefault();
                event.stopPropagation();
            });

            input.addEventListener("pointerdown", (event) => {
                event.stopPropagation();
                html_element.draggable = false;
                section.draggable = false;
            });

            // T: OPT Try to solve the problem that we are adding a new listener
            // each time we are creating a slider.
            window.addEventListener("pointerup", (event) => {
                html_element.draggable = true;
                section.draggable = true;
            });
            // T: Prevent dragging of section and element (END)

            // T: TODO Make more dynamic changing of the value on the left side of the slider.
            // Currently, only when you finish to drag the slider, the value is updated. This is
            // very good for updating the project, but it's not really good visually.
            input.addEventListener("change", (event) => {
                span_value.textContent = input.value;

                PROJECT.update(controller_id, group_id, el_id);
            });
        }
        // T: TODO I need to re-made that... now it's too simple...
        // T: TODO It's necessary to add a cross to delete an option...
        else if (field.type == PROJECT.TYPES_FIELD.SIMPLE_EXPANDABLE_LIST)
        {
            const simple_textbox = document.getElementById(PROJECT.TYPES_FIELD.SIMPLE_TEXT);

            for (const value of field.value)
            {
                const option = simple_textbox.cloneNode(true);
                option.children[0].textContent = "option: ";
                option.children[1].value = value;

                html_field.appendChild(option);
            }

            const more_option = html_field.children[0];
            more_option.addEventListener("click", new_option_button);
            more_option.addEventListener("click", (event) => {
                PROJECT.update(controller_id, group_id, el_id);
            });
        }
        else
        {
            // T: DEBUG
            console.log(`Not handled type of field: ${field.type}`);
        }

        // T: Add to the container that we are building...
        html_element.appendChild(html_field);
    }

    // T: TODO Add all the other categories that can be moved between sections
    if (type_element == PROJECT.TYPES.BUTTON 
        || type_element == PROJECT.TYPES.SLIDER
        || type_element == PROJECT.TYPES.CHECKBOX
        || type_element == PROJECT.TYPES.RADIO_BUTTON
    )
    {
        html_element.addEventListener("dragstart", on_drag_container_element);
        html_element.addEventListener("dragover", on_drag_over_container_element);
        html_element.addEventListener("drop", on_drag_drop_container_element);
        html_element.addEventListener("dragleave", on_drag_leave_container_element);        
    }

    return html_element;
}

// T: This is the function that is used to generate from the UI
// T: TODO Probably this function have a lot of duplicate code, and we can solve this...
function generate_ui_from_project()
{
    const project = PROJECT.CURRENT_PROJ;

    for(const [controller_id, controller] of Object.entries(project.controllers))
    {
        // T: DEBUG
        console.log(controller_id);
        console.log(controller);

        create_tab2(controller_id);

        const controller_html = document.getElementById(controller_id);

        // T: DEBUG
        console.log(controller_html);

        const controller_content = controller_html.querySelector("." + CONST.controller_content_class);

        for(const group_id of controller.groups_order)
        {
            // T: DEBUG
            console.log(group_id);

            const group = controller.groups[group_id];

            // T: DEBUG
            console.log(group);

            const section = create_section(true, group_id);
            section.children[0].children[1].textContent = group_id;

            const section_content = section.children[1];

            for(const el_id of group.elems_order)
            {
                const el = group.elems[el_id];

                // T: DEBUG
                console.log(el);

                const element = create_element(controller_id, group_id, el_id, el.type, section);
                section_content.appendChild(element);
            }

            controller_content.appendChild(section);
        }
    }
}

function new_element_new_section(type_el)
{
    const section = new_section(true);
    // T: DEBUG
    console.log(section);
    section.children[0].children[1].textContent = next_section();
    const section_content = section.children[1];

    let new_el_id = null;
    if (type_el == PROJECT.TYPES.BUTTON)
    {
        new_el_id = PROJECT.new_button(UI.current_page.id, section.id);
    }
    else if (type_el == PROJECT.TYPES.SLIDER)
    {
        new_el_id = PROJECT.new_slider(UI.current_page.id, section.id);        
    }
    else if (type_el == PROJECT.TYPES.CHECKBOX)
    {
        new_el_id = PROJECT.new_checkbox(UI.current_page.id, section.id);        
    }
    else if (type_el == PROJECT.TYPES.RADIO_BUTTON)
    {
        new_el_id = PROJECT.new_radio_buttons(UI.current_page.id, section.id);
    }
    else if (type_el == PROJECT.TYPES.ANALOG_STICK)
    {
        new_el_id = PROJECT.new_analog_stick(UI.current_page.id, section.id);
    }
    else if (type_el == PROJECT.TYPES.DPAD)
    {
        new_el_id = PROJECT.new_dpad(UI.current_page.id, section.id);
    }
    // T: TODO Missing radio buttons
    else
    {
        // T: DEBUG
        console.log("Not handled type_el", type_el);
    }

    const new_html_el = create_element(UI.current_page.id, section.id, new_el_id, type_el, section);

    section_content.appendChild(new_html_el);

    const controller_content = UI.current_page.querySelector("." + CONST.controller_content_class);
    controller_content.appendChild(section);
}

// T: This is used to add more option to radio buttons
// T: It's necessary to generate a new name for the option...
function new_option_button(event)
{
    // T: DEBUG
    console.log(event);

    const buttons_group = event.target.parentElement;

    const new_option = buttons_group.children[1].cloneNode(true);
    buttons_group.appendChild(new_option);
}

function new_element(type_el, event)
{
    const section = event.currentTarget.closest("." + CONST.section_class);
    const current_section_content = section.querySelector("." + CONST.section_content_class);

    let new_el_id = null;
    if (type_el == PROJECT.TYPES.BUTTON)
    {
        new_el_id = PROJECT.new_button(UI.current_page.id, section.id);
    }
    else if (type_el == PROJECT.TYPES.SLIDER)
    {
        new_el_id = PROJECT.new_slider(UI.current_page.id, section.id);        
    }
    else if (type_el == PROJECT.TYPES.CHECKBOX)
    {
        new_el_id = PROJECT.new_checkbox(UI.current_page.id, section.id);        
    }
    else if (type_el == PROJECT.TYPES.RADIO_BUTTON)
    {
        new_el_id = PROJECT.new_radio_buttons(UI.current_page.id, section.id);
    }
    else if (type_el == PROJECT.TYPES.ANALOG_STICK)
    {
        new_el_id = PROJECT.new_analog_stick(UI.current_page.id, section.id);
    }
    else if (type_el == PROJECT.TYPES.DPAD)
    {
        new_el_id = PROJECT.new_dpad(UI.current_page.id, section.id);
    }
    // T: TODO Missing radio buttons
    else
    {
        // T: DEBUG
        console.log("Not handled type_el", type_el);
    }

    const new_html_el = create_element(UI.current_page.id, section.id, new_el_id, type_el, section);

    current_section_content.appendChild(new_html_el);
}

function new_button(event)
{
    new_element_new_section(PROJECT.TYPES.BUTTON);
}

function new_slider(event)
{
    new_element_new_section(PROJECT.TYPES.SLIDER);
}

function new_checkbox(event)
{
    new_element_new_section(PROJECT.TYPES.CHECKBOX);
}

function new_analog_stick(event)
{
    new_element_new_section(PROJECT.TYPES.ANALOG_STICK);
}

function new_dpad(event)
{
    new_element_new_section(PROJECT.TYPES.DPAD);
}

function new_radio_buttons(event)
{
    new_element_new_section(PROJECT.TYPES.RADIO_BUTTON);
}

function new_button_section(event)
{
    new_element(PROJECT.TYPES.BUTTON, event);
}

function new_slider_section(event)
{
    new_element(PROJECT.TYPES.SLIDER, event);
}

function new_checkbox_section(event)
{
    new_element(PROJECT.TYPES.CHECKBOX, event);
}

function new_radio_buttons_section(event)
{
    new_element(PROJECT.TYPES.RADIO_BUTTON, event);
}

// T: OPT This function is very very slow, we can easily make something better...
function render_simulator_phone()
{
    const iframe_content = PROJECT.export(false);

    // T: TODO The fixed id of the controller is only temporary...
    const iframe = document.getElementById(CONST.editor_simulator_phone_frame_id + "controller_0");

    // T: DEBUG
    // console.log(CONST.editor_simulator_phone_frame_id + UI.current_page.id);
    console.log(iframe);

    const html_text = iframe_content[0];
    const css_text  = iframe_content[1];

    const full_document = html_text.replace(
        "</head>",
        `<style>\n${css_text}\n</style>\n</head>`
    );

    // 3. Directly update the iframe content
    iframe.srcdoc = full_document;
}

function save_project(event)
{
    // T: DEBUG
    console.log("save_project");

    const json = PROJECT.export_json();

    // T: DEBUG
    console.log(json);

    const blob = new Blob([json], { type: "application/json" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "project.json";

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

async function import_project(event)
{
    // T: DEBUG
    console.log("import_project");

    const file = event.target.files[0];

    try
    {
        const json_text = await file.text();

        // T: TODO Reset the editor (START)
        const tab_header_div = document.getElementById(CONST.tab_header_id);
        for(const tab of tab_header_div.children)
        {
            if (tab.id != CONST.new_tab_id && tab.dataset.page_id != "page_0")
            {
                tab.remove();
            }
        }

        const pages_div = document.getElementById(CONST.pages_div_id);
        for (const page of pages_div.children)
        {
            // T: Don't remove the begin section
            if(page.id != "page_0" && page.id != "page_hidden")
            {
                page.remove();
            }
        }
        // T: TODO Reset the editor (END)

        PROJECT.import_project(json_text);

        generate_ui_from_project();
    }
    catch(error)
    {
        // T: Error
        console.error("Error reading or parsing JSON file:", error);
    }
    finally
    {

    }
}

function export_html(event)
{
    // T: DEBUG
    console.log("export_html");

    const exported_project = PROJECT.export(false);
    const html_text     = exported_project[0];
    const css_text      = exported_project[1];



    const blob = new Blob([html_text], { type: "text/html;charset=utf-8" });

    const url = URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = url;
    a.download = "test_perfect_placement.html";

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);



    const blob2 = new Blob([css_text], { type: "text/css;charset=utf-8" });

    const url2 = URL.createObjectURL(blob2);

    a = document.createElement("a");
    a.href = url2;
    a.download = "test_perfect_placement.css";

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function setup_ui()
{
    const tab_header_div = document.getElementById(CONST.tab_header_id);

    UI.selected_tab = tab_header_div.children[0];
    UI.current_page = document.getElementById(UI.selected_tab.dataset.page_id);

    tab_header_div.addEventListener("dragover", on_drag_over_tab);

    for (let tab_el of tab_header_div.children)
    {
        // T: DEBUG
        console.log(tab_el);

        if (tab_el.id == "new-tab")
        {
            tab_el.addEventListener("pointerdown", new_tab);
        }
        else
        {
            create_tab(tab_el, tab_el.dataset.page_id);
        }
    }

    const editor_pages_div = document.getElementById(CONST.pages_div_id);

    for (let editor_page of editor_pages_div.children)
    {
        // T: DEBUG
        console.log(editor_page);

        if (editor_page.id != 0)
        {
            setup_editor_page(editor_page);
        }
    }



    const save_project_button   = document.getElementById(CONST.save_project_button_id);
    save_project_button.addEventListener("click", save_project);

    const import_project_button = document.getElementById(CONST.import_project_button_id);
    const import_project_input = document.getElementById(CONST.import_project_input_id);
    import_project_button.addEventListener("click", () => {
        import_project_input.click();
    });
    import_project_input.addEventListener("change", import_project);

    const export_html_button    = document.getElementById(CONST.export_html_button_id);
    export_html_button.addEventListener("click", export_html);
    const update_simulator_button = document.getElementById(CONST.update_simulator_button_id);
    update_simulator_button.addEventListener("click", render_simulator_phone);
}





function on_dom_content_loaded()
{
    setup_ui();

    // T: DEBUG
    console.log("On dom content loaded");
}

document.addEventListener("DOMContentLoaded", on_dom_content_loaded);