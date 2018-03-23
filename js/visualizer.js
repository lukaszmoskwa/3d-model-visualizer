
/*
Struttura di quello che c'è dentro questo array:

[
	{
		"x" : posizione in x
		"y" : posizioen in y
		"z" : posizione in z
		"r" : colorazione rossi
		"g" : colorazione verdi
		"b" : colorazione blu
	},
	{
		"x" : posizione in x
		"y" : posizioen in y
		"z" : posizione in z
		"r" : colorazione rossi
		"g" : colorazione verdi
		"b" : colorazione blu
	}

]

*/
let mesh_geometry_vertex = [];
let vertex_sphere = [];
let mesh_geometry_faces = [];
const increment_value = 1;
const interval_time = 10;
const focus_time = 20;
let controllo_booleano = true;
const custom_camera_rotation = 0.005;
let aqua_mat;
let line;



const progress_button = document.getElementById("progress_button");
let vertex_progress_counter = 0;
let faces_progress_counter = 0;

progress_button.addEventListener("click", function(){
	//Faccio partire il set interval condizionato
	setInterval(function(){
		//if (mesh_geometry_vertex[vertex_progress_counter] || mesh_geometry_faces[faces_progress_counter]) {
			if (document.getElementById("check_1").checked == true) {
				var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:1}, scene);
				
				// Setto le posizioni
				sphere.position.x = mesh_geometry_vertex[vertex_progress_counter]["x"];
				sphere.position.y = mesh_geometry_vertex[vertex_progress_counter]["y"];
				sphere.position.z = mesh_geometry_vertex[vertex_progress_counter]["z"];
				
				calculateCameraCenter(sphere);

				vertex_progress_counter += increment_value;
				sphere.material = aqua_mat; 
				hl.addMesh(sphere, new BABYLON.Color3(mesh_geometry_vertex[vertex_progress_counter]["r"],
				mesh_geometry_vertex[vertex_progress_counter]["g"] , 
				mesh_geometry_vertex[vertex_progress_counter]["b"]))
				vertex_sphere.push(sphere);
				//camera.lockedTarget = sphere;
			}
			if(document.getElementById("check_4").checked == true){
				if (mesh_geometry_faces[faces_progress_counter] != null){
					const first_a = mesh_geometry_vertex[mesh_geometry_faces[faces_progress_counter]["first"]-1]["x"];
					const second_a = mesh_geometry_vertex[mesh_geometry_faces[faces_progress_counter]["first"]-1]["y"];
					const third_a = mesh_geometry_vertex[mesh_geometry_faces[faces_progress_counter]["first"]-1]["z"];
					const first_b = mesh_geometry_vertex[mesh_geometry_faces[faces_progress_counter]["second"]-1]["x"];
					const second_b = mesh_geometry_vertex[mesh_geometry_faces[faces_progress_counter]["second"]-1]["y"];
					const third_b = mesh_geometry_vertex[mesh_geometry_faces[faces_progress_counter]["second"]-1]["z"];
					const first_c = mesh_geometry_vertex[mesh_geometry_faces[faces_progress_counter]["third"]-1]["x"];
					const second_c = mesh_geometry_vertex[mesh_geometry_faces[faces_progress_counter]["third"]-1]["y"];
					const third_c = mesh_geometry_vertex[mesh_geometry_faces[faces_progress_counter]["third"]-1]["z"];
					const first_d = mesh_geometry_vertex[mesh_geometry_faces[faces_progress_counter]["fourth"]-1]["x"];
					const second_d = mesh_geometry_vertex[mesh_geometry_faces[faces_progress_counter]["fourth"]-1]["y"];
					const third_d = mesh_geometry_vertex[mesh_geometry_faces[faces_progress_counter]["fourth"]-1]["z"];
					const a = new BABYLON.Vector3(first_a, second_a, third_a);
					const b = new BABYLON.Vector3(first_b, second_b, third_b);
					const c = new BABYLON.Vector3(first_c, second_c, third_c);
					const d = new BABYLON.Vector3(first_d, second_d, third_d);
					let faces_point = [ a, b, c, d];
					var reds = [new BABYLON.Color4(0,0,1,1), new BABYLON.Color4(1,1,1,1), new BABYLON.Color4(0,0.5,1,1),  new BABYLON.Color4(0,0.5,1,1)];
					line = BABYLON.MeshBuilder.CreateLines("lines", {points: faces_point, colors: reds}, scene);
					hl.addMesh(line, new BABYLON.Color3(0, 0 , 1));
					if (faces_progress_counter % focus_time == 0) {
						camera.lockedTarget = vertex_sphere[mesh_geometry_faces[faces_progress_counter]["third"]];
					}
					location.hash = "parsed_line_" + faces_progress_counter;
					faces_progress_counter += increment_value;
				}
				
				//
			//}
			

		}
		
	}, interval_time);
	

});


