$(document).bind("mobileinit", function(){
	 $.extend(  $.mobile , {
	 defaultPageTransition: 'none' 
	});

 $.mobile.defaultPageTransition = 'none';
 $.mobile.defaultDialogTransition = 'none';
});

var db;
function setear_tabla(){
    db.transaction( function(tx) {
                   //tx.executeSql('DROP TABLE IF EXISTS pedidos');
                   tx.executeSql("CREATE TABLE IF NOT EXISTS pedidos(idpedido integer primary key autoincrement, producto text, minutos text,observaciones text, fecha text)")
                   });
    // var obj=[];
    // var jqxhr = $.get("http://reporter.invertec.cl/intranet/Proyectos/corporativo/terra/informatica_rengo/iPlanning/mcodigos.php", function(data) {
    // 	obj = jQuery.parseJSON(data);
    // 		for ( var i = 0; i < obj.length; i++) {
    // 			addCodigo(obj[i].ITEM_NO,obj[i].DESCRIPCION,obj[i].FAM_GES,obj[i].FAM_COM,obj[i].FAM_PROD,obj[i].TIPO,obj[i].ENVASE,obj[i].UM,obj[i].PESO_NETO,obj[i].PLANTA,obj[i].COD_FAM);
    // 		}
    //   })
    listPedidos();
}

function initDb() {
    db = window.openDatabase("PEDIDOS", "0.1", "Database Pedidos", 200000);
    setear_tabla();
}

function detalle(id){
    db.transaction( function(tx) {
                   tx.executeSql("SELECT fecha,producto,observaciones,minutos,idpedido FROM pedidos WHERE idpedido=" + id, [],
                  function(tx, result){
                                 $("#producto").val(result.rows.item(0)['producto']);
                                 $("#observaciones").val(result.rows.item(0)['observaciones']);
                                 $("#minutos").val(result.rows.item(0)['minutos']);
                                 $("#idpedido").val(id);
                });
                   var titulo = document.getElementById("titulo");
                 titulo.innerHTML="Editar Pedido";
     });
}
function showPedidos(productos) {
    
    var place = document.getElementById("listado_pedidos");
    //place.removeChild(place.getElementsByTagName("form"));
    if (place.getElementsByTagName("ul").length > 0 ){
        var uelim=place.getElementsByTagName("ul")[0];
        place.removeChild(uelim);
    }
    //var list = document.createElement("ul");
    //list.setAttribute("data-role","listview");
    //list.setAttribute("data-filter","true");
    //list.setAttribute("data-insert","true");
    //list.setAttribute("data-theme","c");
    var mHTML='<ul data-role="listview" data-inset="true" data-theme="c" data-dividertheme="d" id="listado">';
    for ( var i = 0; i < productos.length; i++) {
        //var item = document.createElement("li");
        //item.innerHTML += productos[i][1] + ' - ' + productos[i][2]+ ' - ' + productos[i][3] + ' min.'  ;
        var mHTML= mHTML + '<li><a href="#nuevo" onclick="detalle('+productos[i][4] + ')">' + productos[i][1] + ' - ' + productos[i][2]+ ' - ' + productos[i][3] + ' min.' + '</a></li>';
        //list.appendChild(item);
    }
    var mHTML= mHTML + '</ul>';
    //place.appendChild(list);
    document.getElementById("listado_pedidos").innerHTML = mHTML;
    //place.innerHTML = mHTML;
    $("#listado").listview();
}

function listPedidos() {
    db.transaction( function(tx) {
                   tx.executeSql("SELECT fecha,producto,observaciones,minutos,idpedido FROM pedidos ", [],
                                 function(tx, result){
                                 var output = [];
                                 for(var i=0; i < result.rows.length; i++) {
                                 output.push([result.rows.item(i)['fecha'],
                                              result.rows.item(i)['producto'],
                                              result.rows.item(i)['observaciones'],
                                              result.rows.item(i)['minutos'],
                                              result.rows.item(i)['idpedido']]);
                                 }
                                 
                                 showPedidos(output);
                                 
                                 });
                   });
}

function addPedido(producto,fecha,observaciones,minutos) {
    db.transaction( function(tx) {
                   tx.executeSql("INSERT INTO pedidos(producto,minutos,observaciones,fecha) VALUES(?,?,?,?)", [producto,minutos,observaciones,fecha]);
                   alert('Pedido grabado');
                   listPedidos();
                   });
    resetForm($('#form-pedido'));
    
}
function editPedido(producto,fecha,observaciones,minutos,idpedido) {
    db.transaction( function(tx) {
                   tx.executeSql("UPDATE  pedidos SET producto='"+producto+ "',minutos='"+minutos+"',observaciones='"+observaciones+"' WHERE idpedido = " + idpedido, []);
                   alert('Pedido editado');
                   listPedidos();
                   });
    resetForm($('#form-pedido'));
    
}

function showCodigosDetalle(cod) {
    //alert(cod);
    var place = document.getElementById("grid");
    if (place.getElementsByTagName("ul").length > 0 )
        place.removeChild(place.getElementsByTagName("ul")[0]);
    var list = document.createElement("ul");
    list.setAttribute("data-role","listview");
    list.setAttribute("data-filter","true");
    list.setAttribute("data-insert","true");
    var fam_array = [];
    for ( var i = 0; i < cod.length; i++) {
        
        var item2 = document.createElement("li");
        item2.innerHTML += '<h3>'+cod[i][1]+'</h3><p><strong>'+cod[i][2]+'</strong></p><p class="ui-li-aside"><strong>'+cod[i][5]+'</strong> '+cod[i][4]+' (<strong>'+cod[i][3]+'</strong>)</p>';
        list.appendChild(item2);
    }
    place.appendChild(list);
    $('body').append("").trigger('create');
}

$(document).ready(function() {
                  //Cuando presiono enviar, llamo a la funcion que agrega el pedido
                  //si encuentro un id en el campo hidden idpedido, llamo editar
                  $('#form-pedido').submit(function(e) {
                                           e.preventDefault();
                                           //regoger datos desde formulario para grabar
                                           var idpedido = $("#idpedido").val();
                                           var observaciones = $("#observaciones").val();
                                           var producto = $("#producto").val();
                                           var minutos = $("#minutos").val();
                                           var fecha='';
                                           if(idpedido==''){
                                           addPedido(producto,fecha,observaciones,minutos);
                                           }else{
                                           editPedido(producto,fecha,observaciones,minutos,idpedido);
                                           }
                                           return false;
                                           });
                  return false;
                  });
function resetForm($form) {
    //limpio campos de formulario y seteo titulo
    $form.find('input:text, input:password, input:file, select, textarea').val('');
    $form.find('input:radio, input:checkbox')
    .removeAttr('checked').removeAttr('selected');
    var titulo = document.getElementById("titulo");
    titulo.innerHTML="Nuevo Pedido";
}

$("#page1").live("pageinit",function(){
                 initDb();
                 });
function salir(){
    navigator.app.exitApp();
}
function back(){
    navigator.app.backHistory();
}
$( document ).bind( "mobileinit", function() {
                   // Make your jQuery Mobile framework configuration changes here!
                   //super.setIntegerProperty("loadUrlTimeoutValue", 60000);
                   
                   });
$.mobile.transitionFallbacks.slideout = "none";
$.mobile.changePage
//
