class Usuario{
    constructor(objUser){
        this.nombre=objUser.nombre;//parte derecha Json
        this.usuario=objUser.usuario;
        this.pass=objUser.pass;
        this.score=objUser.score;
        
        var rompecabezas=[];
         $.each(objUser.rompecabezas, function(i, rmp){//rompecabeza(respuesta)
           rompecabezas.push(new Rompecabeza(rmp));
        });
        
        
        this.rompecabezas= rompecabezas;
    }
}
class Rompecabeza{
    constructor(objRmp){
        this.titulo=objRmp.titulo;
        this.portada=objRmp.portada;
        this.sonido=objRmp.sonido;
        
        var piezas=[];
         $.each(objRmp.piezas, function(i, pieza){//pieza(respuesta)
           piezas.push(new Pieza(pieza));
        });
        
        this.piezas=piezas;
        
    }
}

class Pieza{
    constructor(objPieza){
        this.imagen=objPieza.imagen;
        this.orden=objPieza.orden;
    }
}

function listarRompecabezas(){
   var usuarios=[];
    
    $("#audioFondo").append("<audio loop id='audioF' controls><source type='audio/wav' src='..\/audios\/lagranja.mp3'></audio>");
    $("#audioF")[0].play();
    $("#audioFondo").append("<audio autoplay id='audioP' controls><source  type='audio/mp3' src='..\/audios\/eligeRompecabezas.mp3'></audio>");
    $("#audioP")[0].play();
    
    
    $.getJSON('info.json', function(data){
       
        $.each(data, function(i, usr){
            usuarios.push(new Usuario(usr));   
        });
        
          console.log(usuarios);
        
        var idUsuario = localStorage.getItem("idUser");
        
     $.each(usuarios[idUsuario].rompecabezas, function(i, objRmp){
            $("#lista").append("<div class='col-sm-4'>\
                        <button id='btnLista' onclick='enviar("+i+")'>\
                        <h3 id='idh3'>"+ objRmp.titulo + "</h3>\
                        <img class='imgPortada img-fluid' src='" + objRmp.portada + "'alt=''>\
                        </button>\
                        </div>"); 
        });
        
        let dataStr = JSON.stringify(usuarios);
        let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        let exportFileDefaultName = 'datos.json';
        
        $("#exportar").attr('href', dataUri);
        $("#exportar").attr('download', exportFileDefaultName);    
        
    });  
    
}


 function enviar(pos) {
    localStorage.setItem("posRmp", pos);//guardar en cache
    window.location = "rompecabeza.html";
};


