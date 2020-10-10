
var nombre;
var empresa;
var telefono;
var email;
var comentario;
var orientacion = "Horizontal";
var total_peso;
var no_total_cortes;
var cortes_por_pliego;
var id_canvas;
var p_ancho;
var p_largo;
var c_ancho;
var c_largo;

$(document).ready(function() {

/*
 * Clic en la orientacion V
 */
    $('#orientacion_v').click(function(e) {

        e.preventDefault();
        
        if(validarForma() === 1) {

            orientacion = "Vertical";

            var b      = Math.max(p_ancho,p_largo);
            var h      = Math.min(p_ancho,p_largo);
            var cb     = c_ancho;
            var ch     = c_largo;
            var escala = 250 / b;

            var cortes, sobrante;
            var totalCortes;
            var cortesV, cortesH = 0;
            
            clearCanvas();
            $("#"+id_canvas).attr({width: h * escala, height: b * escala, style: "background-color: #272B34;"});
            
            cortes = acomoda(b, h, "N", "V");
            totalCortes = cortes.cortesT;
            
            dibujaCuadricula(cortes.cortesB, cortes.cortesH, cb, ch, 0, 0, escala);
            
            if (cortes.sobranteB >= ch) {

                sobrante = acomoda(cortes.sobranteB, b, "H", "H");
                totalCortes += sobrante.cortesT;
                dibujaCuadricula(sobrante.cortesH, sobrante.cortesB, ch, cb, cortes.cortesB * cb * escala, 0, escala, "R");
            } else if (cortes.sobranteH >= cb) {

                sobrante = acomoda(cortes.sobranteH, h, "H", "H");
                totalCortes += sobrante.cortesT;
                dibujaCuadricula(sobrante.cortesB, sobrante.cortesH, ch, cb, 0, cortes.cortesH * ch * escala, escala, "R");
            } else {

                sobrante = {

                    cortesT: 0,
                    cortesB: 0,
                    cortesH: 0,
                    sobranteB: 0,
                    sobranteH: 0,
                    areaUtilizada: 0
                };
            }
            
            //console.log("Cortes: " + cortes.cortesT + " Sobrante: " + sobrante.cortesT + " Total: " + cortes.cortesT + sobrante.cortesT);
            
            $(this).addClass('disabled');
            $("#orientacion_h").removeClass('disabled');

            //clearCanvas();
            
            if (parseInt(cb) < parseInt(ch)) {

                cortesV = cortes.cortesT;
                cortesH = sobrante.cortesT;
            } else {

                cortesV = sobrante.cortesT;
                cortesH = cortes.cortesT;
            }
            
            //Calculando el area
            calcularArea(b, h, cb, ch, totalCortes);
            calcular(b, h, cortesV, cortesH, totalCortes, cortes.cortesT, "V");
        }
    });

/*
 * Clic en la orientacion H
 */
    $('#orientacion_h').click(function(e) {

        e.preventDefault();
        
        if(validarForma() === 1){

            orientacion = "Horizontal";

            var b      = Math.max(p_ancho,p_largo);
            var h      = Math.min(p_ancho,p_largo);
            var cb     = c_ancho;
            var ch     = c_largo;
            var escala = 250 / b;

            var cortes, sobrante;
            var totalCortes;
            var cortesV, cortesH = 0;
            
            clearCanvas();
            $("#"+id_canvas).attr({width: b * escala, height: h * escala, style: "background-color: #272B34;"});
            
            cortes = acomoda(b, h, "N", "H");
            totalCortes = cortes.cortesT;
            
            dibujaCuadricula(cortes.cortesB, cortes.cortesH, cb, ch, 0, 0, escala);
            
            if (cortes.sobranteB >= ch) {

                sobrante = acomoda(cortes.sobranteB, h, "H", "H");
                totalCortes += sobrante.cortesT;
                dibujaCuadricula(sobrante.cortesH, sobrante.cortesB, ch, cb, cortes.cortesB * cb * escala, 0, escala, "R");
                //console.log("Sobro B");
            } else if (cortes.sobranteH >= cb) {

                sobrante = acomoda(cortes.sobranteH, b, "H", "H");
                totalCortes += sobrante.cortesT;
                dibujaCuadricula(sobrante.cortesB, sobrante.cortesH, ch, cb, 0, cortes.cortesH * ch * escala, escala, "R");
                //console.log("Sobro H");
            } else {

                sobrante = {
                    cortesT: 0,
                    cortesB: 0,
                    cortesH: 0,
                    sobranteB: 0,
                    sobranteH: 0,
                    areaUtilizada: 0
                };
            }
            
            //console.log("Cortes: " + cortes.cortesT + " Sobrante: " + sobrante.cortesT + " Total: " + cortes.cortesT + sobrante.cortesT);
            
            $(this).addClass('disabled');
            $("#orientacion_v").removeClass('disabled');
            
            if (parseInt(cb) < parseInt(ch)) {

                cortesV = cortes.cortesT;
                cortesH = sobrante.cortesT;
            } else {

                cortesV = sobrante.cortesT;
                cortesH = cortes.cortesT;
            }
            
            //Calculando el area
            calcularArea(b, h, cb, ch, totalCortes);
            calcular(b, h, cortesV, cortesH, totalCortes, cortes.cortesT, "H");
          
        }
    });
    
/* 
 * Clic en el boton Maximo
 */
    $('#maximo').click(function(e) {

        e.preventDefault();
        
        if(validarForma() === 1) {

            orientacion = "Maximo";

            var b      = Math.max(p_ancho,p_largo);
            var h      = Math.min(p_ancho,p_largo);
            var cb     = Math.max(c_ancho,c_largo);
            var ch     = Math.min(c_ancho,c_largo);
            var escala = 250 / b;

            var a1h = h;
            var a1b = b;
            var a2h, a2b, sumaCortes = 0;
            var corteA1, corteA2;
            var totalCortes;
            var acomodo1, acomodo2 = {

                a1b: "",
                a2b: "",
                a1h: "",
                a2h: "",
                sumaCortes: "" 
            };
            
            clearCanvas();
            $("#"+id_canvas).attr({width: b * escala, height: h * escala, style: "background-color: #272B34;"});
            
            $("#orientacion_v").removeClass('disabled');
            $("#orientacion_h").removeClass('disabled');
            
            /* Primero se acomoda el papel en H */
            var cortes =acomoda(b, h, "H", "M");
            
            totalCortes = cortes.cortesT;
            acomodo1 = {

                a1b: b, 
                a2b: b, 
                a1h: h, 
                a2h: 0, 
                sumaCortes: totalCortes, 
                cortesH1: cortes.cortesH,
                cortesB1: cortes.cortesB,
                cortesT1: cortes.cortesT,
                cortesH2: 0,
                cortesB2: 0,
                cortesT2: 0
            };
            
            for (x = 0; x <= cortes.cortesH; x++) {

                a2b = b;
                
                a2h = parseFloat(((ch * x) + cortes.sobranteH).toFixed(2));
                a1h = parseFloat((h - a2h).toFixed(2));
                
                corteA1 = acomoda(a1b, a1h, "H", "N");
                corteA2 = acomoda(a2b, a2h, "V", "N");
                
                sumaCortes = corteA1.cortesT + corteA2.cortesT;
                
                if(sumaCortes > totalCortes) {

                    totalCortes = sumaCortes;
                    acomodo1 = {

                        a1b: a1b, 
                        a2b: a2b, 
                        a1h: a1h, 
                        a2h: a2h, 
                        sumaCortes: totalCortes, 
                        cortesH1: corteA1.cortesH, 
                        cortesB1: corteA1.cortesB,
                        cortesT1: corteA1.cortesT,
                        cortesH2: corteA2.cortesH,
                        cortesB2: corteA2.cortesB,
                        cortesT2: corteA2.cortesT
                    };
                }
                //console.log("x: " + x + " corte A1: " + corteA1.cortesT + " corte A2: " + corteA2.cortesT + " cortes: " + sumaCortes);
            }
            
            //console.log(acomodo1.sumaCortes);
            
            totalCortes = cortes.cortesT;

            acomodo2 = {a1b: b, a2b: 0, a1h: h, a2h: h, sumaCortes: totalCortes, cortesH: totalCortes, cortesV: 0};
            
            for (x = 0; x <= cortes.cortesB; x++) {

                a2h, a1h = h;
                
                a2b = parseFloat(((cb * x) + cortes.sobranteB).toFixed(2));
                a1b = parseFloat((b - a2b).toFixed(2));
                
                corteA1 = acomoda(a1b, a1h, "H", "N");
                corteA2 = acomoda(a2b, a2h, "V", "N");
                
                sumaCortes = corteA1.cortesT + corteA2.cortesT;
                
                if(sumaCortes > totalCortes) {

                    totalCortes = sumaCortes;
                    acomodo2 = {

                        a1b: a1b, 
                        a2b: a2b, 
                        a1h: a1h, 
                        a2h: a2h, 
                        sumaCortes: totalCortes, 
                        cortesH1: corteA1.cortesH, 
                        cortesB1: corteA1.cortesB,
                        cortesT1: corteA1.cortesT,
                        cortesH2: corteA2.cortesH,
                        cortesB2: corteA2.cortesB,
                        cortesT2: corteA2.cortesT
                    };
                }
                //console.log("x: " + x + " corte A1: " + corteA1.cortesT + " corte A2: " + corteA2.cortesT + " cortes: " + sumaCortes);
            }
            
            //console.log(acomodo2.sumaCortes);
            
            if(acomodo2.sumaCortes > acomodo1.sumaCortes) {

                //Calculando el area
                calcularArea(b, h, cb, ch, acomodo2.sumaCortes);
                calcular(b, h, acomodo2.cortesT2, acomodo2.cortesT1, parseInt(acomodo2.sumaCortes), acomodo2.sumaCortes, "M");
                //console.log("Corte V: " + acomodo2.sumaCortes);
                //Dibuja 2 areas una al lado de otra
                dibujaCuadricula(acomodo2.cortesB1, acomodo2.cortesH1, cb, ch, 0, 0, escala);
                dibujaCuadricula(acomodo2.cortesB2, acomodo2.cortesH2, ch, cb, acomodo2.cortesB1 * cb * escala, 0, escala);
            } else {

                //Calculando el area
                calcularArea(b, h, cb, ch, acomodo1.sumaCortes);
                calcular(b, h, acomodo1.cortesT2, acomodo1.cortesT1, acomodo1.sumaCortes, parseInt(acomodo1.sumaCortes), "M");
                //console.log("Corte H: " + acomodo1.sumaCortes);
                //Dibuja 2 areas una arriba de otra
                dibujaCuadricula(acomodo1.cortesB1, acomodo1.cortesH1, cb, ch, 0, 0, escala);
                dibujaCuadricula(acomodo1.cortesB2, acomodo1.cortesH2, ch, cb, 0, acomodo1.cortesH1 * ch * escala, escala);
            }
        }
    });

/*
 * Clic en el boton Reset
 */
    $('#reset').click(function(e) {

        e.preventDefault();
        clearCanvas();
        reset();
    });

    // Validar que sea solo enteros
    $("#form_calc input").keypress(function(e) {

        return NumCheck(e, this);
    });

    
    function NumCheck(e, field) {

        key = e.keyCode ? e.keyCode : e.which;

        // backspace and tab
        if (key === 8 || key === 9)
            return true;
        
        // 0-9
        if (key > 47 && key < 58) {

            if ($(field).attr('id') != 'cortes_deseados') {

                if (field.value === "")
                    return true;
                
                regexp = /.[0-9]{2}$/;
                return !(regexp.test(field.value));
            }
            else {

                if (field.value === "")
                    return true;
                
                regexp = /.[0-9]{5}$/;
                return !(regexp.test(field.value));
            }
        }
        // .
        if (key === 46) {

            if (field.value === "")
                return false;
            
            regexp = /^[0-9]+$/;
            return regexp.test(field.value);
        }

        // other key
        return false;
    }


    //Imprimir calculadora a PDF
    $('#imprimir').click(function() {

        var canvas = document.getElementById(id_canvas);
        var img    = new Image();

        img.src = canvas.toDataURL();

        $("#dibujo").append(img);
        $("#"+id_canvas).hide();

        //$(".calculadora-frame").printArea();
		$("#calculadora_cortes").printArea();
        $("#dibujo > img").remove();
        $("#"+id_canvas).show();
    });
    
    //Formulario para enviar correo electronico     
    $('#enviar_correo').on('click', function(e) {

        e.preventDefault(); 

        if(validarEnvioMail()) {

            $(this).button('loading');
            sendEmail();            
        } else
            alert("Los campos nombre y correo son obligatorios.")
    });
});


