// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
  apiKey: "AIzaSyATlkbJJXn8NTNQmy50HrMtlRvX-g8Ivp0",
  authDomain: "pacoustic-atlas.firebaseapp.com",
  projectId: "acoustic-atlas"
  //storageBucket: 'acoustic-atlas.appspot.com'
});

// Globe
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhMzE4YzhlMC0zYWMyLTQyNWItYmFkZi04MzJhYzEyNGUxODAiLCJpZCI6MTY5MDUsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzEzMDUzNTl9.H2-dtkBwj9ik_vvYrE0deVJKfEWaJXz0YkM0U1QCHss";
var viewer = new Cesium.Viewer("cesiumContainer", {
  scene3DOnly: true,
  selectionIndicator: false,
  baseLayerPicker: false,
  creditsDisplay: false,
  animation: false,
  timeline: false,
  homeButton: false,
  navigationHelpButton: false,
  infoBox: false,
  fullscreenButton: false,
  geocoder: false
  /*terrainProvider : new Cesium.CesiumTerrainProvider({
      url : Cesium.IonResource.fromAssetId(3956),
      requestVertexNormals : true
  })*/
});

function img_create(src, title) {
  var img = document.createElement("img");
  img.src = "/img/" + src;
  if (title != null) {
    img.alt = title;
    img.title = title;
  }
  return img;
}

var db = firebase.firestore();
var dataSourceForCluster = new Cesium.CustomDataSource("clusters");
var pinBuilder = new Cesium.PinBuilder();

db.collection("locations")
  .get()
  .then(querySnapshot => {
    querySnapshot.forEach(doc => {
      console.log("data doc.id", doc.id, doc.data());
      // viewer.entities.add({
      // name : doc.data().name,
      // id: doc.id,
      // description: '<img src="' + doc.data().image + '">',
      // position : Cesium.Cartesian3.fromDegrees(doc.data().longitude, doc.data().latitude),
      // billboard : {
      // image : pinBuilder.fromText('📢', Cesium.Color.BLACK, 32).toDataURL(),
      // verticalOrigin : Cesium.VerticalOrigin.BOTTOM
      // }
      // });
      const { image, longitude, latitude } = doc.data();
      dataSourceForCluster.entities.add({
        name: doc.data().name,
        id: doc.id,
        description: '<img src="' + image + '">',
        position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
        billboard: {
          image: pinBuilder.fromText("📢", Cesium.Color.BLACK, 32).toDataURL(),
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM
        }
      });
    });
  }); //end db

var dataSourcePromise = viewer.dataSources.add(dataSourceForCluster);

dataSourcePromise.then(function(dataSource) {
  dataSource.clustering.pixelRange = 10;
  dataSource.clustering.minimumClusterSize = 2;
  dataSource.clustering.enabled = true;

  var removeListener;
  var pin50 = pinBuilder.fromText("50+", Cesium.Color.RED, 48).toDataURL();
  var pin40 = pinBuilder.fromText("40+", Cesium.Color.ORANGE, 48).toDataURL();
  var pin30 = pinBuilder.fromText("30+", Cesium.Color.YELLOW, 48).toDataURL();
  var pin20 = pinBuilder.fromText("20+", Cesium.Color.GREEN, 48).toDataURL();
  var pin10 = pinBuilder.fromText("10+", Cesium.Color.BLUE, 48).toDataURL();

  var singleDigitPins = new Array(8);
  for (var i = 0; i < singleDigitPins.length; ++i) {
    singleDigitPins[i] = pinBuilder
      .fromText("" + (i + 2), Cesium.Color.GRAY, 36)
      .toDataURL();
  }
  function customStyle() {
    if (Cesium.defined(removeListener)) {
      removeListener();
      removeListener = undefined;
    } else {
      removeListener = dataSource.clustering.clusterEvent.addEventListener(
        function(clusteredEntities, cluster) {
          cluster.label.show = false;
          cluster.billboard.show = true;
          cluster.billboard.id = cluster.label.id;
          cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;

          if (clusteredEntities.length >= 50) {
            cluster.billboard.image = pin50;
          } else if (clusteredEntities.length >= 40) {
            cluster.billboard.image = pin40;
          } else if (clusteredEntities.length >= 30) {
            cluster.billboard.image = pin30;
          } else if (clusteredEntities.length >= 20) {
            cluster.billboard.image = pin20;
          } else if (clusteredEntities.length >= 10) {
            cluster.billboard.image = pin10;
          } else {
            cluster.billboard.image =
              singleDigitPins[clusteredEntities.length - 2];
          }
        }
      );
    }

    // force a re-cluster with the new styling
    var pixelRange = dataSource.clustering.pixelRange;
    dataSource.clustering.pixelRange = 0;
    dataSource.clustering.pixelRange = pixelRange;
  }

  // start with custom style
  customStyle();

  var viewModel = {
    pixelRange: pixelRange,
    minimumClusterSize: minimumClusterSize
  };
  Cesium.knockout.track(viewModel);
});
//end of clusters