/*
	Variabili utilizzate per instanziare una dropZone
*/
const dropZone = document.getElementById("dropZone");
const overDrop = document.getElementById("overDrop");
const mesh_zone = document.getElementById("mesh_zone");
let instructionCounter = 0;

/*
	Funzione per mostrare la dropZone
*/
function showDropZone() {
	dropZone.style.visibility = "visible";
}
/*
	Funzione per nascondere la dropZone
*/
function hideDropZone() {
	dropZone.style.visibility = "hidden";
	overDrop.style.display = "none";
	mesh_zone.style.display = "block";
}

/*
	Funzione che permette il drag del file all'interno della dropZone
*/
function allowDrag(e) {
	e.dataTransfer.dropEffect = "copy";
	e.preventDefault();
}

let _maxprev_x =0;
let _maxprev_y =0;
let _maxprev_z =0;
let _minprev_x =0;
let _minprev_y =0;
let _minprev_z =0;

function calculateCameraCenter(a){
	if (a.position.x >= Math.abs(_maxprev_x)) {
		_maxprev_x = a.position.x;
		//camera.lockedTarget = line;
		
	}
	if (a.position.y >= _maxprev_y) {
		_maxprev_y = a.position.y;
		//camera.lockedTarget = line;
	}
	if (a.position.z >= _maxprev_z) {
		_maxprev_z = a.position.z;
		//camera.lockedTarget = line;
	}
	if (a.position.x < _minprev_x) {
		_minprev_x = a.position.x;
		//camera.lockedTarget = a;
	}
	if (a.position.y < _minprev_y) {
		_minprev_y = a.position.y;
		//camera.lockedTarget = a;
	}
	if (a.position.z < _minprev_z) {
		_minprev_z = a.position.z;
		//camera.lockedTarget = a;
	}

}


/*
	Funzione del primo parsing che viene effettuato sulla linea che viene passata. Il file di per 
	se è giè organizzato in modo da contenere un informazione (che sia, v, vn o altro) in ciascuna
	riga, pertanto viene effettuato il parsing riga per riga per ottenere le informazioni

	Quando il parser si accorge che non sta ricevendo in ingresso un commento, separa gli oggetti divisi
	da degli spazi con la seguente notazione

	v [posizione x] [posizione y] [posizione z] [colore r] [colore g] [colore b] 


*/
function firstParse(line){
	if(isComment(line)){
		const comment = document.createElement("p");
		comment.classList.add("obj_comment");
		comment.innerHTML = line;
		return comment;
	}else{
		instructionCounter += 1;
		//Creation of the composed div
		const div = document.createElement("div");
	
		/**
		* Condizione per la quale ci interessa prendere solo i vettori geometrici
		*/
		if (line.charAt(0)=="v" && line.charAt(1)==" ") {
			parseGeometricVectors(line);
			div.innerHTML = line;
			div.style.display = "flex";
			div.id = "parsed_line_" + instructionCounter;
			if (controllo_booleano) {
				div.classList.add("selected");
				controllo_booleano = !controllo_booleano;
			}
			return div;
		}
		if (line.charAt(0)=="f" && line.charAt(1)==" ") {
			parseGeometricFaces(line);
			div.innerHTML = line;
			div.style.display = "flex";
			div.id = "parsed_line_" + instructionCounter;
			if (controllo_booleano) {
				div.classList.add("selected");
				controllo_booleano = !controllo_booleano;
			}
			return div;
		}else{
			return "no";
		}
		
	}
}

/**
	Questa funzione si occupa di parsare la linea in input e pushare gli oggetti all'
	interno dell'array mesh_geometry_vertex
**/
function parseGeometricVectors(line){
	const array_linea = line.split(" ");
	/* 
		A questo punto, il primo dell'array è sicuramente la v
		La tripletta successiva indica le coordinate x, y, z
		La tripletta successiva indica i colori
		Creo quindi l'oggetto da pushare dentro l'array
	*/
	var temp = {
		"x" : array_linea[1],
		"y" : array_linea[2],
		"z" : array_linea[3],
		"r" : array_linea[4],
		"g" : array_linea[5],
		"b" : array_linea[6]
	}
	mesh_geometry_vertex.push(temp);
}


