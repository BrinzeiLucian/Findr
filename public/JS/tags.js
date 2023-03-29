let clearTagsBTN = document.querySelector(".clear-tags");
let ul = document.querySelector(".ul"),
input = ul.querySelector(".tags");
countLeftTags = document.querySelector(".spanCount");

let maxTags = 5;
let tags = [];
countTag();

function countTag(){
    //input.focus();
    countLeftTags.innerText = maxTags - tags.length;
};

function createTag(){
    ul.querySelectorAll("li").forEach(li => li.remove());
    tags.slice().reverse().forEach(tag => {
        let tabLabel = `<li>${tag} <i class="uit uit-multiply" onclick="remove(this, '${tag}')"></i></li>`;
        ul.insertAdjacentHTML("afterbegin", tabLabel);
    })
    countTag();
};

function remove(element, tag){
    let index = tags.indexOf(tag);
    tags = [...tags.slice(0, index), ...tags.slice(index + 1)];
    element.parentElement.remove();
    countTag();
};

function addTag(e){
    if(e.key == "Enter"){
        let tag = e.target.value.replace(/\s+/g, ' ');
        if(tag.length > 1 && !tags.includes(tag)){
            if(tags.length < maxTags){
            tag.split(',').forEach(tag => {
                tags.push(tag);
                createTag();
                console.log(tags);
            })
        }
    }
    e.target.value = "";    
    }
};

input.addEventListener("keyup", addTag);

clearTagsBTN.addEventListener("click", () => {
    tags.length = 0;
    ul.querySelectorAll("li").forEach(li => li.remove());
    countTag();
});