function acomoda(d1, d2, c_ancho, c_largo, acomodoCorte, acomodoPliego) {

    /*
     * corte_ancoho y corte_largo siempre son constantes
     */
    var corteAncho = c_ancho;
    var corteLargo = c_largo;
    var cb = 1;
    var ch = 1;
    var b = 1;
    var h = 1;
    
    if(acomodoPliego === "V") {

        b = Math.max(d1, d2);
        h = Math.min(d1, d2);
    } else if (acomodoPliego === "H") {

    /* Acomodo del pliego en horizontal y para el calculo del maximo  */
        b = Math.max(d1, d2);
        h = Math.min(d1, d2);        
    } else {

        b = d1;
        h = d2;
    }
    
    if (acomodoCorte === 'H') {

        cb = Math.max(corteAncho, corteLargo);
        ch = Math.min(corteAncho, corteLargo);       
    } else if(acomodoCorte === 'V') {

        cb = Math.min(corteAncho, corteLargo);
        ch = Math.max(corteAncho, corteLargo);   
    } else {
        cb = corteAncho;
        ch = corteLargo;
    }
    
    var cortesT       = (parseInt(b / cb)) * (parseInt(h / ch));
    var cortesB       = parseInt(b / cb);
    var cortesH       = parseInt(h / ch);
    var sobranteB     = parseFloat((b - (cortesB * cb)).toFixed(2));
    var sobranteH     = parseFloat((h - (cortesH * ch)).toFixed(2));
    var areaUtilizada = parseFloat(((cb * ch) * (parseInt(b / cb)) * (parseInt(h / ch))).toFixed(2));
    
    var cortes = {
        cortesT: cortesT,
        cortesB: cortesB,
        cortesH: cortesH,
        sobranteB: sobranteB,
        sobranteH: sobranteH,
        areaUtilizada: areaUtilizada
    };
    
    return cortes;
}



