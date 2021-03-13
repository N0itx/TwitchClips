//===== COPY TO CLIPBOARD =====//

function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
}

//===== TOP CLIPS BY CHANNEL =====//
$(document).ready(function() {
  $("#submit_search #user_search").click(function() {
    var channel = document.getElementById('username').value;
    var tiempo = document.getElementById('tiempo').value;
    var cantidad = document.getElementById('cantidad').value;

    if (channel.length == 0) {
      $("div#api").html(`Asegurate de poner el nombre del Streaer del cual quieres ver Clips`);
    }

    var userURL = `https://api.twitch.tv/kraken/clips/top?channel=${channel.toLowerCase()}&period=${tiempo}&trending=false&limit=${cantidad}`;
    $.ajax({
      url: userURL,
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json',
      headers: {
        'Accept': 'application/vnd.twitchtv.v5+json',
        'Client-ID': 'njdjdkepu3gygen6rwc9lxwaio4082'
      },
      success: function(data) {

        if (data.clips.length == 0) {
          $("div#api").html(`0 Clips detectados en [ ${channel} / ${tiempo} / false / ${cantidad} ]`);
          return
        } else {
          $("div#api").text(`Streamer: ${channel} | Clips: ${data.clips.length} | Periodo: ${tiempo} | Trending: false`);
        }

        // console.log(data);
        // return

        cloneElement(data);

        $("div #streamer-info").append(`
          <img src="${data.clips[0].broadcaster.logo}" alt="broadcaster.logo">
          <h2>${data.clips[0].broadcaster.display_name}</h2>
          <p>UserID: ${data.clips[0].broadcaster.id}</p>
          <a href="${data.clips[0].broadcaster.channel_url}">${data.clips[0].broadcaster.channel_url}</a>
        `);

        function cloneElement(data) {
          for (var i = 0; i < data.clips.length; i++) {

            let titulo = data.clips[i].title.substring(0, 20);
            let categoria = data.clips[i].game;
            let duracion = data.clips[i].duration;
            let views = data.clips[i].views;
            let slug = data.clips[i].slug;
            let url = data.clips[i].url.split("?");
            let autor = data.clips[i].curator.display_name;
            let fecha = data.clips[i].created_at.substring(0, 10).split('-');

            if (document.getElementById("dl-check").checked) {
              let id = data.clips[i].tracking_id;
              
              let video = data.clips[i].thumbnails.medium.replace("-preview-480x272.jpg", ".mp4")

              $("div #lista-clips").append(`
                <div class="clip">
                <div id="info">Titulo: <b>${titulo}...</b> | Categoria: <b>${categoria}</b> | Duracion: <b>${duracion}s</b> | Views: <b>${views}</b></div><br>
                <video width="720" height="440" controls>
                    <source src="${video}" type="video/mp4">
                </video>
                <br><div id="slug" class="info">${url[0]}</div>
                <a href='${video}' download="${titulo} - ${fecha[0]} - ${autor}" class="dl-clip">Descargar</a>
                <div class="info">Autor: ${autor} | Fecha: ${fecha[2]}/${fecha[1]}/${fecha[0]}</div><br>
                <div class="separador pto"></div>
                </div>
              `);
            } else {
              $("div #lista-clips").append(`
                <div id="info">Titulo: <b>${titulo}...</b> | Categoria: <b>${categoria}</b> | Duracion: <b>${duracion}s</b> | Views: <b>${views}</b></div><br>
                <iframe data-src="https://clips.twitch.tv/embed?clip=${slug}&amp;parent=n0itx.github.io" frameborder="0" scrolling="no" autoplay="true" preload="metadata" allowfullscreen="true" src="https://clips.twitch.tv/embed?clip=${slug}&amp;parent=n0itx.github.io"></iframe>
                <br><div id="slug" class="info">${url[0]}</div>
                <br><div class="info">${autor}</div>
                <div class="separador pto"></div>
              `);
            }
          }
        }
        //===== COPY TO CLIPBOARD =====//
        $("div#slug").click(function() {
          copyToClipboard(this)
          $(this).css({
            color: '#70ffa9'
          });
          $(this).text(`LINK COPIADO!`)
        });
      }
    });
    //===== BORRA LOS CLIPS ANTERIORES Y GENERA NUEVOS =====//
    $(document).on("click", "#user_search", function() {
      $(".row").remove();
      $("#contenido").append(`
        <div class="row">
          <div id="lista-clips" class="column-left">
          </div>
          <div class="column-right">
            <div id="streamer-info" class="desc">
            </div>
          </div>
        </div>
      `);
    });
  });
});