var intentos=0;
var piezaCorrecta=0;

 function recibir() {
     
     init();
     var usuarios=[];
     
     console.log(usuarios);
     
    var recoger = localStorage.getItem("posRmp");//guardar 
    //alert(recoger);
     
     var idUsuario = localStorage.getItem("idUser");
      
    $.getJSON('info.json', function(data){
     
        $.each(data, function(i, user){//user(respuesta)
           usuarios.push(new Usuario(user));
        });
        //obteniendo los datos de cada rompecabezas
            $.each(usuarios[idUsuario].rompecabezas, function(i, objRmp){//rompecabeza(respuesta)

        if(i==recoger){
            
            $("#titulo").html(objRmp.titulo);
             $("#puntaje").html(usuarios[idUsuario].score);
             $("#intentos").html(intentos);
            
            var lista= objRmp.piezas;
            lista= objRmp.piezas.sort(function() {return Math.random() - 0.5})
      
            
         $.each(lista, function(i, objPieza){//user(respuesta)
           $(".piezas").append("<div class='col-sm-4'><img id='s"+objPieza.orden+"' class='img-fluid' src='"+objPieza.imagen+"'></div>");
             
            $("#s"+objPieza.orden).draggable({ revert: true});//si no es compatible con la posisicon se regresa // llama al mismo id
             
             
             
             $(".fondoRmp").append("<div id='fs"+(i+1)+"' class='col-sm-4 fondoPz'></div>");
             
             
             //que reciban el tablero
             $("#fs"+(i+1)).droppable({
        drop: function (event, ui) {
            intentos++;
            
            if(intentos>20){
                         //alert("INTÉNTALO DE NUEVO");
                        $("#audioDiv").html("<audio id='audioE' controls><source type='audio/mp3' src='..\/audios\/perdiste.mp3'></audio>");
                        $("#audioE")[0].play();
                         
                         
            }
        
             $("#intentos").html(intentos);
            if ("f"+ui.draggable.attr("id") == $(this).attr("id")) {
                $("#audioDiv").html("<audio id='audioA' controls><source type='audio/wav' src='"+objRmp.sonido+"'></audio>");
                                    $("#audioA")[0].play();
                piezaCorrecta++;
                
                if(piezaCorrecta == objRmp.piezas.length){
                   
                   //alert("GANASTE!");
                    
                                       
                    if(intentos<=15){
                        //alert("PUNTOS!!");
                        $("#audioDiv").html("<audio id='audioE' controls><source type='audio/mp3' src='..\/audios\/ganaste.mp3'></audio>");
                        $("#audioE")[0].play();
                        usuarios[idUsuario].score++;
                         $("#puntaje").html(usuarios[idUsuario].score);
                       }else{
                          $("#audioDiv").html("<audio id='audioE' controls><source type='audio/mp3' src='..\/audios\/loHiciste.mp3'></audio>");
                        $("#audioE")[0].play(); 
                       }
                    
                    
                       $.ajax({
                                        url: 'guardarPuntaje.php',
                                        method: 'POST',
                                        data: {
                                            "identificador": usuarios
                                        },
                                        success: function (data) {
                                            setTimeout("location.href='listarRompecabezas.html'", 6000);
                                        },
                                        error: function (data){
                                            alert("err"+data);
                                            console.log(data);
                                            
                                        }
                                    });
                    
                    
              
            }
                
                
                
                var url = ui.draggable.attr("src");
                $(this).html("<img class='img-fluid' objPieza.orden src='" + url + "'>");
                 ui.draggable.remove();

                
                
                }else{
                    $("#audioDiv").html("<audio id='audioE' controls><source type='audio/wav' src='..\/audios\/incorrecto.mp3'></audio>");
                    $("#audioE")[0].play();
                }
            
            
            
            }
         });     
       });   
      }            
    });
 });
}


function validar(){   
     var usuarios=[];    
 
    $.getJSON('paginas/info.json', function(data){
     
        $.each(data, function(i, user){//user(respuesta)
           usuarios.push(new Usuario(user));
        });
        var user = $("#username").val();
        var pass = $("#password").val();
        var flag = 0;
        $.each(usuarios, function(i, res){
            if(user == res.usuario && pass == res.pass){
                localStorage.setItem("idUser", i);
                flag++;
                window.location = 'paginas/listarRompecabezas.html'
            }
        });
        
        if(flag==0){
            $("#audioError").html("<audio id='audioE' controls><source type='audio/wav' src='..\/audios\/datosincorrectos.mp3'></audio>");
            $("#audioE")[0].play();
        }
    });   
}
       $('#validar').click(validar);       
              
        
       
function touchHandler(event) {
    var touch = event.changedTouches[0];

    var simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent({
        touchstart: "mousedown",
        touchmove: "mousemove",
        touchend: "mouseup"
    }[event.type], true, true, window, 1,
        touch.screenX, touch.screenY,
        touch.clientX, touch.clientY, false,
        false, false, false, 0, null);

    touch.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}

function init() {
    document.getElementById('tablero').addEventListener("touchstart", touchHandler, true);
    document.getElementById('tablero').addEventListener("touchmove", touchHandler, true);
    document.getElementById('tablero').addEventListener("touchend", touchHandler, true);
    document.getElementById('tablero').addEventListener("touchcancel", touchHandler, true);
}
      
    





