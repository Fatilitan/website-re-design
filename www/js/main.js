var d = document;

console.log(d);

$(d).ready(function(){
    breakpoints();
    $.getJSON('js/calendar.json').done(function(data){
        calendarCards(data);
    });
    initForm();
});

//======================================================//
//======================BREAKPOINTS=====================//
//======================================================//

let width, height;

width = window.innerWidth;
height = window.innerHeight;

function breakpoints() {
    window.addEventListener("resize", () => {
        width = window.innerWidth;
        height = window.innerHeight;
    
        // console.log(`The viewport's width is ${width} and the height is ${height}.`);
    });    
}

//======================================================//
//======================CALENDARCARDS===================//
//======================================================//

/**
 * calendarCards functie om de data vanuit JSON om te zetten in cards voor de pagina : calendar.html
 * @param {Object} data is de data uit de JSON file genaamd : calendar.json
*/

function calendarCards(data) {

    var cards = data.cards;

    for (card of cards) {

        var location, title, time, description, color, table;

        location    = card.location;
        title       = card.title;
        time        = card.time;
        description = card.description;
        color       = card.color;

        table = `<div class="tableCard ${color}">
                    <h4>${title}</h4>
                    <span class='start'>${time}</span>
                </div>
                <div class='toggle'><p class="${color}">${description}</p></div>`

        $(`.table .${location}`).append(table);
    } // einde for loop

    var tab = $('.tableCard');

    if (width >= 980) {
        $('.tableCard + div').show().css({
            'transform': 'translateY(-1.5rem)'
        });
    } else {
        $('.tableCard + div').hide();

        tab.on('click', function(e){
            $(this).next().slideToggle(400);
        });
    }
}

//======================================================//
//======================INITFORMS=======================//
//======================================================//

/**
 * initForm() : functie om het valideren van een html form te initialiseren
*/

function initForm() {
    verstuurBtn = $('#verstuur_btn');
    
    if (!verstuurBtn) return false;

    verstuurBtn.click(function(e){

        e.preventDefault();

        if ( valideerForm(this.form) ) {
            this.form.submit();
        }
        formPopUp(this.form);
    });
}

/**
 * @param {HTMLElement} form - de formulier van de bijhorende submit button (wordt gepakt uit initForm();)
*/

function valideerForm(form) {
    const formElementen = form.elements;

    for (element of formElementen) {

        const value = element.value;

        if (element.type == 'text') {
            if (value.length <= 0) {
                formFeedback(element, false);
            }
            else {
                formFeedback(element, true);
            }
        }

        if (element.name == 'email') {
            var apenstaart = value.indexOf('@');
            var laatstePunt = value.lastIndexOf('.');
            var lengte = value.length;

            var emailGoed = (apenstaart >= 2 && laatstePunt > apenstaart + 2 && lengte > laatstePunt + 2);

            if (!emailGoed) {
                formFeedback(element, false);
            } else {
                formFeedback(element, true);
            }
        }

        if (element.name == 'zipcode') {
            const postcodeReg = /^[1-9][0-9]{3} ?[a-z]{2}$/i;
            const postcodeGoed = postcodeReg.test(value);

            if (!postcodeGoed) {
                formFeedback(element, false);
            } else {
                formFeedback(element, true);
            }
        }

        if (element.name == 'phonenumber') {
            const phoneReg = /^\(?([+]31|0031|0)-?6(\s?|-)([0-9]\s{0,3}){8}$/;
            const phoneGoed = phoneReg.test(value);

            if (!phoneGoed) {
                formFeedback(element, false);
            } else {
                formFeedback(element, true);
            }
        }

        if (element.name == 'birthday') {
            const dateReg = /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/;
            const dateGoed = dateReg.test(value);
            console.log(value);

            if (!dateGoed) {
                formFeedback(element, false);
            } else {
                formFeedback(element, true);
            }
        }

        if (element.name == 'gender' || element.name == 'membership') {
            formFeedback(element, true);
        }
    }
}

/**
 * @param {HTMLElement} element - het formelement van uit de for loop in valideerForm();
 * @param {Boolean} status - geeft aan of de waarde van de inputveld correct is of niet
*/

function formFeedback(element, status) {
    if (status == true) {
        element.style.border = '2px solid'
        element.style.borderColor = '#81d742';
        element.setAttribute('id', 'true');
    } else {
        element.style.border = '2px solid'
        element.style.borderColor = '#dd3333';
        element.setAttribute('id', 'false');
    }
}

/**
 * @param {HTMLElement} form - de formulier van de bijhorende submit button (wordt gepakt uit initForm();)
*/

function formPopUp(form) {

    const formElementen = form.elements;
    const aantalElementen = formElementen.length - 1;
    var teller = 0;

    for (elementen of formElementen) {
        if (elementen.id == 'true') {
            teller++;
        } else if (elementen.id == 'false') {
            teller--;
        }
    }

    console.log(teller, aantalElementen);

    if (aantalElementen == teller) {
        console.log('Nu komt een pop up');
        showHidePopUp();
    }
}

/**
 * showHidePopUp() : functie om het de popUp te animeren als het hele formulier correct is
*/

function showHidePopUp() {

    const popUpSherm = $('.popUpScherm');
    const popUp = $('.popUp');

    popUpSherm.css({
        'display': 'block'
    });
    popUp.css({
        'display': 'block',
        'top':'150%',
    });
    popUp.animate({
        'top':'50%',
    }, 500);

    $('.popUp .btn').click(function(){
        popUp.animate({
            'top':'150%',
        }, 500, function(){
            popUpSherm.css({
                'display': 'none'
            });
        });
    });
}