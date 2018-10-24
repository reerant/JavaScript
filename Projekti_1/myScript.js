// Funktio lisää syötetyn tekstin, valitun kiiireellisyysluokan sekä poista-ruksin listariville.
function addText() {
    var li = document.createElement("li");
    var img = document.createElement("img");
    img.id = "symbol";

    // määritellään alasvetovalikon kiireellisyysluokat, joiden mukaan eri symbolikuva lisätään listan riville. 
    var priority = document.getElementById("priority").value;
    if (priority == "high") {
        img.setAttribute("src", "pics/red.png")
    }
    if (priority == "medium") {
        img.setAttribute("src", "pics/orange.png")
    }
    if (priority == "low") {
        img.setAttribute("src", "pics/green.png")
    }

    li.appendChild(img);

    // lisätään varsinainen tekstiosuus. 
    var value = document.getElementById("text").value;
    var text = document.createTextNode(value);
    li.appendChild(text);

    // tarkistetaan ettei tekstikenttä ole tyhjä ja jos on, alert-ikkuna ponnahtaa esiin sekä tekstikentän reunukset muuttuvat punaisiksi. 
    if (value === "") {
        alert("Tekstikenttä on tyhjä!")
        document.getElementById("text").style.borderColor = "red";
    } else {
        document.getElementById("list").appendChild(li);
        document.getElementById("text").style.borderColor = "white";
    }

    // asetetaan alasvetovalikko ja tekstikenttä oletustilaan. 
    document.getElementById("text").value = "";
    document.getElementById("priority").value = "empty";

    // lisätään close-merkki "X" jokaisen rivin päätteeksi. 
    var span = document.createElement("span");
    var symbolX = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(symbolX);
    li.appendChild(span);

    // x-merkkiä klikkaamalla, tekstirivin saa poistettua listalta.
    span.addEventListener("click", function () {
        var x = confirm("Haluatko varmasti poistaa tehtävän?");
        if (x == true) {
            this.parentElement.style.display = "none";
        }
    });

}

// Funktio piilottaa todo-listan, kun boksia klikataan. Kun boksia klikataan uudelleen, lista palautuu näkyviin.
function hide() {
    var list = document.getElementById('list');
    if (list.style.display === "none") {
        list.style.display = "block";
    } else {
        list.style.display = "none";
    }

}


