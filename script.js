//let obj_arr;
let div_el = document.getElementById('results');

	
function ajax_req() {
	return new Promise(function(resolve, reject) {		
		let xhr = new XMLHttpRequest();
		xhr.responseType = 'text';
		xhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				resolve(JSON.parse(this.responseText));
			}		
		};		
		xhr.open('GET', 'users.json',true);
		xhr.send();
	})
}


// Pentru a cauta dupa zi, luna sau an, prelucram proprietatea data_nastere a obiectelor, a.i. sa o splituim in 3 proprietati (zi, luna, an)
function extend_props(obj_arr) {
	obj_arr.forEach(function(obj) {
		[obj.data_zi, obj.data_luna, obj.data_an] = obj.data_nastere.split(' ');
		[obj.oras, obj.tara] = obj.localitate.split(', ');
		//delete obj.data_nastere; // Stergem proprietatea pt a nu mai itera peste ea la rularea validarilor
	})
	filter(obj_arr);
}
			

function filter(obj_arr) {
	div_el.innerHTML = ''; // golim div-ul cu rezultate inainte de a rula un nou search
	let results_el = document.querySelector('div#header > p');
	results_el.innerHTML = '';
	let search_val = document.querySelector('input[type="text"]').value.trim().toLowerCase();// prelucram valoarea introdusa (trim + lowercase)
	let nr_results = 0;
	// Cazul 0 : dam submit la 'show_all' pt toate datele
	if (search_val == 'show_all') {
		for (let obj of obj_arr) {
			nr_results++;
			div_el.appendChild(display(obj));
			div_el.innerHTML += '<hr>';
		}			
	// Cazul 1 : valoarea de search nu este numerica, cautam in fiecare proprietate 'non-numerica' pt fiecare obiect, de la inceputul stringului
	} else if (isNaN(search_val)) {
		for (let obj of obj_arr) {
			for (let prop in obj) {
				// dam skip la prop numerice si la cele prelucrate
				if (prop == 'data_zi' || prop == 'data_an' || prop == 'src' || prop == 'localitate' || prop == 'data_nastere') {
					continue;
				}
				// Cautam in nume, prenume, oras, tara, data_luna de la inceputul stringului (ex: 'dor' nu va returna 'Tudor', dar va returna 'Dorian')
				if (obj[prop].toLowerCase().substr(0, search_val.length) == search_val) {					
					div_el.appendChild(display(obj));
					div_el.innerHTML += '<hr>';
					nr_results++;
					break;
				}
			}
		}
	// Cazul 2 : valoarea de search este numerica, cautam doar in data_zi si data_an
	} else if (!isNaN(search_val)) {
		for (let obj of obj_arr) {
			// validare pentru zi ( Number('2') === Number('02'))
			if ((search_val.length == 1 || search_val.length == 2) && Number(obj.data_zi) == Number(search_val)) {
				nr_results++;
				div_el.appendChild(display(obj));
				div_el.innerHTML += '<hr>';
			// validare pt an 3 cifre (ex: 197 match pe 197[0-9])
			} else if (search_val.length == 3 && obj.data_an.substr(0, 3) == search_val) {
				nr_results++;
				div_el.appendChild(display(obj));
				div_el.innerHTML += '<hr>';				
			// validare pentru an integral (ex: 1988 = 1988, 198 != 1988)
			} else if (search_val.length == 4 && obj.data_an == search_val) {
				nr_results++;
				div_el.appendChild(display(obj));
				div_el.innerHTML += '<hr>';
			}
		}
	} 
	if (!nr_results) {
		div_el.innerHTML = 'No results !';
	} else {
		results_el.innerHTML = `${nr_results} people`;
	}
}

function display(obj) {
	let div_el = document.createElement('div');
	
	let ul_el = document.createElement('ul');
	// initial era un for pt li, dar prop erau in alta ordine
	let li_el_nume = document.createElement('li');
	li_el_nume.innerText = `Nume: ${obj['nume']}`;
	ul_el.appendChild(li_el_nume);	
	let li_el_prenume = document.createElement('li');
	li_el_prenume.innerText = `Prenume: ${obj['prenume']}`;
	ul_el.appendChild(li_el_prenume);	
	let li_el_localitate = document.createElement('li');
	li_el_localitate.innerText = `Localitate: ${obj['localitate']}`;
	ul_el.appendChild(li_el_localitate);	
	let li_el_data = document.createElement('li');
	li_el_data.innerText = `Data nastere: ${obj['data_nastere']}`;
	ul_el.appendChild(li_el_data);
	
	let div_img_el = document.createElement('div');
	let img_el = document.createElement('img');
	img_el.setAttribute('src', obj.src);	
	div_img_el.appendChild(img_el);
	
	div_el.appendChild(div_img_el);
	div_el.appendChild(ul_el);	
	
	return div_el;	
}



document.getElementById('filter').onclick = function(ev) {
	ev.preventDefault();
	ajax_req().then(response => extend_props(response))
}