//===== GET CLIP INFO FROM SLUG =====//
$(document).ready(function() {
  $("#submit_search #clip_search").click(function() {
    var slug = document.getElementById('clip_url').value;

    /*
    https://clips.twitch.tv/PeppyStylishSaladPanicBasket--mRZFM54EU9cdzTX
    https://www.twitch.tv/soypan/clip/PeppyStylishSaladPanicBasket--mRZFM54EU9cdzTX?filter=clips&range=24hr&sort=time
    */
    if (slug.includes('twitch.tv')) {
      slug = slug.split('/')[slug.includes('clips.') ? 3 : 5];
      if (slug.includes('?')) { slug = slug.split('?')[0] }
    }

    var userURL = `https://api.twitch.tv/kraken/clips/${slug}`;
    $.ajax({
      url: userURL,
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json',
      headers: {
        'Accept': 'application/vnd.twitchtv.v5+json',
        'Client-ID': 'njdjdkepu3gygen6rwc9lxwaio4082'
      },
      success: function(data) {

        // console.log(data);
        // return
        
        $("div#api").html(`Streamer: ${data.broadcaster.display_name} | Autor: ${data.curator.display_name} | Fecha: ${data.created_at.split('T')[0]} | VOD: <a href="${data.vod.url}">${data.vod.url}</a>`)

        $("div #streamer-info").append(`
          <img src="${data.broadcaster.logo}" alt="broadcaster.logo">
          <h2>${data.broadcaster.display_name}</h2>
          <p>UserID: ${data.broadcaster.id}</p>
          <a href="${data.broadcaster.channel_url}">${data.broadcaster.channel_url}</a>
        `);

        let titulo = data.title.substring(0, 20);
        let categoria = data.game;
        let duracion = data.duration;
        let views = data.views;
        let slug = data.slug;
        let url = data.url.split("?");
        let autor = data.curator.display_name;

        if (document.getElementById("dl-check").checked) {
          //TOMA LA URL DEL VIDEO TRANSFORMANDO LA URL DE LA PREVIEW
          let video = data.thumbnails.medium.replace("-preview-480x272.jpg", ".mp4")

          $("div #lista-clips").append(`
            <div id="info">Titulo: <b>${titulo}...</b> | Categoria: <b>${categoria}</b> | Duracion: <b>${duracion}s</b> | Views: <b>${views}</b></div><br>
            <video width="720" height="440" controls>
                <source src="${video}" type="video/mp4">
            </video>
            <br><div id="slug" class="info">${url[0]}</div>
          `);
        } else {
          $("div #lista-clips").append(`
            <div id="info">Titulo: <b>${titulo}...</b> | Categoria: <b>${categoria}</b> | Duracion: <b>${duracion}s</b> | Views: <b>${views}</b></div><br>
            <iframe data-src="https://clips.twitch.tv/embed?clip=${slug}&amp;parent=n0itx.github.io" frameborder="0" scrolling="no" autoplay="true" preload="metadata" allowfullscreen="true" src="https://clips.twitch.tv/embed?clip=${slug}&amp;parent=n0itx.github.io"></iframe>
            <br><div id="slug" class="info">${url[0]}</div>
          `);
        }

        //===== COPY TO CLIPBOARD =====//
        $("div#slug").click(function() {
          copyToClipboard(this)
          $(this).css({
            color: '#70ffa9'
          });
          $(this).text(`LINK COPIADO!`)
        });
      },
      error: function(data) {
        $("div#api").text(`No se detecto ningun clip, asegurate que el link que proporcionaste sea el correcto`);
      }
    });
    $(document).on("click", "#clip_search", function() {
      $(".row").remove();
      $("#contenido").append(`
        <div class="row">
          <div id="lista-clips" class="column-left">
          </div>
          <div class="column-right">
            <div id="streamer-info" class="desc">
            </div>
          </div>
        </div>
      `);
    });
  });
});

//===== API OPTION TABS =====//
function optionClips(evt, s_option) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(s_option).style.display = "block";
  evt.currentTarget.className += " active";
}
document.getElementById("defaultOpen").click();