function calcular(b, h, cortesV, cortesH, totalCortes, utilizables, cortes_deseados, orientacion){

    var gramaje = $("#papel_gramaje").val();

//    var cortesDeseados = $("#cortes_deseados").val();
    var cortesDeseados = cortes_deseados;
    var pliegosP = 1;
    var pliegos  = 0;
    
    if (orientacion === "H") {
        pliegos = Math.ceil(cortesDeseados / utilizables);

        return cortesH;
    } else if (orientacion === "V") {
        
        pliegos = Math.ceil(cortesDeseados / utilizables);

        return cortesV;
    } else {
        //Calculando el numero de pliegos necesarios
        
        pliegos = Math.ceil(cortesDeseados / totalCortes);
    }
   
    if(pliegos !== 0 && !isNaN(pliegos)) {

        pliegosP = pliegos;
    } else if (isNaN(pliegos)) {

        pliegos = 0;
    }

    console.log('llego aqui 5');
    console.log('cortes_por_pliego: '+ totalCortes);

    /*Calculando el peso total b y h estan en centimetros es necesario convertirlos a metros y multiplicarlos por el gramaje (gr / m2)
    */
    total_peso = (pliegosP * (((b/100) * (h/100) * gramaje) / 1000)).toFixed(4);
    
    //Calculando el numero total de cortes en todos los pliegos
    no_total_cortes = totalCortes * pliegos;
    
    //Imprimiendo resultados
    
    
    //imprimirResultados(totalCortes, pliegos, no_total_cortes, cortesH, cortesV, total_peso, utilizables);
}