var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
// If the mouse is over a point of interest, change the entity billboard scale and color
var previousPickedEntity = undefined;
handler.setInputAction(function(movement) {
  var pickedPrimitive = viewer.scene.pick(movement.endPosition);
  var pickedEntity = Cesium.defined(pickedPrimitive)
    ? pickedPrimitive.id
    : undefined;
  let billboard;
  if (pickedEntity) {
    if (Cesium.isArray(pickedEntity)) {
      //billboard = pickedPrimitive.collection._billboards[0];
      //need to find return billboard, with this i always get the first billboard in the whole collection
    } else {
      billboard = pickedEntity.billboard;
    }
  }
  // Unhighlight the previously picked entity
  if (Cesium.defined(previousPickedEntity)) {
    previousPickedEntity.scale = 1.0;
    previousPickedEntity.color = Cesium.Color.WHITE;
  }
  // Highlight the currently picked entity
  if (Cesium.defined(pickedEntity) && billboard) {
    billboard.scale = 1.5;
    billboard.color = Cesium.Color.YELLOW;
    previousPickedEntity = billboard;
  }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

handler.setInputAction(function(e) {
  var pickedPrimitive = viewer.scene.pick(e.position);
  var pickedEntity = Cesium.defined(pickedPrimitive)
    ? pickedPrimitive.id
    : undefined;
  var ellipsoid = viewer.scene.globe.ellipsoid;
  if (pickedEntity && !Array.isArray(pickedEntity)) {
    //is not a cluster, it's a single pin
    var cartesian = new Cesium.Cartesian3(
      pickedEntity.position._value.x,
      pickedEntity.position._value.y,
      pickedEntity.position._value.z
    );
    if (cartesian) {
      var cartographic = ellipsoid.cartesianToCartographic(cartesian);
      // var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
      // var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
      //pickedEntity.position = cartesian;
      //var name = pickedEntity.name;
      var id = pickedEntity.id;
      // var result =
      //   id + "- " + name + ": " + longitudeString + ", " + latitudeString; // We can reuse this

      var docRef = db.collection("locations").doc(id);

      docRef
        .get()
        .then(function(doc) {
          const { IR_filename } = doc.data();

          if (doc.exists && IR_filename) {
            const { description, image, image_credit, IR_credit } = doc.data();
            let imageContainer = document.getElementById("image-container");
            let descriptionContainer = document.querySelectorAll(
              "#description-container span"
            )[0];
            let imageSet = document.querySelectorAll("#image-container img")[0];
            console.log("imageSet", imageSet);
            //let imageNew = img_create(doc.data().image, doc.data().name);
            //imageSet.replaceWith(imageNew);
            descriptionContainer.innerHTML = description;
            if (image_credit || IR_credit) {
              const imageCreditContainer = document.createElement("div");
              imageCreditContainer.style.fontSize = "0.8em";
              let creditsText = "";
              if (image_credit)
                creditsText += "Photo by: " + image_credit + ".";
              if (IR_credit) creditsText += " IR Credit: " + IR_credit + ".";
              imageCreditContainer.innerHTML = creditsText;
              descriptionContainer.appendChild(imageCreditContainer);
            }
            descriptionContainer.parentNode.style.position = "absolute";
            descriptionContainer.parentNode.style.bottom = 0;

            //mobile
            if (document.body.clientWidth <= 600) {
              let rightPanel = document.querySelector(".panel-right");
              rightPanel.style.display = "block";
              rightPanel.style.position = "absolute";
              rightPanel.style.width = "100vw";
              rightPanel.style.height = "100vh";
              descriptionContainer.style.overflow = "scroll";
              descriptionContainer.parentNode.style.maxHeight = "200px";
            }

            imageContainer.style.backgroundImage = "url('img/" + image + "')";

            imageContainer.style.display = "block";
            loadIr("./ir/" + IR_filename);
            //loadAmbient1("./audios/"+ doc.data().Ambient1_filename);
            //loadAmbient2("./audios2/"+ doc.data().Ambient2_filename);
            console.log("Document data:", doc.data());

            //color active marker
            // let allBillboards =
            //   dataSourceForCluster._primitives._primitives[0]
            //     ._billboardCollection._billboards;
            // console.log("allBillboards", allBillboards);

            // if (Cesium.isArray(allBillboards)) {
            //   for (let i = 0; i < allBillboards.length; ++i) {
            //     allBillboards[i].color = Cesium.Color.WHITE;
            //     allBillboards[i].scale = 1.0;
            //   }
            // }
            //pickedEntity.billboard.color = Cesium.Color.RED;
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        });
    }
  } else {
    //clicked on a cluster

    if (Cesium.defined(pickedPrimitive)) {
      var cartesian = new Cesium.Cartesian3(
        pickedPrimitive.primitive._position.x,
        pickedPrimitive.primitive._position.y,
        pickedPrimitive.primitive._position.z
      );
      if (cartesian) {
        var cartographic = ellipsoid.cartesianToCartographic(cartesian);
        var longitudeCluster = Cesium.Math.toDegrees(
          cartographic.longitude
        ).toFixed(10);
        var latitudeCluster = Cesium.Math.toDegrees(
          cartographic.latitude
        ).toFixed(10);

        let currentZoomLevel = viewer.camera.positionCartographic.height;
        let zoom = currentZoomLevel - currentZoomLevel / 1.5;

        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(
            longitudeCluster,
            latitudeCluster,
            zoom
          )
        });
      }
      // var ids = pickedLabel.id;
      // if (Cesium.isArray(ids)) {
      // 	for (var i = 0; i < ids.length; ++i) {
      // 		ids[i].billboard.color = Cesium.Color.RED;
      // 	}
      // }
    }
  }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
  Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
);

/*viewer.entities.add({
    id: 'mou',
    label: {
        // position : Cesium.Cartesian2.ZERO, 
        show: true   // Removed semicolon here
    }
});
    viewer.scene.canvas.addEventListener('mousemove', function(e) {
    var entity = viewer.entities.getById('mou');
    var ellipsoid = viewer.scene.globe.ellipsoid;
    // Mouse over the globe to see the cartographic position 
    var cartesian = viewer.camera.pickEllipsoid(new Cesium.Cartesian3(e.clientX, e.clientY), ellipsoid);
    if (cartesian) {
        var cartographic = ellipsoid.cartesianToCartographic(cartesian);
        var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(10);
        var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(10);
        entity.position = cartesian;
        entity.label.show = true;
        entity.label.font_style = 84;
        //entity.position= Cesium.Cartesian2.ZERO; 
        entity.label.text = '(' + longitudeString + ', ' + latitudeString + ')';
        var result = entity.label.text;  // We can reuse this
        document.getElementById("demo").innerHTML = result;
    } else {
        entity.label.show = false;
    }
});*/
