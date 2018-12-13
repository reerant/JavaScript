// Teatterit data haetaan Finnkinon rajapinnasta XML datana.
// Teatterit ladataan pudotusvalikkoon näkyviin heti sivun latauduttua.
// Haku tehdään Jqueryllä. 
function lataaTeatterit() {
    $.get("https://www.finnkino.fi/xml/TheatreAreas/", function (data, status) {
        if (status == "success") {
            // tallennetaan data muuttujaan. 
            var xmlDoc = data;
            // Parsitaan data, kaikki tarvittava data löytyy TheatreArea tagin alta. 
            var teatterit = xmlDoc.getElementsByTagName("TheatreArea");
            for (var i = 0; i < teatterit.length; i++) {
                // Muuttujiin otetaan talteen teatterin nimi sekä Finnkinon määrittelemä teatterikohtainen ID. 
                // ID kuvaa tarkemmin valittua teatteria ja sitä käytetään hyödyksi option value-arvossa lataaOhjelmisto-funktiossa. 
                var teatterinNimi = teatterit[i].getElementsByTagName('Name')[0].innerHTML;
                var teatterinId = teatterit[i].getElementsByTagName('ID')[0].innerHTML;
                var teatteri = "<option value=\"" + teatterinId + "\">" + teatterinNimi + "</option>";
                //Teatterit näytetään sivulla select-valikossa erillisinä optioneina. 
                document.getElementById("list").innerHTML += teatteri;
            }
        }
    });
}



// Funktio lataa halutun pvm sekä alueen/teatterin mukaisesti elokuvat. 
function lataaOhjelmisto() {
    // Haetaan select-valikosta valitun teatterin ID
    var teatterinID = document.getElementById("list").value;
    // Haetaan valittu päivämäärä.
    var pvm = document.getElementById("pvm").value;
    // Muutetaan pvm pp.kk.vvvv muotoon, jotta se vastaa rajapinnan vaatimaa muotoa.
    var date = new Date(pvm);
    pvm = date.getDate().toString().padStart(2, "0") + "." + (date.getMonth() + 1).toString().padStart(2, "0") + "." + date.getFullYear()

    // Elokuvaohjelmiston datahakuun välitetään teatterinID sekä pvm. 
    $.get("https://www.finnkino.fi/xml/Schedule/?area=" + teatterinID + "&dt=" + pvm, function (data, status) {
        if (status == "success") {
            // tallennetaan data muuttujaan.
            var xmlDoc = data;
            // Parsitaan data, kaikki tarvittava data löytyy show tagin alta. 
            var elokuvat = xmlDoc.getElementsByTagName("Show");
            // Elokuvat näytetään gridin muodossa. 
            var elokuvienDivit = "<div class='row' style='margin-top:20px'>";

            for (var i = 0; i < elokuvat.length; i++) {
                // Jokaisesta elokuvasta näytetään perustietoina: nimi, teatteri+sali, aloitus+lopetus kloajat
                // sekä kuva. Jokaisella rivillä näytetään kaksi elokuvacolumnia ja 
                // jokainen elokuvacolumni on vielä jaettu erikseen kahteen columniin, jotta elokuvan
                // infoteksti sekä kuva on saatu näkymään siististi. 
                var elokuvanNimi = elokuvat[i].getElementsByTagName("Title")[0].innerHTML;
                var teatteriJaSali = elokuvat[i].getElementsByTagName("TheatreAndAuditorium")[0].innerHTML;
                var kuvanOsoite = elokuvat[i].getElementsByTagName("EventSmallImagePortrait")[0].innerHTML;
                var aloitus = elokuvat[i].getElementsByTagName("dttmShowStart")[0].innerHTML;
                // Kloaikoja muokattu sopivampaan muotoon substringin avulla
                var kloAlku = aloitus.substring(11, 16);
                var lopetus = elokuvat[i].getElementsByTagName("dttmShowEnd")[0].innerHTML;
                var kloLoppu = lopetus.substring(11, 16);
                var elokuvaDiv = "<div class='col-md-6 leffa'>" +
                    "<div class='row'>" +
                    "<div class='col-md-9'>" +
                    "<p>Elokuvan nimi: " + elokuvanNimi + "</p>" +
                    "<p>Teatteri ja sali: " + teatteriJaSali + "</p>" +
                    "<p>Elokuva alkaa klo: " + kloAlku + "</p>" +
                    "<p>Elokuva loppuu klo: " + kloLoppu + "</p>" +
                    "</div>" +
                    "<div class='col-md-3'>" +
                    "<img src=" + kuvanOsoite + "></div>" +
                    "</div>" +
                    "</div>"
                elokuvienDivit += elokuvaDiv;
            }
            elokuvienDivit + "</div>";
            // elokuvat listataan riveittäin html koodin diviin.
            document.getElementById("ohjelmisto").innerHTML = elokuvienDivit;
        }
    });
}

// Funktion tarkoitus on suodattaa/etsiä elokuvia sitä mukaan, kun käyttäjä syöttää hakukenttään tekstiä. 
// Hakua tehdään aina jokaisen näppäilyn jälkeen automaattisesti. Jos syötetyn tekstin pyyhkii pois, näkyvät
// kaikki ko. teatterin elokuvat taas normaalisti. 
function suodataLeffat() {
    // Syötetty merkkijonoarvo haetaan suoraan input formin kentästä id:n mukaisesti. 
    var value = $("#hakuString").val()
    // haetaan kaikki elementit joissa leffa-class.
    $('.leffa').each(function () {
        // käydään jokainen elementti läpi ja otetaan jokaisesta html sisältö. Muutetaan se pieniksi kirjaimiksi, 
        // samoin kuin hakukentän merkkijonoarvo, jotta isoja ja pieniä kirjaimia ei tarvitse huomioida.
        // Tarkistetaan, että sisältääkö elementti merkkijonoa, joka vastaa hakukentästä saatua merkkijonoarvoa, mikäli löytyy includes
        // palauttaa true, muutoin false. 
        var sanaLoytyy = $(this).html().toLowerCase().includes(value.toLowerCase());
        // toggle toteuttaa elementtien (elokuvien) näkyvyyden sanaLoytyy arvon mukaisesti, eli
        // true = elementti näytetään, false = ei näytetä. 
        $(this).toggle(sanaLoytyy);
    });
}