function parseGeometricFaces(line){
	const array_linea = line.split(" ");
	/*
		Ora bisogna splittare ulteriormente in base alle /
		in modo da ottenere il vertice geometrico preciso
	*/
	const first = array_linea[1].split("/")[0];
	var temp = {
		"first" : first,
		"second" : array_linea[2].split("/")[0],
		"third" : array_linea[3].split("/")[0],
		"fourth": first
	}
	mesh_geometry_faces.push(temp);
}




// Function to check if the parsed line is a comment
// Return true or false
function isComment(line){
	return (line.charAt(0) == "#");
}



// Function that handles the drop of the file and then start parsing
function handleDrop(e) {
	e.preventDefault();
	hideDropZone();
	const files = e.dataTransfer.files;
	// Control to check if the user dropped one ore more files... a type check should be done too..
	if(files.length > 1){
		alert("You cannot insert more than one file");
	}
	const reader = new FileReader();

	reader.onload = (event ) => {
		const file = event.target.result;
		const allLines = file.split(/\r\n|\n/);
		// Reading line by line
		allLines.map((line) => {

			/**
			* Qui avviene l'inserimento di tutto cio che mi interessa all'iterno della mesh_zone
			*/
			var firstParse_result = firstParse(line);
			if(firstParse_result!=="no"){
				mesh_zone.appendChild(firstParse_result);
			}
			//Here i need to parse 

			
		});
	};
	reader.onerror = (evt) => {
		alert(evt.target.error.name);
	};
	reader.readAsText(files[0]);
    

}

// 1
window.addEventListener("dragenter", function() {
	showDropZone();
});

// 2
dropZone.addEventListener("dragenter", allowDrag);
dropZone.addEventListener("dragover", allowDrag);

// 3
dropZone.addEventListener("dragleave", function() {
	hideDropZone();
});

// 4
dropZone.addEventListener("drop", handleDrop);


/*** BABYLON STUFF ***/


var canvas = document.getElementById("renderCanvas"); // Get the canvas element 

var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
var hl;



/******* Add the create scene function ******/
var createScene = function () {

            // Create the scene space
            var scene = new BABYLON.Scene(engine);

            // Add a camera to the scene and attach it to the canvas
            camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 5, BABYLON.Vector3.Zero(), scene);
            camera.attachControl(canvas, true);
            camera.setPosition(new BABYLON.Vector3(10, 10, 20));

            scene.clearColor = new BABYLON.Color3(0,0,0);


            aqua_mat = new BABYLON.StandardMaterial("mat1", scene);
            aqua_mat.emissiveColor = diffuseColor = new BABYLON.Color3(0, 0, 1);


            hl = new BABYLON.HighlightLayer("hl1", scene);
            hl.innerGlow = true;


            // Add lights to the scene
            var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
            var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

            BABYLON.SceneOptimizer.OptimizeAsync(scene,	OptimizerOptions(), null, null);

            // Add and manipulate meshes in the scene
            

            return scene;
    };

    var OptimizerOptions = function() {
        	var result = new BABYLON.SceneOptimizerOptions(30, 2000); // limit 30 FPS min here
        
        	var priority = 0;
        	result.optimizations.push(new BABYLON.ShadowsOptimization(priority));
        	result.optimizations.push(new BABYLON.LensFlaresOptimization(priority));
        
        	// Next priority
        	priority++;
        	result.optimizations.push(new BABYLON.PostProcessesOptimization(priority));
        	result.optimizations.push(new BABYLON.ParticlesOptimization(priority));
        
        	// Next priority
        	priority++;
        	result.optimizations.push(new BABYLON.TextureOptimization(priority, 256));
        
        	// Next priority
        	priority++;
        	result.optimizations.push(new BABYLON.RenderTargetsOptimization(priority));
        
        	// Next priority
        	priority++;
        	result.optimizations.push(new BABYLON.HardwareScalingOptimization(priority, 4));
        	
        	return result;
        }

    /******* End of the create scene function ******/    
    var camera;
    var scene = createScene(); //Call the createScene function

engine.runRenderLoop(function () { // Register a render loop to repeatedly render the scene
        scene.render();
        camera.alpha += custom_camera_rotation;
});


window.addEventListener("resize", function () { // Watch for browser/canvas resize events
        engine.resize();
});