function clearCanvas() {
    
    var canvas = document.getElementById(id_canvas);

    var context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
}


function calcularArea(ancho_papel, largo_papel, ancho_corte, largo_corte, cortes_en_pliego) {

    var area_papel = ancho_papel * largo_papel;
    var area_corte = ancho_corte * largo_corte;

    var area_utilizada_cortes = cortes_en_pliego * area_corte;

    var porcentaje_area_utilizada = ((area_utilizada_cortes * 100) / area_papel).toFixed(2);
    var porcentaje_area_inutilizada = (100 - porcentaje_area_utilizada).toFixed(2);

    $("#area_utilizada").text(porcentaje_area_utilizada);
    $("#area_inutilizada").text(porcentaje_area_inutilizada);
}


function imprimirResultados(cortes_pliego, pliegos, cortes, cortesH, cortesV, peso, utilizables) {

    $("#cortes_pliego").text(cortes_pliego);
    $("#cortes_utilizables").text(utilizables);
    $("#pliegos").text(pliegos);
    $("#numero_cortes").text(cortes);
    $("#numero_cortes_vertical").text(cortesV);
    $("#numero_cortes_horizontal").text(cortesH);
    $("#peso").text(peso);
}


function validarForma() {

    var valida = 1;

    if (p_ancho === '' || p_largo === '' ||  c_largo === '' || c_ancho === '') {

        valida = 0;
    }

    return valida;
}


function reset() {

    $("#papel_ancho").val('');
    $("#papel_largo").val('');
    $("#papel_gramaje").val('');
    $("#corte_ancho").val('');
    $("#corte_largo").val('');
    $("#cortes_deseados").val('');
}


function dibujaCuadricula(cortesX, cortesY, width, height, coorX, coorY, escala,canvas_id, color) {
    
    if(color === "R") {

        color = '#ccc';
    } else {

        color = '#fff';
    }
    
    var canvas  = document.getElementById(canvas_id);
    var context = canvas.getContext('2d');
    var coorY1  = coorY;
    var coorX1  = coorX;
    
    width  = escala * width;
    height = escala * height;
    
    for (x = 1; x <= cortesX; x++) {
        
        coorY = coorY1;
        
        for (y = 1; y <= cortesY; y++) {
            
            context.beginPath();
            context.fillStyle = color;
            context.rect(coorX, coorY, width, height);
            context.fill();
            context.lineWidth = .8;
            context.strokeStyle = '#272B34';                      
                       
            context.stroke();
            
            coorY = (height * y) + coorY1;
        }
        
        coorX = (width * x) + coorX1;
    }
}


function isInt(n) {

   return n % 1 === 0;
}
