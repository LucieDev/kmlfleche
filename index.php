<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>Outil de création de flèche</title>
		 <!-- Bootstrap -->
		<link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet"/>
		<link href="assets/css/style.css" rel="stylesheet" type="text/css" />
        <link href="vendor/bootstrap-colorpicker-master/src/css/docs.css" rel="stylesheet">
		<link href="vendor/bootstrap-colorpicker-master/dist/css/bootstrap-colorpicker.min.css" rel="stylesheet">
    </head>
    <body>
		<div class="container">
		
			<h1><span class="glyphicon glyphicon-share-alt"></span>Outil de création de flèche géolocalisée</h1>
			
			<p>Cet outil vous permet de dessiner une flèche que vous pourrez exporter pour pouvoir la placer sur vos propres cartes intéractives.
			Vous pouvez choisir les principales caractéristiques de votre flèche, notamment sa position et son aspect.</p>
			
			<p>Pour apprendre à créer une carte Google map vous pouvez consulter <a href="https://developers.google.com/maps/documentation/javascript/tutorial?hl=FR" target="_blank" title="API Google Map"> cette page</a>.</p>
			
			<h2>Options</h2>
			<p>Ici vous pouvez choisir les principales caractéristiques de la flèche ou laissez les caractéristiques par défaut.</p>
			<div class="row">
				<div class="col-md-2">
					<div class="input-group">
						<input type="text" id="fepaisseur" value="2" class="form-control"/><div class="input-group-addon">épaisseur (px)</div>
					</div>
				</div>
				<div class="col-md-2">
					<div class="input-group">
						<div class="input-group-addon"><img src="assets/img/colorp.png" alt="C" /></div>
						<input type="text" id="fcouleur" value="#00ffff" class="form-control" />
					</div>
				</div>
				<div class="col-md-3">
					<select class="form-control" id="ftrait">
						<option value="0">sans trait au bout</option>
						<option value="1">avec trait</option>
					</select>
				</div>
			</div>
			
			<div class="space10"></div>
			
			<div class="row">
				<div class="col-md-3">
					<select class="form-control" id="fplein">
						<option value="0">pointe non remplie</option>
						<option value="1">pointe pleine</option>
					</select>
				</div>
				
				<div class="col-md-2">
					<select class="form-control" id="fpointe">
						<option value="6">pointe normale</option>
						<option value="8">petite pointe</option>
						<option value="4">grande pointe</option>
					</select>
				</div>
				<div class="col-md-2">
					<select class="form-control" id="fdouble">
						<option value="0">simple flèche</option>
						<option value="1">double flèche</option>
					</select>
				</div>
				<div class="col-md-3">
					<div class="input-group">
						<button type="button" id="fsubmit" class="btn btn-info">OK</button>
					</div>
				</div>
			</div>
			
			<!-- Map -->
			<h2>Carte</h2>
			<p>En cliquant sur la carte positionnez le bout puis la pointe de votre flèche. A tout moment vous pouvez déplacer les points pour modifier la longueur et la position de la flèche.</p>
			<p>Vous pouvez vous déplacer sur la carte avant de tracer la flèche soit en utilisant les contrôles de la carte soit en tapant le nom d'un lieu dans le champ ci-dessous :</p>
			<div class="input-group btn-group">
				<div class="input-group-addon"><span class="glyphicon glyphicon-search"></span></div>
				<input type="text" class="form-control moy-input" id="floc" placeholder="Montpellier"/>
				<input type="button" id="flocsubmit" class="btn btn-info" value="Centrer sur ce lieu"/>
			</div>
			
			<div id="map-canvas">Impossible de charger la carte</div>
			<div class="space10"></div>
			
			<div class="row">
				<div class="col-md-3">
					<div class="input-group btn-group">
						<div class="input-group-addon"><span class="glyphicon glyphicon-map-marker"></span></div>
						<button type="button" id="findFleche" class="btn btn-info">Centrer la carte sur la flèche</button>
					</div>
				</div>
				
				<div class="col-md-3">
					<div class="input-group btn-group">
						<div class="input-group-addon"><span class="glyphicon glyphicon-minus"></span></div>
						<button type="button" id="deleteFleche" class="btn btn-danger">Supprimer la flèche</button>
					</div>
				</div>
			</div>
			
			
			<!-- Export -->
			<div id="fexport">
				<h2><span class="glyphicon glyphicon-export"></span>Export kml</h2>
				<p>
					Vous pouvez exporter votre flèche pour l'insérer par la suite dans votre propre carte. Pour cela cliquez sur le bouton "Générer le kml" et copiez puis collez votre code dans un fichier vide d'extension <b>.kml</b>.
				</p>
				
				<div class="row">
					<div class="col-md-2">
						<button type="button" id="exportkml" class="btn btn-warning">Générer le kml</button>
					</div>
					<div class="col-md-8" style="display:none;" id="divtxtfleche">
						<textarea id="txtfleche" class="input-form" rows="5" cols="85"></textarea>
						<i>Code à copier (placez vous dans le champ puis faites : CTRL + A puis CTRL + C)</i>
					</div>
				</div>
				
				<h2>Insertion du fichier kml sur votre carte</h2>
				<p>Vous pouvez tester votre code dans l'outil suivant : <a href="http://kml-samples.googlecode.com/svn=/trunk/interactive/index.html" target="_blank">http://kml-samples.googlecode.com/svn=/trunk/interactive/index.html</a>.</p>
				<p>
					Si vous utilisez Google Map API en javaScript voici comment déclarer votre kml :
					<div class="space10"></div>
					<code type="javascript">
					var monkml = new google.maps.KmlLayer(urlAbsolueDeVotreKml); // Attention il est possible qu'une url en 127.0.0.1 ne fonctionne pas il faudra alors passer votre kml en ligne<br/>
					monkml.setMap(map:Map); // Map : votre objet google.maps.Map<br/>
					monkml.set('preserveViewport', true); // Si vous ne voulez pas que l'ajout du kml change le centrage de la carte<br/>
					</code>
				</p>
			</div>
			
		</div>
		
		<div class="footer"><span class="name"><span class="glyphicon glyphicon-user"></span>Outil développé par Lucie CHOMEL  - <span class="glyphicon glyphicon-envelope"></span><a id="mailto" href="javascript:;" id="contact">contact</a></span></div>
		
		<!-- Javascript -->
		
		<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
		
		<script type="text/javascript" src="assets/gmap/mfleche.js"></script>
		
		<!-- Include all compiled plugins (below), or include individual files as needed -->
		<script type="text/javascript" src="vendor/bootstrap/js/bootstrap.min.js"></script>
		<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBxKrcj2_kqo4OsbKt0MpnW4QyNXmH-X4U"></script>
		
		<!-- color picker from https://github.com/mjolnic/bootstrap-colorpicker -->
		<script src="vendor/bootstrap-colorpicker-master/dist/js/bootstrap-colorpicker.js"></script>
        <script src="vendor/bootstrap-colorpicker-master/src/js/docs.js"></script>
		
		<script type="text/javascript">
			$(document).ready(function() {
				<!-- Launch map -->
				mfleche.initmap();
				
				<!-- Active arrow -->
				polygoneFleche.resetPolygon();
				
				<!-- Colorpicker -->
				$('#fcouleur').colorpicker();
				
				<!-- Mailto -->
				$('#mailto').click(function() {
					var email = 'lucie.chomel.dev'+'@'+'gmail'+'.'+'com';
					document.location.href = 'mailto:'+email;
				});
				
				<!-- Localization field -->
				$('#flocsubmit').click(function() {
					mfleche.loc($('#floc').val());
				});
				
				<!-- Update arrow -->
				$('#fsubmit').click(function() {
					polygoneFleche.recalc();
				});
				
				<!-- Find arrow -->
				$('#findFleche').click(function() {
					polygoneFleche.findFleche();
				});

				<!-- Delete arrow -->
				$('#deleteFleche').click(function() {
					polygoneFleche.deleteFleche();
					$('#divtxtfleche').hide();
				});
				
				<!-- Export -->
				$('#exportkml').click(function() {
					polygoneFleche.exportkml();
				});			
			});
		</script>
		
		<script>
		  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

		  ga('create', 'UA-55364802-1', 'auto');
		  ga('send', 'pageview');

		</script>
	</body>
</html>